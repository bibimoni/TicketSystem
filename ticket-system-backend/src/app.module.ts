import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerController } from './customer/customer.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CustomerModule,
    PrismaModule
  ],
  controllers: [CustomerController],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule { }
