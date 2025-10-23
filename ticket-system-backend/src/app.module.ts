import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { StripeModule } from './stripe/stripe.module';
import { config } from './config/config';
import { TicketModule } from './ticket/ticket.module';
import { TransactionModule } from './transaction/transaction.module';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    EventModule,
    AdminModule,
    TicketModule,
    TransactionModule,
    VoucherModule,
    StripeModule.forRootAsync({
      useFactory: () => ({
        apiKey: config.stripeApiKey || '',
        options: {
          apiVersion: '2025-09-30.clover'
        }
      })
    }),
  ],
  controllers: [CustomerController, AuthController, EventController, AdminController],
  providers: [PrismaService, AuthService, CustomerService, EventService, AdminService],
  exports: [PrismaService]
})
export class AppModule { }
