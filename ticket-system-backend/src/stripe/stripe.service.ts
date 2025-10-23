import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { config } from '../config/config';
import Stripe from 'stripe'
import { CheckoutIntentDto, VoucherApplyDto } from 'src/transaction/dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from 'src/customer/customer.service';

type transaction_status = "PENDING" | "SUCCESS" | "CANCELLED";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  private readonly logger = new Logger(StripeService.name);

  constructor(private prisma: PrismaService, private customerService: CustomerService) {
    this.stripe = new Stripe(config.stripeApiKey, {
      apiVersion: '2025-09-30.clover'
    })
  };

  async createCustomer(data: {
    email: string;
    name: string;
    metadata: { customer_id: string };
  }): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: data.metadata
      });
      this.logger.log(`Stripe customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error('Failed to create Stripe customer', error.stack);
      throw error;
    }
  }

  async getCustomers() {
    try {
      const customers = await this.stripe.customers.list({});
      this.logger.log("Customers fetched successfully");
      return customers.data
    } catch (error) {
      this.logger.log("Failed to fetch customers", error.stack);
      throw error;
    }
  };

  private async getOrCreateTransactionInfo(
    amount: number,
    status: transaction_status,
    customerId: string | null,
    transactionId?: string | null,
  ) {
    if (!customerId) {
      throw new Error('Cannot create transaction without a valid customer ID');
    }

    if (transactionId) {
      const existingTransaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
      });

      if (existingTransaction) {
        this.logger.log(`Found existing transaction: ${existingTransaction.id}`);

        await this.prisma.transaction.update({
          where: { id: existingTransaction.id },
          data: { status: status, total_price: amount },
        });
        return existingTransaction;
      }
    }

    const transactionData: any = {
      total_price: amount,
      status: status,
    };

    const transaction = await this.prisma.transaction.create({
      data: {
        ...transactionData,
        customer: { connect: { customer_id: customerId } },
      },
    });

    this.logger.log(`Transaction created!`);
    return transaction;
  }

  async createSubscription(
    customerId: string,
    ticketPriceId: string,
    amount: number,
  ): Promise<Stripe.Subscription> {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId }
      });

      if (!customer) {
        throw new Error(`Customer with id '${customerId}' not found`);
      }

      const transaction = await this.getOrCreateTransactionInfo(amount, 'PENDING', customerId);

      const stripeCustomers = await this.stripe.customers.search({
        query: `metadata['customer_id']:'${customerId}'`,
      });

      const stripeCustomer = stripeCustomers.data[0];

      const subscription = await this.stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [
          { price: ticketPriceId, metadata: { id: transaction.id } },
        ],
      });

      this.logger.log(
        `Subscription created successfully for customer ${customerId}`,
      );

      return subscription;
    } catch (error) {
      this.logger.error('Failed to create subscription', error.stack);
      throw error;
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string // 'vnd'
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency
      });

      this.logger.log(
        `PaymentIntent created successfully with amount: ${amount} ${currency} `,
      );
      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to create PaymentIntent', error.stack);
      throw error;
    }
  };

  async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<void> {
    try {
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      this.logger.log(
        `Payment method ${paymentMethodId} attached to customer ${customerId} `,
      );
    } catch (error) {
      this.logger.error('Failed to attach payment method', error.stack);
      throw error;
    }
  }

  async getBalance(): Promise<Stripe.Balance> {
    try {
      const balance = await this.stripe.balance.retrieve();
      this.logger.log('Balance retrieved successfully');
      return balance;
    } catch (error) {
      this.logger.error('Failed to retrieve balance', error.stack);
      throw error;
    }
  }

  async createPaymentLink(priceId: string): Promise<Stripe.PaymentLink> {
    try {
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [{ price: priceId, quantity: 1 }],
      });
      this.logger.log('Payment link created successfully');
      return paymentLink;
    } catch (error) {
      this.logger.error('Failed to create payment link', error.stack);
      throw error;
    }
  }

  async calculateTotalPrice(
    ticketIds: string[],
    vouchers?: VoucherApplyDto[]
  ): Promise<{ priceBeforeVoucher: number; totalPrice: number }> {
    const tickets = await this.prisma.ticket.findMany({
      where: { id: { in: ticketIds } },
      include: { ticketPrice: true }
    });

    const priceBeforeVoucher = tickets.reduce((sum, ticket) => {
      return sum + ticket.ticketPrice.price;
    }, 0);

    let totalPrice = priceBeforeVoucher;

    if (vouchers && vouchers.length > 0) {
      for (const voucherDto of vouchers) {
        const voucher = await this.prisma.voucher.findUnique({
          where: { id: voucherDto.voucher_id }
        });

        if (!voucher) continue;

        if (voucher.reduce_type === 'PERCENTAGE') {
          totalPrice -= (totalPrice * voucher.reduce_price / 100);
        } else if (voucher.reduce_type === 'FIXED') {
          totalPrice -= voucher.reduce_price;
        }
      }
    }

    totalPrice = Math.max(0, totalPrice);

    return { priceBeforeVoucher, totalPrice };
  }

  async getStripeCustomerByCustomerId(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customers = await this.stripe.customers.list({
        limit: 1
      });

      const customer = customers.data.find(
        c => c.metadata?.user_id === customerId
      );

      return customer || null;
    } catch (error) {
      this.logger.error('Failed to get Stripe customer', error.stack);
      throw error;
    }
  }

  async checkout(checkoutDto: CheckoutIntentDto, customerId: string) {
    const { ticketIds, vouchers } = checkoutDto;

    const tickets = await this.prisma.ticket.findMany({
      where: {
        id: { in: ticketIds },
        status: 'AVAILABLE'
      },
      include: {
        ticketPrice: true
      }
    });

    if (tickets.length === 0) {
      throw new ForbiddenException('No available tickets found');
    }

    if (tickets.length !== ticketIds.length) {
      throw new ForbiddenException('Some tickets are not available');
    }

    let priceBeforeVoucher = tickets.reduce((sum, ticket) => {
      return sum + ticket.ticketPrice.price;
    }, 0);

    let totalPrice = priceBeforeVoucher;
    const voucherIds: string[] = [];

    if (vouchers && vouchers.length > 0) {
      for (const voucherApply of vouchers) {
        const voucher = await this.prisma.voucher.findUnique({
          where: { id: voucherApply.voucher_id }
        });

        if (!voucher) continue;

        const now = new Date();
        if (voucher.start_date <= now && voucher.end_date >= now && voucher.amount > 0) {
          if (totalPrice >= voucher.price) {
            // Áp dụng voucher
            if (voucher.reduce_type === 'PERCENTAGE') {
              totalPrice -= (totalPrice * voucher.reduce_price) / 100;
            } else {
              totalPrice -= voucher.reduce_price;
            }
            voucherIds.push(voucher.id);
          }
        }
      }
    }

    totalPrice = Math.max(0, totalPrice);

    const stripeCustomers = await this.stripe.customers.search({
      query: `metadata['customer_id']:'${customerId}'`,
    });

    const stripeCustomer = stripeCustomers.data[0];

    const trx = await this.prisma.transaction.create({
      data: {
        time_date: new Date(),
        method: 'CREDIT_CARD',
        status: 'PENDING',
        price_before_voucher: priceBeforeVoucher,
        total_price: totalPrice,
        customer: { connect: { id: customerId } },
      },
    });

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'vnd',
          product_data: { name: `Tickets (${tickets.length})` },
          unit_amount: totalPrice,
        },
        quantity: 1,
      }],
      success_url: config.stripeCheckoutSuccessUrl,
      cancel_url: config.stripeCheckoutCancelUrl,
      customer: stripeCustomer.id,

      metadata: {
        transaction_id: trx.id,
        customer_id: customerId,
        ticket_ids: ticketIds.join(','),
        voucher_ids: voucherIds.join(','),
        price_before_voucher: String(priceBeforeVoucher),
        total_price: String(totalPrice),
        currency: 'vnd',
      },
      payment_intent_data: {
        metadata: {
          transaction_id: trx.id,
          customer_id: customerId,
          ticket_ids: ticketIds.join(','),
          voucher_ids: voucherIds.join(','),
          price_before_voucher: String(priceBeforeVoucher),
          total_price: String(totalPrice),
          currency: 'vnd',
        },
      },
    });

    return { url: session.url };
  }

  private async handlePaymentSuccess(pi: Stripe.PaymentIntent) {
    const md = pi.metadata ?? {};
    const transactionId = md.transaction_id;
    const customerId = md.customer_id;
    const ticketIds = (md.ticket_ids ?? '').split(',').filter(Boolean);
    const voucherIds = (md.voucher_ids ?? '').split(',').filter(Boolean);
    const priceBefore = Number(md.price_before_voucher ?? 0);
    const totalPriceMeta = Number(md.total_price ?? 0);
    const currency = (md.currency ?? 'vnd').toLowerCase();

    if (!transactionId || !customerId) {
      this.logger.warn(`Missing metadata: transaction_id/customer_id in PI ${pi.id}`);
      return;
    }

    const amountReceived = currency === 'vnd'
      ? (pi.amount_received ?? 0)
      : (pi.amount_received ?? 0) / 100;

    const trx = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'SUCCESS',
        total_price: amountReceived || totalPriceMeta,
        price_before_voucher: priceBefore,
        time_date: new Date(),
      },
    });

    await this.prisma.$transaction(async (tx) => {
      const fullTickets = await tx.ticket.findMany({
        where: { id: { in: ticketIds } },
        include: { ticketPrice: true, event: true }
      });
      if (!fullTickets.length) throw new Error('No tickets to issue');

      await tx.ticket.updateMany({
        where: { id: { in: ticketIds }, status: 'AVAILABLE' },
        data: { status: 'SOLD' }
      });

      await tx.transactionHasTicket.createMany({
        data: ticketIds.map(id => ({
          transaction_id: trx.id,
          ticket_id: id,
          amount: 1,
        })),
      });

      if (voucherIds.length) {
        await tx.transactionApplyVoucher.createMany({
          data: voucherIds.map(vId => ({
            transaction_id: trx.id,
            voucher_id: vId,
            apply_count: 1,
          })),
        });
        await tx.voucher.updateMany({
          where: { id: { in: voucherIds } },
          data: { amount: { decrement: 1 } }
        });
      }
    });

    this.logger.log(`Payment success handled. trx=${trx.id}, pi=${pi.id}`);
  }

  async createCheckoutSessionService(
    items: {
      name: string;
      price: number;
      quantity: number;
      ticketTypeId: number;
    }[],
    customerId: string,
    eventId: string,
  ) {
    console.log('Creating subscription for customer ID:', customerId);
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await this.getOrCreateTransactionInfo(
      totalAmount,
      'PENDING',
      customerId,
    );

    const lineItems = items.map((i) => ({
      price_data: {
        currency: 'vnd',
        product_data: {
          name: i.name,
          metadata: {
            ticket_type_id: i.ticketTypeId,
            order_id: order.id,
          },
        },
        unit_amount: i.price,
      },
      quantity: i.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: config.stripeCheckoutSuccessUrl,
      cancel_url: config.stripeCheckoutCancelUrl,

      payment_intent_data: {
        metadata: {
          transaction_id: order.id,
          customer_id: customerId,
          ticket_type_id: items.map((i) => i.ticketTypeId).join(','),
          quantity: items.map((i) => i.quantity).join(','),
          event_id: eventId,
        },
      },
      metadata: {
        transaction_id: order.id,
        customer_id: customerId,
        event_id: eventId,
      },
    });

    this.logger.log(`Checkout session created for order ${order.id}`);

    return {
      url: session.url,
    };
  }

  async handleWebhook(event: Stripe.Event) {
    const dataObject = event.data.object as Stripe.PaymentIntent;
    switch (event.type) {
      case 'payment_intent.created':
        this.logger.log('Payment intent created');
        break;
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(dataObject);
        break;

      case 'payment_method.attached':
        this.logger.log('Payment method attached');
        break;

      case 'checkout.session.completed':
        this.logger.log('Checkout session completed');
        break;

      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }
  }

  constructEventFromWebhook(payload: Buffer, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(payload, sig, secret);
  }
};