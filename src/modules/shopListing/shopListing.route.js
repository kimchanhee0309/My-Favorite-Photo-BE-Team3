import express from "express";

import * as shopListingController from "./shopListing.controller.js";
import * as exchangeController from "../exchange/exchange.controller.js";
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
  shopListingController.getShopListings,
);

router.get("/count", shopListingController.getShopListingsAllforCount);

router.get(
  "/me",
  authMiddleware,
  validate(getShopListingsSchema),
  shopListingController.getMyShopListings,
);

router.get(
  "/me/count",
  authMiddleware,
  shopListingController.getMyShopListingsAllforCount,
);

router.post(
  "/",
  authMiddleware,
  validate(createShopListingSchema),
  shopListingController.createShopListing,
);

router.get(
  "/:shopListingId",
  validate(getShopListingSchema),
  shopListingController.getShopListing,
);

router.patch(
  "/:shopListingId",
  authMiddleware,
  validate(updateShopListingSchema),
  shopListingController.updateShopListing,
);

router.delete(
  "/:shopListingId",
  authMiddleware,
  validate(deleteShopListingSchema),
  shopListingController.deleteShopListing,
);

router.post(
  "/:shopListingId/purchase",
  authMiddleware,
  validate(purchaseShopListingSchema),
  shopListingController.purchaseShopListing,
);

router.post(
  "/:shopListingId/exchanges",
  authMiddleware,
  validate(createExchangeSchema),
  exchangeController.createExchange,
);

router.get(
  "/:shopListingId/exchanges",
  authMiddleware,
  validate(getShopListingExchangesSchema),
  shopListingController.getShopListingExchanges,
);

export default router;
