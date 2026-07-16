import express from "express";

import * as photocardController from "./photocard.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../common/middleware/validate.middleware.js";
import {
  createPhotocardBodySchema,
  getMyPhotocardsQuerySchema,
  photocardIdParamSchema,
} from "./photocard.validator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateBody(createPhotocardBodySchema),
  asyncHandler(photocardController.createPhotocard),
);

router.get(
  "/me",
  authMiddleware,
  validateQuery(getMyPhotocardsQuerySchema),
  asyncHandler(photocardController.getMyPhotocards),
);

router.get(
  "/:photocardId",
  validateParams(photocardIdParamSchema),
  asyncHandler(photocardController.getPhotocard),
);

export default router;
