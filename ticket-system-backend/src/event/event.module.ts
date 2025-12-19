import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomerModule } from 'src/customer/customer.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { VoucherModule } from 'src/voucher/voucher.module';

@Module({
  imports: [PrismaModule, CustomerModule, TicketModule, VoucherModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule { }
