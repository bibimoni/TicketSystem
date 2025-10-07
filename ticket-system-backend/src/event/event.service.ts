import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { info } from 'console';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService, private customerService: CustomerService, private userService: UserService, private adminService: AdminService) { }

  async create(createEventDto: CreateEventDto) {
    const { name, eventTicketTimes, admin_id, customer_id } = createEventDto

    const admin = await this.prisma.admin.findUnique({
      where: { id: admin_id }
    });

    if (!admin) {
      throw new ForbiddenException()
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: customer_id }
    })

    if (!customer) {
      throw new ForbiddenException()
    }

    return await this.prisma.event.create({
      data: {
        name: name,
        admin: {
          connect: { id: admin_id }
        },
        customer: {
          connect: { id: customer_id }
        },
        eventTicketTimes: eventTicketTimes
      }
    })
  }

  // findAll() {
  //   return `This action returns all event`;
  // }

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
