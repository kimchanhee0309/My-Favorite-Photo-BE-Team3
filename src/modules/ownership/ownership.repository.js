import { prisma } from "../../lib/prisma.js";

const includePhotocard = {
  photocard: {
    include: {
      creator: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  },
};

export async function findMyOwnerships(
  { userId, where, orderBy, take },
  client = prisma,
) {
  return client.ownership.findMany({
    where: {
      userId,
      quantity: {
        gt: 0,
      },
      ...where,
    },
    orderBy,
    take,
    include: includePhotocard,
  });
}

export async function getMyOwnershipsAll(userId) {
  return prisma.ownership.findMany({
    where: {
      userId,
      quantity: {
        gt: 0,
      },
    },
    include: { photocard: true },
  });
}

export async function findOwnershipById(ownershipId, client = prisma) {
  return client.ownership.findUnique({
    where: {
      id: ownershipId,
    },
    include: includePhotocard,
  });
}
