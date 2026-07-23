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

router.get(
  "/sent",
  authMiddleware,
  validate(getExchangesSchema),
  asyncHandler(exchangeController.getSentExchanges),
);

router.get(
  "/received",
  authMiddleware,
  validate(getExchangesSchema),
  asyncHandler(exchangeController.getReceivedExchanges),
);

router.patch(
  "/:exchangeId/accept",
  authMiddleware,
  validate(updateExchangeStatusSchema),
  asyncHandler(exchangeController.acceptExchange),
);

router.patch(
  "/:exchangeId/reject",
  authMiddleware,
  validate(updateExchangeStatusSchema),
  asyncHandler(exchangeController.rejectExchange),
);

router.patch(
  "/:exchangeId/cancel",
  authMiddleware,
  validate(updateExchangeStatusSchema),
  asyncHandler(exchangeController.cancelExchange),
);

export default router;
