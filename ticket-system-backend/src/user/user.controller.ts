import { Controller, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findOne(@Body('username') username: string) {
    return await this.userService.findOneByUsername(username)
  }
}
