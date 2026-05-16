import { OrderRepository } from "./order.repository.js";
import { EventRepository } from "../events/event.repository.js";
import {EventCache} from "../../cache/event.cache.js";
import { queueService } from "../../queues/order.queue.js";

const orderRepo = new OrderRepository();
const eventRepo = new EventRepository();
const eventCache = new EventCache();

export class OrderService {
  async initiateBooking(userId: number, eventId: string) {
    // Get event to find the current price
    const event = await eventRepo.findById(eventId);
    if (!event) throw new Error("EVENT_NOT_FOUND");

    // Call the repository to handle the transaction
    const order = await orderRepo.createTicketOrder(
      userId, 
      eventId, 
      Number(event.price)
    );
    // note : clear the events cache so the next "GET/events"
    // fetches the new 'ticketsSold' count from DB
    await eventCache.invalidate();

    //  Schedule the BullMQ worker to check this order in 10 minutes
    // If the user doesn't pay by then, the worker will automatically release the ticket.
    await queueService.scheduleOrderExpiry(order.id);

    return order;
  }
}