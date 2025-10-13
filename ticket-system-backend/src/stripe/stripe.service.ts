import { Injectable } from '@nestjs/common';
import { config } from '../config/config';
import Stripe from 'stripe'

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(config.stripeApiKey, {
      apiVersion: '2025-09-30.clover'
    })
  }
}
