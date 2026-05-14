import { prisma } from "../../lib/prisma.js";

export class OrderRepository {
  async createTicketOrder(userId: number, eventId: string, amount: number) {
    // We use a transaction to ensure data integrity
    return await prisma.$transaction(async (tx) => {
      // 1. LOCK the event row for update (Pessimistic Locking)
      // This prevents race conditions at the DB level
      const event: any[] = await tx.$queryRaw`
        SELECT * FROM "Event" WHERE id = ${eventId} FOR UPDATE
      `;

      if (!event[0]) throw new Error("EVENT_NOT_FOUND");

      // 2. Check if tickets are still available
      if (event[0].ticketsSold >= event[0].totalCapacity) {
        throw new Error("SOLD_OUT");
      }

      // 3. Create the Order
      const order = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          totalAmount: amount,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins from now
        },
      });

      // 4. Update the Event count
      await tx.event.update({
        where: { id: eventId },
        data: { ticketsSold: { increment: 1 } },
      });

      return order;
    });
  }
}
