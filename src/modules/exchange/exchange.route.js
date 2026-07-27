import express from "express";

import * as exchangeController from "./exchange.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
  getExchangesSchema,
  updateExchangeStatusSchema,
} from "./exchange.validator.js";

const router = express.Router();

router.get("/sent", authMiddleware, validate(getExchangesSchema));

router.get("/received", authMiddleware, validate(getExchangesSchema));

router.patch(
  "/:exchangeId/accept",
  authMiddleware,
  validate(updateExchangeStatusSchema),
);

router.patch(
  "/:exchangeId/reject",
  authMiddleware,
  validate(updateExchangeStatusSchema),
);

router.patch(
  "/:exchangeId/cancel",
  authMiddleware,
  validate(updateExchangeStatusSchema),
);

export default router;
