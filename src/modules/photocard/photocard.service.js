import { prisma } from "../../lib/prisma.js";
import * as photocardRepository from "./photocard.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";

const MONTHLY_CREATE_LIMIT = 3;

function getStartOfThisMonth() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), 1);
}

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
  if (!cursor) {
    return {};
  }

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
  if (!lastItem) {
    return null;
  }

  return encodeCursor({
    id: lastItem.id,
    createdAt: lastItem.createdAt,
  });
}

export async function createPhotocard(userId, data) {
  return prisma.$transaction(async (tx) => {
    const createdCount = await photocardRepository.countCreatedThisMonth(
      userId,
      getStartOfThisMonth(),
      tx,
    );

    if (createdCount >= MONTHLY_CREATE_LIMIT) {
      throw new AppError(
        "이번 달 포토카드 생성 가능 횟수를 모두 사용했습니다.",
        400,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    const photocard = await photocardRepository.createPhotocard(
      {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        genre: data.genre,
        grade: data.grade,
        minPrice: data.minPrice,
        totalQuantity: data.totalQuantity,
        creatorId: userId,
      },
      tx,
    );

    await photocardRepository.createOwnership(
      {
        userId,
        photocardId: photocard.id,
        quantity: data.totalQuantity,
      },
      tx,
    );

    return photocard;
  });
}

export async function getMyPhotocards(userId, query) {
  const limit = getLimit(query);
  const where = createCursorWhere(query.cursor);

  const items = await photocardRepository.findMyPhotocards({
    userId,
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

export async function getMyCreateCount(userId) {
  const count = await photocardRepository.countCreatedThisMonth(
    userId,
    getStartOfThisMonth(),
  );
  const limit = MONTHLY_CREATE_LIMIT;
  const remaining = Math.max(0, limit - count);

  return {
    count,
    limit,
    remaining,
  };
}

export async function getPhotocard(photocardId) {
  const photocard = await photocardRepository.findPhotocardById(photocardId);

  if (!photocard) {
    throw new AppError(
      "포토카드를 찾을 수 없습니다.",
      404,
      ERROR_CODE.NOT_FOUND,
    );
  }

  return photocard;
}
