import { successResponse } from "../../common/response/successResponse.js";
import * as notificationService from "./notification.service.js";

export async function getNotifications(req, res) {
  const userId = req.user.id;
  const { page, pageSize, isRead } = req.query;

  const notifications = await notificationService.getNotifications(
    userId,
    page,
    pageSize,
    isRead,
  );

  return successResponse(res, notifications, "알림 목록 조회 성공");
}

export async function readNotification(req, res) {
  const userId = req.user.id;
  const notificationId = req.params.id;

  const updatedNotification = await notificationService.readNotification(
    userId,
    notificationId,
  );

  return successResponse(res, updatedNotification, "알림 읽음 처리 성공");
}

export async function readAllNotifications(req, res) {
  const userId = req.user.id;

  const result = await notificationService.readAllNotifications(userId);

  return successResponse(res, result, "모든 알림 읽음 처리 성공");
}
