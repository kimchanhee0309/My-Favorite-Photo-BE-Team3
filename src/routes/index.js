import express from "express";

import authRouter from "../modules/auth/auth.route.js";
import photocardRouter from "../modules/photocard/photocard.route.js";
import ownershipRouter from "../modules/ownership/ownership.route.js";
import shopListingRouter from "../modules/shopListing/shopListing.route.js";
import exchangeRouter from "../modules/exchange/exchange.route.js";
import notificationRouter from "../modules/notification/notification.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/photocards", photocardRouter);
router.use("/ownerships", ownershipRouter);
router.use("/shop-listings", shopListingRouter);
router.use("/exchanges", exchangeRouter);
router.use("/notifications", notificationRouter);

export default router;
