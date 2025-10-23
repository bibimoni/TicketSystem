import { Body, Controller, Get, Post, Headers, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import type { Request as ExpressRequest } from 'express';
import Stripe from 'stripe';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post('stripe-webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe Webhook (test only)' })
  @ApiResponse({ status: 200, description: 'Event received' })
  async handleWebhook(
    @Body() body: any,
    @Headers('stripe-signature') signature?: string,
    @Req() req?: ExpressRequest & { rawBody?: Buffer },
  ): Promise<{ received: true; signaturePresent: boolean }> {
    await this.stripeService.handleWebhook(body);
    return { received: true, signaturePresent: Boolean(signature) };
  }

  // @Get('customers')
  // @ApiExcludeEndpoint()
  // async getCustomers(): Promise<Stripe.Customer[]> {
  //   return this.stripeService.getCustomers?.();
  // }

  // @Get('balance')
  // @ApiExcludeEndpoint()
  // async getBalance(): Promise<Stripe.Balance> {
  //   return this.stripeService.getBalance?.();
  // }
}