import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService, private userService: UserService) { }
}