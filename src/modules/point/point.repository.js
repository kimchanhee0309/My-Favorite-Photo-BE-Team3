import { prisma } from "../../lib/prisma.js";

export async function findPointById(userId, client = prisma) {
  return client.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      points: true,
      lastBoxClaimedAt: true,
    },
  });
}

export async function updateUserPointsAndBoxTime(
  userId,
  acquiredPoint,
  client = prisma,
) {
  return client.user.update({
    where: { id: userId },
    data: {
      points: { increment: acquiredPoint },
      lastBoxClaimedAt: new Date(),
    },
    select: {
      id: true,
      points: true,
      lastBoxClaimedAt: true,
    },
  });
}
