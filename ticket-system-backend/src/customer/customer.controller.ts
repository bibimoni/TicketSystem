import { Controller, Get, Post, Body, Param, Request, UseGuards, HttpStatus, HttpCode, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublicUserResponseDto } from './dto/customer-response.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { AuthService } from 'src/auth/auth.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User create' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: 200,
    description: "Successfully create user",
    type: PublicUserResponseDto
  })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<PublicUserResponseDto> {
    const customer = await this.customerService.create(createCustomerDto);

    return customer;
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsI...',
    }
  })
  @ApiResponse({
    description: "Successfully get user's profile",
    type: PublicUserResponseDto
  })
  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = req.user
    if (!user) {
      throw new UnauthorizedException()
    }
    return await this.customerService.findOne({ username: user.username, email: user.email })
  }
}
