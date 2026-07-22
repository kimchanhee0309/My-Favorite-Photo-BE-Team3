import express from "express";

import * as photocardController from "./photocard.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
  createPhotocardSchema,
  getMyPhotocardsSchema,
  getPhotocardSchema,
} from "./photocard.validator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate(createPhotocardSchema),
  asyncHandler(photocardController.createPhotocard),
);

router.get(
  "/me",
  authMiddleware,
  validate(getMyPhotocardsSchema),
  asyncHandler(photocardController.getMyPhotocards),
);

router.get(
  "/:photocardId",
  validate(getPhotocardSchema),
  asyncHandler(photocardController.getPhotocard),
);

export default router;
