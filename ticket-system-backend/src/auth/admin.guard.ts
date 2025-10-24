import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { user_id: user.id }
    });

    if (!admin) {
      throw new ForbiddenException('Admin access required');
    }

    req.admin = admin;
    return true;
  }
}