import * as ownershipRepository from "./ownership.repository.js";
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

function getLimit(query) {
  return Math.min(Math.max(Number(query.limit) || 12, 1), 50);
}

function createOwnershipWhere(query) {
  const where = {};

  if (query.grade || query.genre || query.search) {
    where.photocard = {};

    if (query.grade) {
      where.photocard.grade = query.grade;
    }

    if (query.genre) {
      where.photocard.genre = query.genre;
    }

    if (query.search) {
      where.photocard.OR = [
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

function createCursorWhere(cursor) {
  if (!cursor) {
    return {};
  }

  const decodedCursor = decodeCursor(cursor);

  return {
    OR: [
      {
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

export async function getMyOwnerships(userId, query) {
  const limit = getLimit(query);

  const baseWhere = createOwnershipWhere(query);
  const cursorWhere = createCursorWhere(query.cursor);
  const where = mergeWhere(baseWhere, cursorWhere);

  const items = await ownershipRepository.findMyOwnerships({
    userId,
    where,
    orderBy: {
      id: "desc",
    },
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

export async function getMyOwnershipsAllforCount(userId) {
  const items = await ownershipRepository.getMyOwnershipsAll(userId);

  const counts = items.reduce(
    (acc, item) => {
      const { grade, genre } = item.photocard;

      acc.grade[grade] = acc.grade[grade] ? acc.grade[grade] + 1 : 1;
      acc.genre[genre] = acc.genre[genre] ? acc.genre[genre] + 1 : 1;

      return acc;
    },
    { grade: {}, genre: {} },
  );
  return {
    total: items.length,
    ...counts,
  };
}

export async function getOwnership(userId, ownershipId) {
  const ownership = await ownershipRepository.findOwnershipById(ownershipId);

  if (!ownership) {
    throw new AppError(
      "보유 카드를 찾을 수 없습니다.",
      404,
      ERROR_CODE.NOT_FOUND,
    );
  }

  if (ownership.userId !== userId) {
    throw new AppError(
      "본인의 보유 카드만 조회할 수 있습니다.",
      403,
      ERROR_CODE.FORBIDDEN,
    );
  }

  if (ownership.quantity <= 0) {
    throw new AppError(
      "보유 수량이 없는 카드입니다.",
      404,
      ERROR_CODE.NOT_FOUND,
    );
  }

  return ownership;
}
