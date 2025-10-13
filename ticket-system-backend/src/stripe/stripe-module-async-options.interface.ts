import { ModuleMetadata } from "@nestjs/common";
import Stripe from 'stripe'

export interface StripeModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<{ apiKey: string; options: Stripe.StripeConfig }> | { apiKey: string; options: Stripe.StripeConfig };
  inject?: any[];
}