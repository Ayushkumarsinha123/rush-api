import type { ConnectionOptions } from "bullmq";
import { env } from "./env.js";

export const queueConnection : ConnectionOptions = {
  url : env.REDIS_URL
};

export const QUEUE_NAMES = {
  ORDER_EXPIRY : 'order-expiry-queue',
  email : "email-queue"
} as const;
