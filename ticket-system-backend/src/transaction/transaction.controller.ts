import { Controller, Get, Post, Body, Request, Param, UseGuards, NotFoundException, HttpCode, HttpStatus, Headers, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader, ApiBody } from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';

import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PublicTransactionResponseDto } from './dto/public-transaction.dto';
import { CheckoutIntentDto, ConfirmPaymentDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';

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
}