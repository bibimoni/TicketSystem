import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { CustomerModule } from 'src/customer/customer.module';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';


@Module({
  imports: [CustomerModule, UserModule, AdminModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule { }
