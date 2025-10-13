import { DynamicModule, FactoryProvider, Module, ModuleMetadata, Provider } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './constants';
import { StripeModuleAsyncOptions } from './stripe-module-async-options.interface';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  providers: [StripeService],
  controllers: [StripeController]
})
export class StripeModule {
  // Synchronous
  static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(apiKey, config);

    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useValue: stripe
    };

    return {
      module: StripeModule,
      providers: [stripeProvider],
      exports: [stripeProvider],
      global: true
    };
  }

  // Asynchronous
  static forRootAsync(options: StripeModuleAsyncOptions): DynamicModule {
    const stripeProvider: FactoryProvider = {
      provide: STRIPE_CLIENT,
      useFactory: async (...args: any[]) => {
        const configResult = await options.useFactory(...args);
        return new Stripe(configResult.apiKey, configResult.options)
      },
      inject: options.inject || [],
    };

    return {
      module: StripeModule,
      imports: options.imports,
      providers: [stripeProvider],
      exports: [stripeProvider],
      global: true
    }
  }
}
