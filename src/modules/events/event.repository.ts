import { prisma } from "../../lib/prisma.js";

export class EventRepository {
  async findAll() {
    return prisma.event.findMany({
      orderBy: { eventDate: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tickets: { where: { status: 'AVAILABLE' } } }
        }
      }
    });
  }
}