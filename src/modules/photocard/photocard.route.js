import express from "express";

import * as photocardController from "./photocard.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
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
  photocardController.createPhotocard,
);

router.get(
  "/me",
  authMiddleware,
  validate(getMyPhotocardsSchema),
  photocardController.getMyPhotocards,
);

router.get(
  "/me/createCount",
  authMiddleware,
  photocardController.getMyCreateCount,
);

router.get(
  "/:photocardId",
  validate(getPhotocardSchema),
  photocardController.getPhotocard,
);

export default router;
