import { Controller, Get, Post, Body, Request, Param, UseGuards, NotFoundException, HttpCode, HttpStatus, Headers, Req, ForbiddenException, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader, ApiBody } from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';

import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PublicTransactionResponseDto } from './dto/public-transaction.dto';
import { CheckoutIntentDto, ConfirmPaymentDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { CancelPendingTransactionDto } from './dto/cancel-pending.dto';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService, private readonly prisma: PrismaService, private readonly stripeService: StripeService) { }

  @Post('checkout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create Stripe Checkout Session',
    description: 'Return Stripe Checkout URL to redirect user',
  })
  @ApiBody({
    type: CheckoutIntentDto,
  })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer customer token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout session created',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://checkout.stripe.com/c/pay/cs_test_xxx' },
        message: { type: 'string' },
      },
    },
  })
  async createCheckoutSession(
    @Body() checkoutDto: CheckoutIntentDto,
    @Request() req: any,
  ): Promise<{ url: string, message: string }> {
    const customer = await this.prisma.customer.findUnique({
      where: { user_id: req.user.id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const result = await this.stripeService.checkout(checkoutDto, customer.id);

    if (!result.url) {
      throw new Error("Cannot create checkout session!");
    }

    return {
      url: result.url,
      message: 'Redirect to this URL to complete payment',
    };
  }

  @Get('my-transactions')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all transactions of current customer' })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer customer token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [PublicTransactionResponseDto]
  })
  async getMyTransactions(@Request() req): Promise<PublicTransactionResponseDto[]> {
    const customer = await this.prisma.customer.findUnique({
      where: { user_id: req.user.id }
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return await this.transactionService.getTransactionsByCustomer(customer.id);
  }

  @Get('revenue')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Admin get total revenue' })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer admin token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Total revenue',
  })
  async getTotalRevenue(): Promise<number> {
    return await this.transactionService.getTotalRevenue();
  }

  @Get('event_transactions')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Event organizer get all transactions for the event' })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer event organizer token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  async getAllTransactions(@Request() req: any) {
    const eventOrganizerId = req.user.id;
    if (!eventOrganizerId) {
      throw new ForbiddenException('Cannot find any user id');
    }

    console.log(eventOrganizerId);

    return await this.transactionService.eventOrganizerGetTransactions(eventOrganizerId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer customer token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    type: PublicTransactionResponseDto
  })
  async getTransactionById(@Param('id') id: string): Promise<PublicTransactionResponseDto> {
    const transaction = await this.transactionService.getTransactionById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  @Delete('cancel-pending')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer customer token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel pending transaction and decrease each ticket type remaining' })
  @ApiBody({
    type: CancelPendingTransactionDto
  })
  async cancelPending(@Request() req: any, @Body() dto: CancelPendingTransactionDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { user_id: req.user.id }
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.transactionService.cancelPendingByCustomer(customer.id, dto);
  }
}
