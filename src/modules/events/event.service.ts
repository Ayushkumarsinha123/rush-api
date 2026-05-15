import { EventCache } from "../../cache/event.cache.js";
import { EventRepository } from "./event.repository.js";

const eventRepo = new EventRepository();
const eventCache = new EventCache();

export class EventService {
  async getAllActiveEvents() {
    //trying to get from cache
    const cachedEvents = await eventCache.getEvents();
    if (cachedEvents) return cachedEvents;


    // if cached is not present then hit db
    const events = await eventRepo.findAll();

   const activeEvents = events.filter(
      // only show future logic
      (event: any) => new Date(event.eventDate) > new Date(),
    );

    // save to cache for next time
    if (activeEvents.length > 0) {
      await eventCache.setEvents(activeEvents); // Monitor should show "SETEX" here
    }

    return activeEvents;
  }

  async getEventDetails(id: string) {
    const event = await eventRepo.findById(id);

    if (!event) {
      throw new Error("EVENT_NOT_FOUND");
    }

    return event;
  }
}
