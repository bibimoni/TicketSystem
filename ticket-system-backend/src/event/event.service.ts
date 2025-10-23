import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { PublicEventResponseDto } from './dto/public-event-response';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) { }

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
        amount: 1
      },
      select: {
        id: true,
        name: true,
        information: true,
        destination: true,
        organizer: true,
        eventTimes: true,
        eventTicketTimes: true,
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
