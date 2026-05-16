// The Producer is a wrapper class responsible for pushing jobs onto the respective queues.

import { Queue } from "bullmq";
import { queueConnection, QUEUE_NAMES } from "../config/queue.config";

// queue for tracking order and timeouts
export const orderExpiryQueue = new Queue(QUEUE_NAMES.ORDER_EXPIRY, {
  connection: queueConnection,
});

// queue for offloading email delivery
export const emailQueue = new Queue(QUEUE_NAMES.email, {
  connection: queueConnection,
});

export const queueService = {
  async scheduleOrderExpiry(orderId: string, delayMs: number = 10 * 60 * 1000) {
    await orderExpiryQueue.add(
      `expiry-${orderId}`,
      { orderId },
     { delay: delayMs, removeOnComplete: true } // Delay of 10 mins
    );
  },
  async sendReceiptEmail(email: string, orderId: string) {
    await emailQueue.add(
      `email-${orderId}`,
      { email, orderId },
      { attempts: 3, backoff: { type: 'exponential', delay: 2000 } } // Retry configuration
    );
  }
};

