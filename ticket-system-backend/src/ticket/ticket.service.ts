import { Injectable } from '@nestjs/common';
import { Ticket, TicketPrice } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto, CreateTicketPriceDto } from './dto/ticket-create.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) { }

  async createTicket(createTicketDto: CreateTicketDto, eventId: string, ticketpriceId: string): Promise<Ticket> {
    return await this.prisma.ticket.create({
      data: {
        seat: createTicketDto.seat,
        status: createTicketDto.status,
        event: {
          connect: { id: eventId }
        },
        ticketPrice: {
          connect: { id: ticketpriceId }
        }
      }
    })
  }

  async createTicketPrice(createTicketPriceDto: CreateTicketPriceDto): Promise<TicketPrice> {
    return await this.prisma.ticketPrice.create({
      data: {
        price: createTicketPriceDto.price,
        name: createTicketPriceDto.name,
        benefit_info: createTicketPriceDto.benefit_info
      }
    })
  }
}
