import express from "express";
import * as userController from "./user.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { updateUserSchema } from "./user.validator.js";

const router = express.Router();

router.patch(
  "/me",
  authMiddleware,
  validate(updateUserSchema),
  userController.updateMe
);

export default router;