import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async getSoldTickets() {
    return await this.prisma.ticket.count({
      where: { status: 'SOLD' }
    })
  }

  async scanTicket(qrData: string): Promise<{ message: string }> {
    let payload: any;

    try {
      payload = JSON.parse(qrData);
    } catch (error) {
      throw new BadRequestException('Invalid QR format');
    }

    const { code, user_id, order_id } = payload;

    if (!code || !user_id || !order_id) {
      throw new BadRequestException('QR data missing fields');
    }

    const ticket = await this.prisma.ticket.findUnique({
      where: { code },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.status === 'AVAILABLE') {
      throw new BadRequestException('This ticket has not been sold');
    }

    if (ticket.status === 'USED') {
      throw new BadRequestException('This ticket has already been used');
    }

    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'USED' },
    });

    return { message: `Ticket ${code} marked as USED successfully.` };
  }
}