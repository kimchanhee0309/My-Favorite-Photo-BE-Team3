import express from "express";

import * as exchangeController from "./exchange.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
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
  exchangeController.getSentExchanges,
);

router.get(
  "/received",
  authMiddleware,
  validate(getExchangesSchema),
  exchangeController.getReceivedExchanges,
);

router.patch(
  "/:exchangeId/accept",
  authMiddleware,
  validate(updateExchangeStatusSchema),
  exchangeController.acceptExchange,
);

router.patch(
  "/:exchangeId/reject",
  authMiddleware,
  validate(updateExchangeStatusSchema),
  exchangeController.rejectExchange,
);

router.patch(
  "/:exchangeId/cancel",
  authMiddleware,
  validate(updateExchangeStatusSchema),
  exchangeController.cancelExchange,
);

export default router;
