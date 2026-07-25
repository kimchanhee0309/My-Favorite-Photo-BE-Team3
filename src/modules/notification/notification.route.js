import express from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
  getNotificationSchema,
  readNotificationSchema,
} from "./notification.validator.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import * as notificationController from "./notification.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  validate(getNotificationSchema),
  asyncHandler(notificationController.getNotifications),
);

router.patch(
  "/read-all",
  asyncHandler(notificationController.readAllNotifications),
);

router.patch(
  "/:notificationId/read",
  validate(readNotificationSchema),
  asyncHandler(notificationController.readNotification),
);

export default router;
