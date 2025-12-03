import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketTypeDto } from './dto/create-ticket.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { QrPayloadDto } from './dto/qr-payload.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) { }



  async createTicketType(createTicketTypeDto: CreateTicketTypeDto, eventId: string) {
    const { name, amount } = createTicketTypeDto;

    const ticketType = await this.prisma.ticketType.create({
      data: {
        name: name,
        amount: amount ?? 0,
        remaining: amount ?? 0,
        event: { connect: { id: eventId } },
        price: createTicketTypeDto.price,
        benefit_info: createTicketTypeDto.benefit_info
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

  async updateTicketType(id: string, dto: UpdateTicketTypeDto) {
    const dataToUpdate = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined)
    );

    return this.prisma.ticketType.update({
      where: { id },
      data: dataToUpdate,
    });
  }


  async findAll() {
    return this.prisma.ticket.findMany({
      select: {
        id: true,
        code: true,
        created_at: true,
        updated_at: true,
        status: true,
        ticket_type_id: true,
        qr_code_url: true,

        ticket_type: {
          include: {
            event: {
              select: {
                name: true,
                destination: true,
                eventTime: true,
              },
            },
          },
        },

        transactionHasTicket: {
          include: {
            transaction: {
              include: {
                customer: {
                  include: {
                    user: true,
                  },
                },
                vouchers: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        ticket_type: {
          include: {
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
