import { prisma } from "../../lib/prisma.js";

export async function createNotification(data, client = prisma) {
  return client.notification.create({
    data: {
      type: data.type,
      message: data.message,
      targetId: data.targetId,
      userId: data.userId,
    },
  });
}
