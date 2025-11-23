import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { genSalt, hash } from 'bcrypt-ts';
import { PublicAdminResponseDto } from './dto/admin-response.dto';
import { Admin } from 'generated/prisma';

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