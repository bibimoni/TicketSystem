import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/extension';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'generated/prisma'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaClient) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        hashed_password: createUserDto.hashed_password,
        username: createUserDto.username,
        email: createUserDto.email,
      }
    })
  }

  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username }
    })
  }
}
