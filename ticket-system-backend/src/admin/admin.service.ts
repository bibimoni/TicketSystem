import { ForbiddenException, Injectable } from '@nestjs/common';
import { Admin, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private userService: UserService) { }

  async create(createAdminDto: CreateAdminDto) {
    const { user_id } = createAdminDto

    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new ForbiddenException();
    }

    return await this.prisma.admin.create({
      data: {
        user: {
          connect: { id: user_id }
        }
      }
    });
  }

  async getProfile(admin_id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: admin_id },
      include: { user: true }
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