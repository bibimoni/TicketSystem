import { Injectable } from '@nestjs/common';
import { Customer } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { username, password, email } = createCustomerDto
    const hashed_password = await AuthService.hashPassword(password)
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
