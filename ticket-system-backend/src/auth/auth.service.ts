import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, genSalt, hash } from 'bcrypt-ts';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } })
    this.logger.log("hi");
    if (!user) {
      throw new UnauthorizedException();
    }
    const { hashed_password, id, ...result } = user;
    if (!await compare(password, hashed_password)) {
      throw new UnauthorizedException();
    }
    const payload = { id, username }
    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }


  static async hashPassword(password: string) {
    const salt = await genSalt(10)
    const hashed_password = await hash(password, salt)
    return hashed_password
  }
}
