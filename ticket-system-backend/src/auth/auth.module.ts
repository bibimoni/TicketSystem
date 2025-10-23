import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config/config';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.load().jwtSecret,
      signOptions: { expiresIn: config.jwtExpiresIn }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AdminGuard],
  exports: [AuthService, AuthGuard, AdminGuard]
})
export class AuthModule { }
