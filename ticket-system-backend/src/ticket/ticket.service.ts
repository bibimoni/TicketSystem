import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketPriceDto } from './dto/create-ticket-price.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) { }

  async createTicketPrice(createTicketPriceDto: CreateTicketPriceDto) {
    const { name, price, benefit_info } = createTicketPriceDto;

    const ticketPrice = await this.prisma.ticketPrice.create({
      data: {
        name,
        price,
        benefit_info: benefit_info || null
      }
    });

    if (!ticketPrice) {
      throw new ForbiddenException('Failed to create ticket price');
    }

    return ticketPrice;
  }

  async create(createTicketDto: CreateTicketDto) {
    const { event_id, ticket_price_id, seat } = createTicketDto;

    const ticket = await this.prisma.ticket.create({
      data: {
        event_id,
        ticket_price_id,
        seat: seat || null,
        status: 'AVAILABLE'
      },
      include: {
        event: {
          select: {
            name: true,
            destination: true
          }
        },
        ticketPrice: true
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
        event: {
          select: {
            name: true,
            destination: true,
            eventTimes: true
          }
        },
        ticketPrice: true
      }
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
        ticketPrice: true
      }
    });

    if (!ticket) {
      throw new ForbiddenException('Ticket not found');
    }

    return ticket;
  }
}