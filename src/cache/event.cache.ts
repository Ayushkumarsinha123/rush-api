import { redis } from "../lib/redis.js";
import { logger } from "../lib/logger.js";

const EVENT_CACHE_KEY = "events:all";
const CACHE_TTL = 300; // 5 minutes in seconds

export class EventCache {
  static getEvents() {
    throw new Error("Method not implemented.");
  }
  async getEvents() {
    try {
      const cachedData = await redis.get(EVENT_CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (err) {
      logger.error("Redis Get Error", err);
      return null;
    }
  }

  async setEvents(data: any) {
    try {
      await redis.setEx(EVENT_CACHE_KEY, CACHE_TTL, JSON.stringify(data));
    } catch (err) {
      logger.error("Redis Set Error", err);
    }
  }

  async invalidate() {
    await redis.del(EVENT_CACHE_KEY);
  }
}