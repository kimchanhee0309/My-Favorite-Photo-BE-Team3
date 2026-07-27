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

router.post("/", authMiddleware, validate(createPhotocardSchema));

router.get("/me", authMiddleware, validate(getMyPhotocardsSchema));

router.get("/:photocardId", validate(getPhotocardSchema));

export default router;
