import express from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import * as pointController from "./point.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", asyncHandler(pointController.getPointsMe));

router.post("/random-box", asyncHandler(pointController.claimRandomBox));

export default router;
