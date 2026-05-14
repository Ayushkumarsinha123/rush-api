import { OrderRepository } from "./order.repository.js";
import { EventRepository } from "../events/event.repository.js";

const orderRepo = new OrderRepository();
const eventRepo = new EventRepository();

export class OrderService {
  async initiateBooking(userId: number, eventId: string) {
    // Get event to find the current price
    const event = await eventRepo.findById(eventId);
    if (!event) throw new Error("EVENT_NOT_FOUND");

    // Call the repository to handle the transaction
    return await orderRepo.createTicketOrder(
      userId, 
      eventId, 
      Number(event.price)
    );
  }
}