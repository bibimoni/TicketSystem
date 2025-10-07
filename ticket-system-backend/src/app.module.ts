import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerController } from './customer/customer.controller';
import { AuthModule } from './auth/auth.module';
import { CustomerService } from './customer/customer.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { AdminModule } from './admin/admin.module';
import { EventService } from './event/event.service';
import { AdminService } from './admin/admin.service';
import { EventController } from './event/event.controller';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    EventModule,
    AdminModule
  ],
  controllers: [CustomerController, AuthController, EventController, AdminController],
  providers: [PrismaService, AuthService, CustomerService, EventService, AdminService],
  exports: [PrismaService]
})
export class AppModule { }
