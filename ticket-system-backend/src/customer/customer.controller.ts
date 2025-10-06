import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { User } from 'generated/prisma';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<User> {
    return this.customerService.create(createCustomerDto);
  }

  // @Get()
  // findAll() {
  //   return this.customerService.findAll();
  // }

  // @Get(':username')
  // findOne(@Param('username') username: string) {
  //   return this.customerService.findOne(username);
  // }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
  //   return this.customerService.update(+id, updateCustomerDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.remove(+id);
  // }
}
