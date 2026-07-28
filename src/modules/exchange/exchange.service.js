import { prisma } from "../../lib/prisma.js";
import * as exchangeRepository from "./exchange.repository.js";
import * as notificationRepository from "../notification/notification.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";
import { formatCardLabel } from "../notification/notification.util.js";

function encodeCursor(cursorData) {
  return Buffer.from(JSON.stringify(cursorData)).toString("base64");
}

function decodeCursor(cursor) {
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  } catch (error) {
    throw new AppError(
      "유효하지 않은 cursor입니다.",
      400,
      ERROR_CODE.BAD_REQUEST,
    );
  }
}

function getLimit(query) {
  return Math.min(Math.max(Number(query.limit) || 12, 1), 50);
}

function createCursorWhere(cursor) {
  if (!cursor) return {};

  const decodedCursor = decodeCursor(cursor);

  return {
    OR: [
      {
        createdAt: {
          lt: new Date(decodedCursor.createdAt),
        },
      },
      {
        createdAt: new Date(decodedCursor.createdAt),
        id: {
          lt: decodedCursor.id,
        },
      },
    ],
  };
}

function createNextCursor(lastItem) {
  if (!lastItem) return null;

  return encodeCursor({
    id: lastItem.id,
    createdAt: lastItem.createdAt,
  });
}

function mergeWhere(baseWhere, cursorWhere) {
  if (!cursorWhere || Object.keys(cursorWhere).length === 0) {
    return baseWhere;
  }

  return {
    AND: [baseWhere, cursorWhere],
  };
}

export async function createExchange(proposerId, shopListingId, data) {
  const shopListing =
    await exchangeRepository.findShopListingById(shopListingId);

  if (!shopListing) {
    throw new AppError("판매글을 찾을 수 없습니다.", 404, ERROR_CODE.NOT_FOUND);
  }

  if (shopListing.status !== "ON_SALE") {
    throw new AppError(
      "판매 중인 포토카드에만 교환 제안할 수 있습니다.",
      400,
      ERROR_CODE.BAD_REQUEST,
    );
  }

  if (shopListing.userId === proposerId) {
    throw new AppError(
      "본인의 판매글에는 교환 제안할 수 없습니다.",
      400,
      ERROR_CODE.BAD_REQUEST,
    );
  }

  if (shopListing.remainingQuantity < 1) {
    throw new AppError(
      "교환 가능한 수량이 없습니다.",
      400,
      ERROR_CODE.SHOP_LISTING_SOLD_OUT,
    );
  }

  const proposerOwnership =
    await exchangeRepository.findOwnershipByUserAndPhotocard(
      proposerId,
      data.photocardId,
    );

  if (!proposerOwnership || proposerOwnership.quantity < 1) {
    throw new AppError(
      "교환 제안할 카드 보유 수량이 부족합니다.",
      400,
      ERROR_CODE.INSUFFICIENT_OWNERSHIP_QUANTITY,
    );
  }

  if (data.photocardId === shopListing.ownership.photocardId) {
    throw new AppError(
      "동일한 포토카드로는 교환 제안할 수 없습니다.",
      400,
      ERROR_CODE.BAD_REQUEST,
    );
  }

  const exchange = await exchangeRepository.createExchange({
    shopListingId,
    proposerId,
    photocardId: data.photocardId,
    message: data.message,
  });

  await notificationRepository.createNotification({
    type: "EXCHANGE_RECEIVED",
    userId: shopListing.userId,
    targetId: exchange.id,
    message: `${proposerOwnership.user.nickname}님이 ${formatCardLabel(
      proposerOwnership.photocard.grade,
      proposerOwnership.photocard.name,
    )}의 포토카드 교환을 제안했습니다.`,
  });

  return exchange;
}

export async function getSentExchanges(userId, query) {
  const limit = getLimit(query);

  const baseWhere = {
    proposerId: userId,
    ...(query.status ? { status: query.status } : {}),
  };

  const cursorWhere = createCursorWhere(query.cursor);
  const where = mergeWhere(baseWhere, cursorWhere);

  const items = await exchangeRepository.findExchanges({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });

  const hasNextPage = items.length > limit;
  const slicedItems = hasNextPage ? items.slice(0, limit) : items;
  const lastItem = slicedItems[slicedItems.length - 1];

  return {
    items: slicedItems,
    nextCursor: hasNextPage ? createNextCursor(lastItem) : null,
    hasNextPage,
  };
}

export async function getReceivedExchanges(userId, query) {
  const limit = getLimit(query);

  const baseWhere = {
    shopListing: {
      userId,
    },
    ...(query.status ? { status: query.status } : {}),
  };

  const cursorWhere = createCursorWhere(query.cursor);
  const where = mergeWhere(baseWhere, cursorWhere);

  const items = await exchangeRepository.findExchanges({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });

  const hasNextPage = items.length > limit;
  const slicedItems = hasNextPage ? items.slice(0, limit) : items;
  const lastItem = slicedItems[slicedItems.length - 1];

  return {
    items: slicedItems,
    nextCursor: hasNextPage ? createNextCursor(lastItem) : null,
    hasNextPage,
  };
}

export async function acceptExchange(sellerId, exchangeId) {
  return prisma.$transaction(async (tx) => {
    const exchange = await exchangeRepository.findExchangeById(exchangeId, tx);

    if (!exchange) {
      throw new AppError(
        "교환 제안을 찾을 수 없습니다.",
        404,
        ERROR_CODE.NOT_FOUND,
      );
    }

    if (exchange.status !== "PENDING") {
      throw new AppError(
        "대기 중인 교환 제안만 승인할 수 있습니다.",
        400,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    const shopListing = exchange.shopListing;

    if (shopListing.userId !== sellerId) {
      throw new AppError(
        "본인의 판매글에 대한 교환 제안만 승인할 수 있습니다.",
        403,
        ERROR_CODE.FORBIDDEN,
      );
    }

    if (shopListing.status !== "ON_SALE" || shopListing.remainingQuantity < 1) {
      throw new AppError(
        "교환 가능한 판매 수량이 없습니다.",
        400,
        ERROR_CODE.SHOP_LISTING_SOLD_OUT,
      );
    }

    const proposerOwnership =
      await exchangeRepository.findOwnershipByUserAndPhotocard(
        exchange.proposerId,
        exchange.photocardId,
        tx,
      );

    if (!proposerOwnership || proposerOwnership.quantity < 1) {
      throw new AppError(
        "제안자의 카드 보유 수량이 부족합니다.",
        400,
        ERROR_CODE.INSUFFICIENT_OWNERSHIP_QUANTITY,
      );
    }

    await exchangeRepository.decreaseOwnershipQuantity(
      proposerOwnership.id,
      1,
      tx,
    );

    await exchangeRepository.upsertOwnership(
      {
        userId: sellerId,
        photocardId: exchange.photocardId,
        quantity: 1,
      },
      tx,
    );

    await exchangeRepository.upsertOwnership(
      {
        userId: exchange.proposerId,
        photocardId: shopListing.ownership.photocardId,
        quantity: 1,
      },
      tx,
    );

    const nextRemainingQuantity = shopListing.remainingQuantity - 1;

    await exchangeRepository.updateShopListing(
      shopListing.id,
      {
        remainingQuantity: nextRemainingQuantity,
        status: nextRemainingQuantity === 0 ? "SOLD_OUT" : "ON_SALE",
      },
      tx,
    );

    const updatedExchange = await exchangeRepository.updateExchange(
      exchange.id,
      {
        status: "ACCEPTED",
      },
      tx,
    );

    await notificationRepository.createNotification(
      {
        type: "EXCHANGE_ACCEPTED",
        userId: exchange.proposerId,
        targetId: exchange.id,
        message: `${shopListing.user.nickname}님과의 ${formatCardLabel(
          exchange.photocard.grade,
          exchange.photocard.name,
        )}의 포토카드 교환이 성사되었습니다.`,
      },
      tx,
    );

    if (nextRemainingQuantity === 0) {
      await notificationRepository.createNotification(
        {
          type: "CARD_SOLD_OUT",
          userId: sellerId,
          targetId: shopListing.id,
          message: `${formatCardLabel(
            shopListing.ownership.photocard.grade,
            shopListing.ownership.photocard.name,
          )}이 품절되었습니다.`,
        },
        tx,
      );
    }

    return updatedExchange;
  });
}

export async function rejectExchange(sellerId, exchangeId) {
  const exchange = await exchangeRepository.findExchangeById(exchangeId);

  if (!exchange) {
    throw new AppError(
      "교환 제안을 찾을 수 없습니다.",
      404,
      ERROR_CODE.NOT_FOUND,
    );
  }

  if (exchange.shopListing.userId !== sellerId) {
    throw new AppError(
      "본인의 판매글에 대한 교환 제안만 거절할 수 있습니다.",
      403,
      ERROR_CODE.FORBIDDEN,
    );
  }

  if (exchange.status !== "PENDING") {
    throw new AppError(
      "대기 중인 교환 제안만 거절할 수 있습니다.",
      400,
      ERROR_CODE.BAD_REQUEST,
    );
  }

  const updatedExchange = await exchangeRepository.updateExchange(exchangeId, {
    status: "REJECTED",
  });

  await notificationRepository.createNotification({
    type: "EXCHANGE_REJECTED",
    userId: exchange.proposerId,
    targetId: exchange.id,
    message: `${exchange.shopListing.user.nickname}님이 ${formatCardLabel(
      exchange.photocard.grade,
      exchange.photocard.name,
    )}의 포토카드 교환을 거절했습니다.`,
  });

  return updatedExchange;
}

export async function cancelExchange(proposerId, exchangeId) {
  const exchange = await exchangeRepository.findExchangeById(exchangeId);

  if (!exchange) {
    throw new AppError(
      "교환 제안을 찾을 수 없습니다.",
      404,
      ERROR_CODE.NOT_FOUND,
    );
  }

  if (exchange.proposerId !== proposerId) {
    throw new AppError(
      "본인이 보낸 교환 제안만 취소할 수 있습니다.",
      403,
      ERROR_CODE.FORBIDDEN,
    );
  }

  if (exchange.status !== "PENDING") {
    throw new AppError(
      "대기 중인 교환 제안만 취소할 수 있습니다.",
      400,
      ERROR_CODE.BAD_REQUEST,
    );
  }

  return exchangeRepository.updateExchange(exchangeId, {
    status: "CANCELLED",
  });
}
