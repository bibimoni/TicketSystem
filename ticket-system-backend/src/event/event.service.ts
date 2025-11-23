import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { CreateEventCustomerDto } from './dto/create-event-customer.dto';
import { VoucherService } from 'src/voucher/voucher.service';
import { event_status } from 'generated/prisma';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService, private customerService: CustomerService, private voucherService: VoucherService) { }

  async findAllEvents(username: string | null = null) {
    let customer_id: string | null = null;
    if (username !== null) {
      customer_id = await this.customerService.findCustomerId(username);
      if (!customer_id) {
        throw new ForbiddenException("No customer found")
      }
    }
    console.log(customer_id)

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
        ticketTypes: {
          include: {
            ticketPrice: true,
            amount: true,
            remaining: true
          } as any
        }
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
        messages: createEventCustomerDto.messages
      },
    })

    let createdVouchers: any[] = [];
    if (Array.isArray(createEventCustomerDto.vouchers) && createEventCustomerDto.vouchers.length > 0) {
      createdVouchers = await Promise.all(
        createEventCustomerDto.vouchers.map(v =>
          this.voucherService.create(
            {
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
        eventTicketEnd: true
      },
    });
  }

  async getEventsCount(status: event_status): Promise<number> {
    return await this.prisma.event.count({
      where: { status }
    });
  }

}
