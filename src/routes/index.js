import photocardRouter from "../modules/photocard/photocard.route.js";
import ownershipRouter from "../modules/ownership/ownership.route.js";

router.use("/photocards", photocardRouter);
router.use("/ownerships", ownershipRouter);
