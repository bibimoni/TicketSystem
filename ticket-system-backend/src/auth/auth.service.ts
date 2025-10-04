import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async signIn(username: string, pass string): Promise<any> {
    const user = await this.prisma.findUnique({ where: { username } })
  }
}
