import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, genSalt, hash } from 'bcrypt-ts';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from 'src/customer/customer.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService,
    private jwtService: JwtService,
    private customerService: CustomerService,
    private userService: UserService) { }

  async signInGoogle(user: any): Promise<any> {
    if (!user) {
      return new BadRequestException('Unauthentication')
    }

    let userFound = await this.prisma.user.findUnique({
      where: {
        email: user.email
      }
    })
    // console.log(userFound)

    if (!userFound) {
      await this.customerService.create({
        password: AuthService.randomString(10),
        username: `${user.name}-${AuthService.randomString(6)}`,
        email: user.email
      });
      userFound = await this.prisma.user.findUnique({
        where: {
          email: user.email
        }
      })
      this.userService.updateProfile({ email: user.email }, { avatar: user.picture })
    }

    if (!userFound) {
      return new ForbiddenException();
    }

    const isAdmin = await this.checkAdmin(userFound.id)

    const payload = {
      id: userFound.id,
      username: userFound.username,
      isAdmin: isAdmin
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: userFound.id,
        username: userFound.username,
        email: user.email,
        isAdmin: isAdmin
      }
    }

  }

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } })
    if (!user) {
      throw new UnauthorizedException();
    }
    const { hashed_password, id, ..._ } = user;
    if (!await compare(password, hashed_password)) {
      throw new UnauthorizedException();
    }

    const isAdmin = await this.checkAdmin(id)

    const payload = {
      id: user.id,
      username: user.username,
      isAdmin: isAdmin // Thêm flag để nhận biết admin
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: isAdmin
      }
    };
  }

  async checkAdmin(userId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { user_id: userId }
    });

    return !!admin;
  }

  static async hashPassword(password: string) {
    const salt = await genSalt(10)
    const hashed_password = await hash(password, salt)
    return hashed_password
  }

  static randomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace('.', '')
      .toUpperCase()
      .substr(0, length);
  }
}
