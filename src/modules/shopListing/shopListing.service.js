import { prisma } from "../../lib/prisma.js";
import * as shopListingRepository from "./shopListing.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";

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

function getInfiniteScrollLimit(query) {
  return Math.min(Math.max(Number(query.limit) || 12, 1), 50);
}

function createShopListingWhere(query, userId) {
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.grade || query.genre || query.search) {
    where.ownership = {
      photocard: {},
    };

    if (query.grade) {
      where.ownership.photocard.grade = query.grade;
    }

    if (query.genre) {
      where.ownership.photocard.genre = query.genre;
    }

    if (query.search) {
      where.ownership.photocard.OR = [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }
  }

  return where;
}

function createOrderBy(sort) {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }, { id: "asc" }];
    case "price_asc":
      return [{ pricePerUnit: "asc" }, { id: "asc" }];
    case "price_desc":
      return [{ pricePerUnit: "desc" }, { id: "desc" }];
    case "latest":
    default:
      return [{ createdAt: "desc" }, { id: "desc" }];
  }
}

function createCursorWhere(query) {
  if (!query.cursor) {
    return {};
  }

  const cursor = decodeCursor(query.cursor);

  switch (query.sort) {
    case "oldest":
      return {
        OR: [
          {
            createdAt: {
              gt: new Date(cursor.createdAt),
            },
          },
          {
            createdAt: new Date(cursor.createdAt),
            id: {
              gt: cursor.id,
            },
          },
        ],
      };

    case "price_asc":
      return {
        OR: [
          {
            pricePerUnit: {
              gt: cursor.pricePerUnit,
            },
          },
          {
            pricePerUnit: cursor.pricePerUnit,
            id: {
              gt: cursor.id,
            },
          },
        ],
      };

    case "price_desc":
      return {
        OR: [
          {
            pricePerUnit: {
              lt: cursor.pricePerUnit,
            },
          },
          {
            pricePerUnit: cursor.pricePerUnit,
            id: {
              lt: cursor.id,
            },
          },
        ],
      };

    case "latest":
    default:
      return {
        OR: [
          {
            createdAt: {
              lt: new Date(cursor.createdAt),
            },
          },
          {
            createdAt: new Date(cursor.createdAt),
            id: {
              lt: cursor.id,
            },
          },
        ],
      };
  }
}

function createNextCursor(lastItem, sort) {
  if (!lastItem) {
    return null;
  }

  if (sort === "price_asc" || sort === "price_desc") {
    return encodeCursor({
      id: lastItem.id,
      pricePerUnit: lastItem.pricePerUnit,
    });
  }

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

export async function getShopListings(query) {
  const limit = getInfiniteScrollLimit(query);

  const baseWhere = createShopListingWhere(query);
  const cursorWhere = createCursorWhere(query);
  const where = mergeWhere(baseWhere, cursorWhere);
  const orderBy = createOrderBy(query.sort);

  const items = await shopListingRepository.findShopListings({
    where,
    orderBy,
    take: limit + 1,
  });

  const hasNextPage = items.length > limit;
  const slicedItems = hasNextPage ? items.slice(0, limit) : items;
  const lastItem = slicedItems[slicedItems.length - 1];

  return {
    items: slicedItems,
    nextCursor: hasNextPage ? createNextCursor(lastItem, query.sort) : null,
    hasNextPage,
  };
}

export async function getShopListingsAllforCount() {
  const items = await shopListingRepository.getAllShopListings();

  const counts = items.reduce(
    (acc, item) => {
      const { grade, genre } = item.ownership.photocard;
      const status = item.status;

      acc.grade[grade] = acc.grade[grade] ? acc.grade[grade] + 1 : 1;
      acc.genre[genre] = acc.genre[genre] ? acc.genre[genre] + 1 : 1;
      acc.status[status] = acc.status[status] ? acc.status[status] + 1 : 1;
      return acc;
    },
    { grade: {}, genre: {}, status: {} },
  );
  return {
    total: items.length,
    ...counts,
  };
}

export async function getMyShopListings(userId, query) {
  const limit = getInfiniteScrollLimit(query);

  const baseWhere = createShopListingWhere(query, userId);
  const cursorWhere = createCursorWhere(query);
  const where = mergeWhere(baseWhere, cursorWhere);
  const orderBy = createOrderBy(query.sort);

  const items = await shopListingRepository.findShopListings({
    where,
    orderBy,
    take: limit + 1,
  });

  const hasNextPage = items.length > limit;
  const slicedItems = hasNextPage ? items.slice(0, limit) : items;
  const lastItem = slicedItems[slicedItems.length - 1];

  return {
    items: slicedItems,
    nextCursor: hasNextPage ? createNextCursor(lastItem, query.sort) : null,
    hasNextPage,
  };
}

export async function createShopListing(userId, data) {
  return prisma.$transaction(async (tx) => {
    const ownership = await shopListingRepository.findOwnershipById(
      data.ownershipId,
      tx,
    );

    if (!ownership) {
      throw new AppError(
        "보유 카드를 찾을 수 없습니다.",
        404,
        ERROR_CODE.OWNERSHIP_NOT_FOUND || ERROR_CODE.NOT_FOUND,
      );
    }

    if (ownership.userId !== userId) {
      throw new AppError(
        "본인이 보유한 카드만 판매 등록할 수 있습니다.",
        403,
        ERROR_CODE.FORBIDDEN,
      );
    }

    if (ownership.quantity < data.quantity) {
      throw new AppError(
        "보유 수량이 부족합니다.",
        400,
        ERROR_CODE.INSUFFICIENT_OWNERSHIP_QUANTITY,
      );
    }

    await shopListingRepository.decreaseOwnershipQuantity(
      ownership.id,
      data.quantity,
      tx,
    );

    return shopListingRepository.createShopListing(
      {
        quantity: data.quantity,
        remainingQuantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        wishGrade: data.wishGrade,
        wishGenre: data.wishGenre,
        wishDescription: data.wishDescription,
        userId,
        ownershipId: data.ownershipId,
      },
      tx,
    );
  });
}

export async function getShopListing(shopListingId) {
  const shopListing =
    await shopListingRepository.findShopListingById(shopListingId);

  if (!shopListing) {
    throw new AppError(
      "판매글을 찾을 수 없습니다.",
      404,
      ERROR_CODE.SHOP_LISTING_NOT_FOUND || ERROR_CODE.NOT_FOUND,
    );
  }

  return shopListing;
}

export async function updateShopListing(userId, shopListingId, data) {
  const shopListing =
    await shopListingRepository.findShopListingById(shopListingId);

  if (!shopListing) {
    throw new AppError(
      "판매글을 찾을 수 없습니다.",
      404,
      ERROR_CODE.SHOP_LISTING_NOT_FOUND || ERROR_CODE.NOT_FOUND,
    );
  }

  if (shopListing.userId !== userId) {
    throw new AppError(
      "본인의 판매글만 수정할 수 있습니다.",
      403,
      ERROR_CODE.FORBIDDEN,
    );
  }

  if (shopListing.status !== "ON_SALE") {
    throw new AppError(
      "판매 중인 글만 수정할 수 있습니다.",
      400,
      ERROR_CODE.BAD_REQUEST,
    );
  }

  return shopListingRepository.updateShopListing(shopListingId, data);
}

export async function deleteShopListing(userId, shopListingId) {
  return prisma.$transaction(async (tx) => {
    const shopListing = await shopListingRepository.findShopListingById(
      shopListingId,
      tx,
    );

    if (!shopListing) {
      throw new AppError(
        "판매글을 찾을 수 없습니다.",
        404,
        ERROR_CODE.SHOP_LISTING_NOT_FOUND || ERROR_CODE.NOT_FOUND,
      );
    }

    if (shopListing.userId !== userId) {
      throw new AppError(
        "본인의 판매글만 판매 내리기 할 수 있습니다.",
        403,
        ERROR_CODE.FORBIDDEN,
      );
    }

    if (shopListing.status !== "ON_SALE") {
      throw new AppError(
        "판매 중인 글만 판매 내리기 할 수 있습니다.",
        400,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    if (shopListing.remainingQuantity > 0) {
      await shopListingRepository.increaseOwnershipQuantity(
        shopListing.ownershipId,
        shopListing.remainingQuantity,
        tx,
      );
    }

    return shopListingRepository.updateShopListing(
      shopListingId,
      {
        status: "CANCELLED",
        remainingQuantity: 0,
      },
      tx,
    );
  });
}

export async function purchaseShopListing(buyerId, shopListingId, quantity) {
  return prisma.$transaction(async (tx) => {
    const shopListing = await shopListingRepository.findShopListingById(
      shopListingId,
      tx,
    );

    if (!shopListing) {
      throw new AppError(
        "판매글을 찾을 수 없습니다.",
        404,
        ERROR_CODE.SHOP_LISTING_NOT_FOUND || ERROR_CODE.NOT_FOUND,
      );
    }

    if (shopListing.userId === buyerId) {
      throw new AppError(
        "본인의 판매글은 구매할 수 없습니다.",
        400,
        ERROR_CODE.CANNOT_BUY_OWN_LISTING || ERROR_CODE.BAD_REQUEST,
      );
    }

    if (
      shopListing.status !== "ON_SALE" ||
      shopListing.remainingQuantity < quantity
    ) {
      throw new AppError(
        "구매 가능한 수량이 부족합니다.",
        400,
        ERROR_CODE.SHOP_LISTING_SOLD_OUT,
      );
    }

    const buyer = await shopListingRepository.findUserById(buyerId, tx);
    const totalPrice = shopListing.pricePerUnit * quantity;

    if (!buyer || buyer.points < totalPrice) {
      throw new AppError(
        "포인트가 부족합니다.",
        400,
        ERROR_CODE.INSUFFICIENT_POINTS,
      );
    }

    await shopListingRepository.decreaseUserPoints(buyerId, totalPrice, tx);
    await shopListingRepository.increaseUserPoints(
      shopListing.userId,
      totalPrice,
      tx,
    );

    await shopListingRepository.upsertOwnership(
      {
        userId: buyerId,
        photocardId: shopListing.ownership.photocardId,
        quantity,
      },
      tx,
    );

    const nextRemainingQuantity = shopListing.remainingQuantity - quantity;

    const updatedListing = await shopListingRepository.updateShopListing(
      shopListingId,
      {
        remainingQuantity: nextRemainingQuantity,
        status: nextRemainingQuantity === 0 ? "SOLD_OUT" : "ON_SALE",
      },
      tx,
    );

    await shopListingRepository.createNotification(
      {
        type: "PURCHASE_COMPLETED",
        userId: buyerId,
        targetId: shopListingId,
        message: `${shopListing.ownership.photocard.name} 구매가 완료되었습니다.`,
      },
      tx,
    );

    await shopListingRepository.createNotification(
      {
        type: "CARD_SOLD",
        userId: shopListing.userId,
        targetId: shopListingId,
        message: `${shopListing.ownership.photocard.name} 카드가 판매되었습니다`,
      },
      tx,
    );

    if (nextRemainingQuantity === 0) {
      await shopListingRepository.createNotification(
        {
          type: "CARD_SOLD_OUT",
          userId: shopListing.userId,
          targetId: shopListingId,
          message: `${shopListing.ownership.photocard.name} 판매글이 품절되었습니다.`,
        },
        tx,
      );
    }

    return updatedListing;
  });
}

export async function getShopListingExchanges(userId, shopListingId) {
  const shopListing =
    await shopListingRepository.findShopListingById(shopListingId);

  if (!shopListing) {
    throw new AppError(
      "판매글을 찾을 수 없습니다.",
      404,
      ERROR_CODE.SHOP_LISTING_NOT_FOUND || ERROR_CODE.NOT_FOUND,
    );
  }

  if (shopListing.userId !== userId) {
    throw new AppError(
      "본인의 판매글에 들어온 교환 제안만 조회할 수 있습니다.",
      403,
      ERROR_CODE.FORBIDDEN,
    );
  }

  const items =
    await shopListingRepository.findShopListingExchanges(shopListingId);

  return { items };
}
