import * as notificationRepository from "./notification.repository.js";
import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";

export async function getNotifications(userId, page, pageSize, isRead) {
  const notifications = await notificationRepository.findNotifications({
    userId,
    page,
    pageSize,
    isRead,
  });

  return notifications;
}

export async function readNotification(userId, notificationId) {
  const notification =
    await notificationRepository.findNotificationById(notificationId);

  if (!notification) {
    throw new AppError(
      "해당 알림을 찾을 수 없습니다.",
      404,
      ERROR_CODE.NOT_FOUND,
    );
  }

  if (notification.userId !== userId) {
    throw new AppError(
      "본인의 알림만 읽음 처리할 수 있습니다.",
      403,
      ERROR_CODE.FORBIDDEN,
    );
  }

  if (notification.isRead) {
    return notification;
  }

  return await notificationRepository.markAsRead(notificationId);
}

export async function readAllNotifications(userId) {
  return await notificationRepository.markAllAsRead(userId);
}
