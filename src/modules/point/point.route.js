import express from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import * as pointController from "./point.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", pointController.getPointsMe);

router.post("/random-box", pointController.claimRandomBox);

export default router;
