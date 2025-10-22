import { Injectable } from '@nestjs/common';
import { Ticket, TicketPrice } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto, CreateTicketPriceDto } from './dto/ticket-create.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) { }

  async createTicket(createEventDto: CreateTicketDto): Promise<Ticket> {

  }

  async createTicketPrice(createTicketPriceDto: CreateTicketPriceDto): Promise<TicketPrice> {
    return this.prisma.ticketPrice.create({
      data: {
        price: createTicketPriceDto.price,
        name: createTicketPriceDto.name,
        benefit_info: createTicketPriceDto.benefit_info
      }
    })
  }
}
