import { Controller, Get, Post, Body, Param, Request, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublicUserResponseDto } from './dto/customer-response.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User create' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    description: "Successfully create user",
    type: PublicUserResponseDto
  })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<PublicUserResponseDto> {
    return this.customerService.create(createCustomerDto);
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
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJpYXQiOjE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    }
  })
  @ApiResponse({
    description: "Successfully get user's profile",
    type: PublicUserResponseDto
  })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
