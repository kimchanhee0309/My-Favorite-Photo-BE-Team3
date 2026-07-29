import { prisma } from "../../lib/prisma.js";

/**
 * 📢 [공통 유틸] 특정 유저에게 알림을 생성합니다.
 * 트랜잭션(Transaction) 내부에서 호출할 경우 두 번째 인자로 tx 객체를 넘겨주세요.
 * * @param {Object} data - 알림 데이터 객체
 * @param {'EXCHANGE_RECEIVED'|'EXCHANGE_ACCEPTED'|'EXCHANGE_REJECTED'|'PURCHASE_COMPLETED'|'CARD_SOLD'|'CARD_SOLD_OUT'} data.type - 알림 타입 (Prisma Enum 참고)
 * @param {string} data.message - 알림창에 표시될 스냅샷 문구
 * @param {string} data.targetId - 알림 클릭 시 이동할 식별자 ID (라우팅용)
 * @param {string} data.userId - 알림을 받을 유저의 UUID
 * @param {Object} [client=prisma] - Prisma 클라이언트 (또는 트랜잭션 tx 객체)
 * @returns {Promise<Object>} 생성된 Notification 레코드
 */
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

export async function findNotifications(
  { userId, page, pageSize, isRead },
  client = prisma,
) {
  const where = { userId };

  if (isRead !== undefined) {
    where.isRead = isRead;
  }

  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const take = Number(pageSize) > 0 ? Number(pageSize) : 20;
  const skip = (currentPage - 1) * take;

  const [notifications, total] = await Promise.all([
    client.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    }),
    client.notification.count({ where }),
  ]);

  return {
    notifications,
    total,
    page: currentPage,
    pageSize: take,
    totalPages: Math.ceil(total / take),
  };
}

export async function findNotificationById(id, client = prisma) {
  return client.notification.findUnique({
    where: { id },
  });
}

export async function markAsRead(id, client = prisma) {
  return client.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId, client = prisma) {
  return client.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
