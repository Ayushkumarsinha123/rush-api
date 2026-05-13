import { EventRepository } from "./event.repository.js";

const eventRepo = new EventRepository();

export class EventService {

  async getAllActiveEvents() {

    const events = await eventRepo.findAll();

    return events.filter( // only show future logic
      (event : any ) =>
        new Date(event.eventDate) > new Date()
    );
  }


  async getEventDetails(id: string) {

    const event = await eventRepo.findById(id);

    if (!event) {
      throw new Error("EVENT_NOT_FOUND");
    }

    return event;
  }
}