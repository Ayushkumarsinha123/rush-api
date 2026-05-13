import type { Request, Response } from "express";

import { EventService } from "./event.service.js";

import { logger } from "../../lib/logger.js";

const eventService = new EventService();

export class EventController {

  async getEvents(
    req: Request,
    res: Response
  ) {

    try {

      const events =
        await eventService.getAllActiveEvents();

      return res.status(200).json({
        success: true,
        data: events,
      });

    } catch (error) {

      logger.error(
        "Error fetching events",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }


  async getEventById(
    req: Request,
    res: Response
  ) {

    try {

      const event =
        await eventService.getEventDetails(
          req.params.id as string
        );

      return res.status(200).json({
        success: true,
        data: event,
      });

    } catch (error: any) {

      const status =
        error.message === "EVENT_NOT_FOUND"
          ? 404
          : 500;

      return res.status(status).json({
        success: false,
        error: error.message,
      });
    }
  }
}