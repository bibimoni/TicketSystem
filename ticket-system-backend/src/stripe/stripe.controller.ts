import { Controller, Post, Headers, Req, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { config } from 'src/config/config';
import Stripe from 'stripe';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post('stripe-webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe Webhook (test only)' })
  @ApiResponse({ status: 200, description: 'Event received' })
  async handleWebhook(@Req() req: any, @Headers('stripe-signature') sig: string) {
    const payload: Buffer = req.rawBody;
    const secret = config.stripeWebhookSecret;

    if (!sig || !payload) {
      throw new BadRequestException('Missing stripe signature or payload');
    }

    // console.log("Stripe-Signature:", sig);

    let event: Stripe.Event;
    try {
      event = this.stripeService.constructEventFromWebhook(payload, sig, secret);
    } catch (err) {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    await this.stripeService.handleWebhook(event);
    return { received: true };
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
