import express from "express";

import * as shopListingController from "./shopListing.controller.js";
import * as exchangeController from "../exchange/exchange.controller.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";

import {
  getShopListingsSchema,
  createShopListingSchema,
  getShopListingSchema,
  updateShopListingSchema,
  deleteShopListingSchema,
  purchaseShopListingSchema,
  getShopListingExchangesSchema,
} from "./shopListing.validator.js";

import { createExchangeSchema } from "../exchange/exchange.validator.js";

const router = express.Router();

router.get("/", validate(getShopListingsSchema));

router.get("/count");

router.get("/me", authMiddleware, validate(getShopListingsSchema));

router.get("/me/count", authMiddleware);

router.post("/", authMiddleware, validate(createShopListingSchema));

router.get("/:shopListingId", validate(getShopListingSchema));

router.patch(
  "/:shopListingId",
  authMiddleware,
  validate(updateShopListingSchema),
);

router.delete(
  "/:shopListingId",
  authMiddleware,
  validate(deleteShopListingSchema),
);

router.post(
  "/:shopListingId/purchase",
  authMiddleware,
  validate(purchaseShopListingSchema),
);

router.post(
  "/:shopListingId/exchanges",
  authMiddleware,
  validate(createExchangeSchema),
);

router.get(
  "/:shopListingId/exchanges",
  authMiddleware,
  validate(getShopListingExchangesSchema),
);

export default router;
