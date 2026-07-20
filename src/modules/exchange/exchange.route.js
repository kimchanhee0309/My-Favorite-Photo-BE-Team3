import express from "express";

import * as exchangeController from "./exchange.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import {
  validateParams,
  validateQuery,
} from "../../common/middleware/validate.middleware.js";
import {
  exchangeIdParamSchema,
  getExchangesQuerySchema,
} from "./exchange.validator.js";

const router = express.Router();

router.get(
  "/sent",
  authMiddleware,
  validateQuery(getExchangesQuerySchema),
  asyncHandler(exchangeController.getSentExchanges),
);

router.get(
  "/received",
  authMiddleware,
  validateQuery(getExchangesQuerySchema),
  asyncHandler(exchangeController.getReceivedExchanges),
);

router.patch(
  "/:exchangeId/accept",
  authMiddleware,
  validateParams(exchangeIdParamSchema),
  asyncHandler(exchangeController.acceptExchange),
);

router.patch(
  "/:exchangeId/reject",
  authMiddleware,
  validateParams(exchangeIdParamSchema),
  asyncHandler(exchangeController.rejectExchange),
);

router.patch(
  "/:exchangeId/cancel",
  authMiddleware,
  validateParams(exchangeIdParamSchema),
  asyncHandler(exchangeController.cancelExchange),
);

export default router;
