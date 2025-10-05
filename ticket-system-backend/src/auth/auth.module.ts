import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config/config';

@Module({
  imports: [
    CustomerService,
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: config.jwtExpiresIn }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
