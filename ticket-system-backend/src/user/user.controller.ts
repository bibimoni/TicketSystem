import { Controller, Get, Body, UseGuards, HttpCode, HttpStatus, Request, UnauthorizedException, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PublicUserResponseDto } from 'src/customer/dto/customer-response.dto';
import { UpdateProfileDto } from 'src/customer/dto/update-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findOne(@Body('username') username: string) {
    return await this.userService.findOneByUsername(username)
  }

  // @UseGuards(AuthGuard)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get Profile' })
  // @ApiBearerAuth('JWT-auth')
  // @ApiHeader({
  //   name: "Authorization",
  //   description: "Bearer token for authorization",
  //   required: true,
  //   schema: {
  //     type: 'string',
  //     example: 'Bearer eyJhbGciOiJIUzI1NiIsI...',
  //   }
  // })
  // @ApiResponse({
  //   description: "Successfully get user's profile",
  //   type: PublicUserResponseDto
  // })
  // @Get('profile')
  // async getProfile(@Request() req: any) {
  //   const user = req.user
  //   if (!user) {
  //     throw new UnauthorizedException()
  //   }
  //   return await this.userService.findOne({ username: user.username, email: user.email })
  // }

  // @UseGuards(AuthGuard)
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Update profile' })
  // @ApiBearerAuth('JWT-auth')
  // @ApiHeader({
  //   name: "Authorization",
  //   description: "Bearer token for authorization",
  //   required: true,
  //   schema: {
  //     type: 'string',
  //     example: 'Bearer eyJhbGciOiJIUzI1NiIsI...',
  //   }
  // })
  // @Patch('profile')
  // async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto): Promise<any> {
  //   const user = req.user
  //   if (!user) {
  //     throw new UnauthorizedException()
  //   }
  //   return await this.userService.updateProfile({ username: user.username, email: user.email }, updateProfileDto)
  // }
}
