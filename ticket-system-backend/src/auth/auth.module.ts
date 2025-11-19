import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config/config';
import { AuthGuard, GoogleAuthGuard, GoogleStrategy } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { CustomerModule } from 'src/customer/customer.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.load().jwtSecret,
      signOptions: { expiresIn: config.jwtExpiresIn }
    }),
    PassportModule.register({ defaultStrategy: 'google' }),
    CustomerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AdminGuard, GoogleStrategy, GoogleAuthGuard],
  exports: [AuthService, AuthGuard, AdminGuard]
})
export class AuthModule { }
