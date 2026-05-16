import { Worker, Job } from "bullmq";
import { queueConnection, QUEUE_NAMES } from "../config/queue.config.js";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";

export const initOrderWorker = () => {
  const worker = new Worker(
    QUEUE_NAMES.ORDER_EXPIRY,
    async (job: Job<{ orderId: string }>) => {
      const { orderId } = job.data;
      logger.info(`⚙️ Processing expiry verification for Order: ${orderId}`);

      // Run atomic database validation/update
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          select: {
            id: true,
            status: true,
            eventId: true,
          },
        });

        // If the user already paid, or it's canceled, do nothing
        if (!order || order.status !== "PENDING") {
          logger.info(
            `ℹ️ Order ${orderId} is state "${order?.status || "NOT_FOUND"}". No action needed.`,
          );
          return;
        }

        // 1. Mark order as EXPIRED
        await tx.order.update({
          where: { id: orderId },
          data: { status: "EXPIRED" },
        });

        // 2. Decrement ticketsSold on the associated Event
        await tx.event.update({
          where: { id: order.eventId },
          data: { ticketsSold: { decrement: 1 } },
        });

        logger.warn(`Order ${orderId} has expired. Ticket inventory returned.`);
      });
    },
    { connection: queueConnection },
  );

  worker.on("failed", (job, err) => {
    logger.error(`❌ Job failed ${job?.id}: ${err.message}`);
  });
};
