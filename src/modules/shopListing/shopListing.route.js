import express from "express";

import * as shopListingController from "./shopListing.controller.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../common/middleware/validate.middleware.js";

import {
  createShopListingBodySchema,
  getShopListingQuerySchema,
  purchaseShopListingBodySchema,
  shopListingIdParamSchema,
  updateShopListingBodySchema,
} from "./shopListing.validator";

const router = express.Router();

router.get(
  "/",
  validateQuery(getShopListingQuerySchema),
  asyncHandler(shopListingController.getShopListings),
);

router.get(
  "/me",
  authMiddleware,
  validateQuery(getShopListingQuerySchema),
  asyncHandler(shopListingController.getMyShopListings),
);

router.post(
  "/",
  authMiddleware,
  validateBody(createShopListingBodySchema),
  asyncHandler(shopListingController.createShopListing),
);

router.get(
  "/:shopListingId",
  validateParams(shopListingIdParamSchema),
  asyncHandler(shopListingController.getshopListing),
);

router.patch(
  "/:shopListingId",
  authMiddleware,
  validateParams(shopListingIdParamSchema),
  validateBody(updateShopListingBodySchema),
  asyncHandler(shopListingController.updateShopListing),
);

router.delete(
  "/:shopListingId",
  authMiddleware,
  validateParams(shopListingIdParamSchema),
  asyncHandler(shopListingController.deleteShopListing),
);

router.post(
  "/:shopListingId/purchase",
  authMiddleware,
  validateParams(shopListingIdParamSchema),
  validateBody(purchaseShopListingBodySchema),
  asyncHandler(shopListingController.purchaseShopListing),
);

router.get(
  "/:shopListingId/exchanges",
  authMiddleware,
  validateParams(shopListingIdParamSchema),
  asyncHandler(shopListingController.getShopListingExchanges),
);

export default router;
