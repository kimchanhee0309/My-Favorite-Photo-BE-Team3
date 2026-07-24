import express from "express";

import * as authController from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";

import { signupSchema } from "./auth.validator.js";

const router = express.Router();

router.post(
  "/signup",
  validate(signupSchema),
  authController.signup
);

export default router;