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
  cooldownThreshold,
  now,
  client = prisma,
) {
  return client.user.updateMany({
    where: {
      id: userId,
      OR: [
        { lastBoxClaimedAt: null },
        { lastBoxClaimedAt: { lte: cooldownThreshold } },
      ],
    },

    data: {
      points: { increment: acquiredPoint },
      lastBoxClaimedAt: now,
    },
  });
}
