import express from "express";

import * as ownershipController from "./ownership.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
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
  ownershipController.getMyOwnerships,
);

router.get(
  "/me/count",
  authMiddleware,
  ownershipController.getMyOwnershipsAllforCount,
);

router.get(
  "/:ownershipId",
  authMiddleware,
  validate(getOwnershipSchema),
  ownershipController.getOwnership,
);

export default router;
