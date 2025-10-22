import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { CreateEventDto } from './dto/create-event.dto';
import { PublicEventResponseDto } from './dto/public-event-response';
import { UpdateEventDto } from './dto/update-event.dto';
import { info } from 'console';
import { CreateEventCustomerDto } from './dto/create-event-customer.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService, private customerService: CustomerService, private userService: UserService, private adminService: AdminService) { }

  async createEventByCustomer(createEventCustomerDto: CreateEventCustomerDto, username: string) {
    const customer_id = await this.customerService.findCustomerId(username);
    if (!customer_id) {
      throw new ForbiddenException("No customer found")
    }
    console.log(customer_id)

    const event = await this.prisma.event.create({
      data: {
        name: createEventCustomerDto.name,
        information: createEventCustomerDto.information,
        eventTicketTimes: createEventCustomerDto.eventTicketTimes,
        destination: createEventCustomerDto.destination,
        organizer: createEventCustomerDto.organizer,
        customer: {
          connect: { id: customer_id }
        },
        eventTimes: createEventCustomerDto.eventTimes,
        count_carry_out: createEventCustomerDto.eventTimes.length,
      },
    })

    if (!event) {
      throw new ForbiddenException()
    }
    return event;
  }

  async create(createEventDto: CreateEventDto)
    : Promise<PublicEventResponseDto> {
    const { name, eventTicketTimes, admin_id, customer_id } = createEventDto

    const admin = await this.prisma.admin.findUnique({
      where: { id: admin_id }
    });

    if (!admin) {
      throw new ForbiddenException()
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: customer_id } // customer is event organizer too
    })

    if (!customer) {
      throw new ForbiddenException()
    }

    const event = await this.prisma.event.create({
      data: {
        name: name,
        admin: {
          connect: { id: admin_id }
        },
        customer: {
          connect: { id: customer_id }
        },
        eventTicketTimes: eventTicketTimes,
        amount: 0,
      },
      select: {
        id: true,
        name: true,
        information: true,
        destination: true,
        organizer: true,
        eventTimes: true,
        eventTicketTimes: true
      }
    })

    if (!event) {
      throw new ForbiddenException()
    }
    return event;
  }

  async findAll() {
    return await this.prisma.event.findMany({
      select: {
        id: true,
        name: true,
        information: true,
        destination: true,
        organizer: true,
        eventTimes: true,
        eventTicketTimes: true,
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} event`;
  // }

  // update(id: number, updateEventDto: UpdateEventDto) {
  //   return `This action updates a #${id} event`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} event`;
  // }
}
