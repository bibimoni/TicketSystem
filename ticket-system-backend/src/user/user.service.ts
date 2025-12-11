import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'generated/prisma'
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from 'src/customer/dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        hashed_password: createUserDto.hashed_password,
        username: createUserDto.username,
        email: createUserDto.email,
      }
    })
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username }
    })
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  async findOne({ id, username, email }: { id?: string, username?: string | undefined, email?: string | undefined }): Promise<any | null> {
    let user: any;
    if (username) {
      user = await this.findOneByUsername(username);
    } else if (email) {
      user = await this.findOneByEmail(email)
    } else if (id) {
      user = await this.prisma.user.findUnique({
        where: { id },
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
      })
    }
    if (!user) {
      throw new ForbiddenException()
    }
    return user
  }

  async updateProfile({ username, email }: { username?: string, email?: string }, dto: UpdateProfileDto): Promise<any> {
    let user: any;
    if (username) {
      user = await this.findOneByUsername(username);
    } else if (email) {
      user = await this.findOneByEmail(email)
    }
    if (!user) {
      throw new ForbiddenException()
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...dto
      },
    })

    return await this.findOne({ id: updatedUser.id })
  }

  async getProfile(user_id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
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
    });

    if (!user) {
      throw new ForbiddenException()
    }

    return user
  }
}
