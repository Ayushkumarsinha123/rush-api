import { Router } from "express";
import { OrderController } from "./order.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { bookingLimiter } from "../../middleware/rate-limit.middleware.js";

const router = Router();
const controller = new OrderController();

// Only logged-in users can hit this endpoint
router.post("/", bookingLimiter, protect, controller.create)

export default router;