import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerController } from './customer/customer.controller';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CustomerModule,
    PrismaModule,
    AuthModule,
    UserModule
  ],
  controllers: [CustomerController, UserController],
  providers: [PrismaService, UserService],
  exports: [PrismaService]
})
export class AppModule { }
