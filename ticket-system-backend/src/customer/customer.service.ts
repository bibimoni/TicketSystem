import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Customer, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { genSalt, hash } from 'bcrypt-ts';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService, private userService: UserService) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<User> {
    const { username, password, email } = createCustomerDto
    const salt = await genSalt(10)
    const hashed_password = await hash(password, salt)
    const user = await this.userService.create({
      hashed_password,
      username,
      email
    })

    if (!user) {
      throw new ForbiddenException()
    }
    const customer = await this.prisma.customer.create({
      data: {
        user_id: user.id,
      }
    })

    if (!customer) {
      throw new ForbiddenException()
    }

    return user;
  }

  async findOne(username: string): Promise<User | null> {
    const user = await this.userService.findOne(username)
    if (!user) {
      throw new ForbiddenException()
    }
    const customer = await this.prisma.customer.findUnique({
      where: { user_id: user.id }
    })
    if (!customer) {
      throw new ForbiddenException()
    }
    return user
  }
}
