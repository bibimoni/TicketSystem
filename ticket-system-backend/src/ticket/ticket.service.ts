import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto, CreateTicketPriceDto } from './dto/create-ticket.dto';

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

    return ticketPrice;
  }

  async createTicket(createTicketDto: CreateTicketDto, eventId: string, ticketPriceId: string) {
    const { seat } = createTicketDto;

    const ticket = await this.prisma.ticket.create({
      data: {
        seat: seat || null,
        status: 'AVAILABLE',
        event: {
          connect: { id: eventId }
        },
        ticketPrice: {
          connect: { id: ticketPriceId }
        }
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