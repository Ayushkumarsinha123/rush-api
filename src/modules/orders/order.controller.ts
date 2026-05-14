import type { Request, Response } from "express";
import { OrderService } from "./order.service.js";
import { logger } from "../../lib/logger.js";

const orderService = new OrderService();

export class OrderController {
  async create(req: Request, res: Response) {
    try {
     const { eventId } = req.body;
      const userId = req.user?.id;  //comes from auth.middleware
 
      if (!userId || !eventId) {
        return res.status(400).json({ error: "Missing userId or eventId" });
      }

      const order = await orderService.initiateBooking(userId as any, eventId);
      
      res.status(201).json({
        success: true,
        message: "Order initiated successfully. Please complete payment within 10 minutes.",
        data: order
      });
    } catch (error: any) {
      logger.error("Order Creation Failed:", error.message);
      
      // Handle specific business logic errors
      if (error.message === "SOLD_OUT") {
        return res.status(409).json({ error: "Sorry, this event is now sold out." });
      }
      
      if (error.message === "EVENT_NOT_FOUND") {
        return res.status(404).json({ error: "Event not found." });
      }

      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}