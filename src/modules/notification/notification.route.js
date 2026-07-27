import express from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
  getNotificationSchema,
  readNotificationSchema,
} from "./notification.validator.js";
import * as notificationController from "./notification.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  validate(getNotificationSchema),
  notificationController.getNotifications,
);

router.patch("/read-all", notificationController.readAllNotifications);

router.patch(
  "/:notificationId/read",
  validate(readNotificationSchema),
  notificationController.readNotification,
);

export default router;
