import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { genSalt, hash } from 'bcrypt-ts';
import { PublicAdminResponseDto } from './dto/admin-response.dto';
import { Admin } from 'generated/prisma';
import { UpdateProfileDto } from 'src/customer/dto/update-profile.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private userService: UserService) { }

  async create(createAdminDto: CreateAdminDto): Promise<PublicAdminResponseDto> {
    const { username, password, email } = createAdminDto;
    const salt = await genSalt(10);
    const hashed_password = await hash(password, salt);

    const user = await this.userService.create({
      hashed_password,
      username,
      email
    })

    if (!user) {
      throw new ForbiddenException();
    }

    const admin = await this.prisma.admin.create({
      data: {
        user_id: user.id
      },
      include: { user: true }
    });

    if (!admin) {
      throw new ForbiddenException();
    }

    const { hashed_password: _, id: __, ...userWithoutPassword } = admin.user;

    return {
      id: admin.id,
      ...userWithoutPassword
    }
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
    const admin = await this.prisma.admin.findUnique({
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
    if (!admin) {
      throw new ForbiddenException()
    }
    return admin
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

  async getProfile(user_id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { user_id },
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
        }
      }
    });

    if (!admin) {
      throw new ForbiddenException()
    }

    return admin
  }

  async findAll(): Promise<Admin[]> {
    return this.prisma.admin.findMany({
      include: { user: true }
    });
  }
}