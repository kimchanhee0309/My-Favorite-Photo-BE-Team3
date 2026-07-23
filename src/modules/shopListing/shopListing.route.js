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

router.get(
  "/",
  validate(getShopListingsSchema),
  asyncHandler(shopListingController.getShopListings),
);

router.get(
  "/me",
  authMiddleware,
  validate(getShopListingsSchema),
  asyncHandler(shopListingController.getMyShopListings),
);

router.post(
  "/",
  authMiddleware,
  validate(createShopListingSchema),
  asyncHandler(shopListingController.createShopListing),
);

router.get(
  "/:shopListingId",
  validate(getShopListingSchema),
  asyncHandler(shopListingController.getShopListing),
);

router.patch(
  "/:shopListingId",
  authMiddleware,
  validate(updateShopListingSchema),
  asyncHandler(shopListingController.updateShopListing),
);

router.delete(
  "/:shopListingId",
  authMiddleware,
  validate(deleteShopListingSchema),
  asyncHandler(shopListingController.deleteShopListing),
);

router.post(
  "/:shopListingId/purchase",
  authMiddleware,
  validate(purchaseShopListingSchema),
  asyncHandler(shopListingController.purchaseShopListing),
);

router.post(
  "/:shopListingId/exchanges",
  authMiddleware,
  validate(createExchangeSchema),
  asyncHandler(exchangeController.createExchange),
);

router.get(
  "/:shopListingId/exchanges",
  authMiddleware,
  validate(getShopListingExchangesSchema),
  asyncHandler(shopListingController.getShopListingExchanges),
);

export default router;
