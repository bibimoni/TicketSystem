import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { genSalt, hash } from 'bcrypt-ts';
import { UserService } from 'src/user/user.service';
import { PublicUserResponseDto } from './dto/customer-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService, private userService: UserService) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<PublicUserResponseDto> {
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
      },
      include: { user: true }
    })

    if (!customer) {
      throw new ForbiddenException()
    }

    const { hashed_password: _, id: __, ...result } = user;
    return {
      id: customer.id,
      ...result
    }
  }

  async updateProfile({ username, email }: { username?: string, email?: string }, dto: UpdateProfileDto): Promise<any> {
    let user: any;
    if (username) {
      user = await this.userService.findOneByUsername(username);
    } else if (email) {
      user = await this.userService.findOneByEmail(email)
    }
    if (!user) {
      throw new ForbiddenException()
    }

    const updatedCustomer = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...dto
      },
    })

    return await this.findOne({ id: updatedCustomer.id })
  }

  async findOne({ id, username, email }: { id?: string, username?: string | undefined, email?: string | undefined }): Promise<any | null> {
    let user: any;
    if (username) {
      user = await this.userService.findOneByUsername(username);
    } else if (email) {
      user = await this.userService.findOneByEmail(email)
    } else if (id) {
      user = await this.prisma.user.findUnique({
        where: { id }
      })
    }
    if (!user) {
      throw new ForbiddenException()
    }
    const customer = await this.prisma.customer.findUnique({
      where: { user_id: user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            sex: true,
            address: true,
            birth_date: true,
            information: true,
            phone_number: true,
            username: true,
            avatar: true,
            avatar_public_id: true
          }
        },
      }
    })
    if (!customer) {
      throw new ForbiddenException()
    }
    return customer
  }

  async findCustomerId(username: string): Promise<string | null> {
    const user = await this.userService.findOneByUsername(username)
    if (!user) {
      throw new ForbiddenException()
    }
    const customer = await this.prisma.customer.findUnique({
      where: { user_id: user.id }
    })
    if (!customer) {
      throw new ForbiddenException()
    }
    return customer.id
  }
}
