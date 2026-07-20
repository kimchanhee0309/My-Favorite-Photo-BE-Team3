import express from "express";

import * as ownershipController from "./ownership.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import {
  validateParams,
  validateQuery,
} from "../../common/middleware/validate.middleware.js";
import {
  getMyOwnershipsQuerySchema,
  ownershipIdParamSchema,
} from "./ownership.validator.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  validateQuery(getMyOwnershipsQuerySchema),
  asyncHandler(ownershipController.getMyOwnerships),
);

router.get(
  "/:ownershipId",
  authMiddleware,
  validateParams(ownershipIdParamSchema),
  asyncHandler(ownershipController.getOwnership),
);

export default router;
