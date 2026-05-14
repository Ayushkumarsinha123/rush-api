import { Router } from "express";
import { OrderController } from "./order.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = Router();
const controller = new OrderController();

// Only logged-in users can hit this endpoint
router.post("/", protect, controller.create);

export default router;