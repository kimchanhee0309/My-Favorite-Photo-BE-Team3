import express from "express";

import * as ownershipController from "./ownership.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
  getMyOwnershipsSchema,
  getOwnershipSchema,
} from "./ownership.validator.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  validate(getMyOwnershipsSchema),
  asyncHandler(ownershipController.getMyOwnerships),
);

router.get(
  "/:ownershipId",
  authMiddleware,
  validate(getOwnershipSchema),
  asyncHandler(ownershipController.getOwnership),
);

export default router;
