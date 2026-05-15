import cron from 'node-cron';
import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';

export const initOrderCleanupTask = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    logger.info('Running cleanup task for expired orders...');

    try {
      await prisma.$transaction(async (tx) => {
        // 1. Find all pending orders that have passed their expiresAt time
        const expiredOrders = await tx.order.findMany({
          where: {
            status: 'PENDING',
            expiresAt: { lt: new Date() }
          },
          include: {
             // We need to know which event to update
             // This assumes your Order model has an eventId or ticket relation
             ticket: true 
          }
        });

        if (expiredOrders.length === 0) return;

        for (const order of expiredOrders) {
          // 2. Mark order as EXPIRED
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'EXPIRED' }
          });

          // 3. Decrement the ticketsSold in the Event table
          // Use the related ticket's eventId since Order does not expose it directly
          if (order.ticket?.eventId) {
            await tx.event.update({
              where: { id: order.ticket.eventId },
              data: { ticketsSold: { decrement: 1 } }
            });
          }
        }

        logger.info(`Cleaned up ${expiredOrders.length} expired orders.`);
      });
    } catch (error) {
      logger.error('Order cleanup task failed:', error);
    }
  });
};