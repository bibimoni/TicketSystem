import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { CreateEventCustomerDto } from './dto/create-event-customer.dto';
import { VoucherService } from 'src/voucher/voucher.service';
import { event_status } from 'generated/prisma';
import { UpdateEventDto } from './dto/update-event-info.dto';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService, private customerService: CustomerService, private voucherService: VoucherService, private readonly ticketService: TicketService) { }

  async findAllEvents(username: string | null = null) {
    let customer_id: string | null = null;
    if (username !== null) {
      customer_id = await this.customerService.findCustomerId(username);
      if (!customer_id) {
        throw new ForbiddenException("No customer found")
      }
    }

    const events = await this.prisma.event.findMany({
      where: {
        customer_id: customer_id === null ? undefined : customer_id
      },
      select: {
        id: true,
        name: true,
        information: true,
        destination: true,
        organizer: true,
        eventTime: true,
        eventTicketStart: true,
        eventTicketEnd: true,
        ticketTypes: true,
        vouchers: true
      }
    })

    return events;
  }

  async createEventByCustomer(createEventCustomerDto: CreateEventCustomerDto, username: string) {
    const customer_id = await this.customerService.findCustomerId(username);
    if (!customer_id) {
      throw new ForbiddenException("No customer found")
    }

    const event = await this.prisma.event.create({
      data: {
        name: createEventCustomerDto.name,
        information: createEventCustomerDto.information,
        eventTicketStart: createEventCustomerDto.eventTicketStart,
        eventTicketEnd: createEventCustomerDto.eventTicketEnd,
        destination: createEventCustomerDto.destination,
        organizer: createEventCustomerDto.organizer,
        customer: {
          connect: { id: customer_id }
        },
        eventTime: createEventCustomerDto.eventTime,
        format: createEventCustomerDto.format,
        event_custom_slug: createEventCustomerDto.event_custom_slug ?? '',
        event_picture_url: createEventCustomerDto.event_picture_url ?? '',
        organizer_logo: createEventCustomerDto.organizer_logo ?? '',
        organizer_information: createEventCustomerDto.organizer_information ?? '',
        messages: createEventCustomerDto.messages
      },
    })

    let createdVouchers: any[] = [];
    if (Array.isArray(createEventCustomerDto.vouchers) && createEventCustomerDto.vouchers.length > 0) {
      createdVouchers = await Promise.all(
        createEventCustomerDto.vouchers.map(v =>
          this.voucherService.create(
            {
              code: v.code,
              reduce_type: v.reduce_type,
              reduce_price: v.reduce_price,
              price: v.price,
              start_date: new Date(v.start_date),
              end_date: new Date(v.end_date),
            } as any,
            event.id
          )
        )
      );
    }

    if (!event) {
      throw new ForbiddenException()
    }

    return {
      id: event.id,
      name: event.name,
      information: event.information ?? null,
      destination: event.destination ?? null,
      organizer: event.organizer ?? null,
      vouchers: createdVouchers.map(v => ({
        id: v.id,
        code: v.code,
        reduce_type: v.reduce_type,
        reduce_price: v.reduce_price,
        price: v.price,
        start_date: v.start_date,
        end_date: v.end_date
      }))
    };
  }

  async findAllByStatus(status: event_status) {
    return await this.prisma.event.findMany({
      where: { status },
      select: {
        id: true,
        name: true,
        information: true,
        destination: true,
        organizer: true,
        eventTime: true,
        eventTicketStart: true,
        eventTicketEnd: true
      },
    });
  }


  async findAll() {
    return await this.prisma.event.findMany({
      select: {
        id: true,
        name: true,
        information: true,
        destination: true,
        organizer: true,
        eventTime: true,
        eventTicketStart: true,
        eventTicketEnd: true,
        ticketTypes: true
      },
    });
  }

  async getEventsCount(status: event_status): Promise<number> {
    return await this.prisma.event.count({
      where: { status }
    });
  }

  async updateEventStatus(eventId: string, adminId: string): Promise<Boolean> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { status: true }
    });

    if (!event) {
      throw new NotFoundException('Cannot find any event with the ID!');
    }

    if (event.status !== event_status.DRAFT) {
      throw new BadRequestException('Event is not in DRAFT state');
    }

    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        status: event_status.PUBLISHED,
        admin_id: adminId,
        updated_at: new Date()
      }
    });

    return true
  }

  async updateEventInfo(eventId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');

    const { ticketTypes, id, ...rest } = dto;

    const dataToUpdate = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== undefined)
    );

    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data: dataToUpdate
    });

    if (ticketTypes && ticketTypes.length > 0) {
      for (const t of ticketTypes) {
        await this.ticketService.updateTicketType(t.id, {
          name: t.name,
          amount: t.amount,
        })
        return updatedEvent;
      }
    }
  }

  async findEventById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { customer_id: true }
    })

    if (!event) {
      throw new NotFoundException();
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: event.customer_id }
    });

    if (!customer) {
      throw new NotFoundException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: customer.user_id }
    })

    if (!user) {
      throw new NotFoundException();
    }

    return user.id
  }

}
