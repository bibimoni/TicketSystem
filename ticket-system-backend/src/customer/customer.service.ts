import { Injectable } from '@nestjs/common';
import { Customer } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { genSalt, hash } from 'bcrypt-ts';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { username, password, email } = createCustomerDto
    const salt = await genSalt(10)
    const hashed_password = await hash(password, salt)
    return this.prisma.customer.create({
      data: {
        username,
        email,
        hashed_password
      }
    })
  }

  async findOne(username: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { username }
    })
  }
}
