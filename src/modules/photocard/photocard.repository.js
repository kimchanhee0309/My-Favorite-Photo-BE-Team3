import { prisma } from "../../lib/prisma.js";

const includeCreator = {
  creator: {
    select: {
      id: true,
      nickname: true,
    },
  },
};

export async function countCreatedThisMonth(
  userId,
  startOfMonth,
  client = prisma,
) {
  return client.photocard.count({
    where: {
      creatorId: userId,
      createdAt: {
        gte: startOfMonth,
      },
    },
  });
}

export async function createPhotocard(data, client = prisma) {
  return client.photocard.create({
    data,
    include: includeCreator,
  });
}

export async function createOwnership(data, client = prisma) {
  return client.ownership.create({
    data,
    include: {
      photocard: true,
    },
  });
}

export async function findPhotocardById(photocardId, client = prisma) {
  return client.photocard.findUnique({
    where: {
      id: photocardId,
    },
    include: includeCreator,
  });
}

export async function findMyPhotocards(
  { userId, where, orderBy, take },
  client = prisma,
) {
  return client.photocard.findMany({
    where: {
      creatorId: userId,
      ...where,
    },
    orderBy,
    take,
    include: includeCreator,
  });
}
