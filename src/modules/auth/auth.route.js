import express from "express";

import * as authController from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { signupSchema, loginSchema } from "./auth.validator.js";

const router = express.Router();

router.post(
  "/signup",
  validate(signupSchema),
  authController.signup
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

router.get(
  "/me",
  authMiddleware,
  authController.getMe
);

router.post(
  "/logout",
  authMiddleware,
  authController.logout
);

export default router;