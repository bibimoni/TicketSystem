import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketTypeDto, CreateTicketPriceDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) { }

  async createTicketPrice(createTicketPriceDto: CreateTicketPriceDto) {
    const { price, benefit_info } = createTicketPriceDto;

    const ticketPrice = await this.prisma.ticketPrice.create({
      data: {
        price,
        benefit_info: benefit_info || null
      }
    });

    return ticketPrice;
  }

  async createTicketType(createTicketTypeDto: CreateTicketTypeDto, eventId: string, ticketPriceId: string) {
    const { name, amount } = createTicketTypeDto;

    const ticketType = await this.prisma.ticketType.create({
      data: {
        name: name ?? null,
        amount: amount ?? 0,
        remaining: amount ?? 0,
        event: { connect: { id: eventId } },
        ticketPrice: { connect: { id: ticketPriceId } }
      }
    });

    return ticketType;
  }

  async createTicket(ticketTypeId: string) {
    const ticket = await this.prisma.ticket.create({
      data: {
        code: `TKZ-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        status: 'AVAILABLE',
        ticket_type: {
          connect: { id: ticketTypeId },
        }
      },
      include: {
        ticket_type: {
          include: {
            ticketPrice: true,
            event: {
              select: {
                name: true,
                destination: true,
                eventTime: true
              }
            }
          }
        }
      }
    });

    if (!ticket) {
      throw new ForbiddenException('Failed to create ticket');
    }

    return ticket;
  }

  async findAll() {
    return await this.prisma.ticket.findMany({
      include: {
        ticket_type: {
          include: {
            ticketPrice: true,
            event: {
              select: {
                name: true,
                destination: true,
                eventTime: true
              }
            }
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        ticket_type: {
          include: {
            ticketPrice: true,
            event: {
              select: {
                name: true,
                destination: true,
                eventTime: true
              }
            }
          }
        }
      }
    });

    if (!ticket) {
      throw new ForbiddenException('Ticket not found');
    }

    return ticket;
  }
}