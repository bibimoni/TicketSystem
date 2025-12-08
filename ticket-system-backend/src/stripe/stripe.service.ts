import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { config } from '../config/config';
import Stripe from 'stripe'
import { CheckoutIntentDto, VoucherApplyDto } from 'src/transaction/dto/create-transaction.dto'; import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import { MailService } from 'src/mail/mail.service';
import { TicketService } from 'src/ticket/ticket.service';
import { Ticket } from 'generated/prisma';

type transaction_status = "PENDING" | "SUCCESS" | "CANCELLED";

function formatDateVN(dateInput: any): string {
  const d = new Date(dateInput);
  const date = d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh'
  });

  const time = d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  });

  return `${time} - ${date}`;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;

  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly prisma: PrismaService, private readonly cloudinaryService: CloudinaryService, private readonly mailService: MailService, private readonly ticketService: TicketService) {
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
    const { ticketTypeIds, vouchers } = checkoutDto;

    if (!ticketTypeIds || ticketTypeIds.length === 0) {
      throw new ForbiddenException("No ticket types selected");
    }
    const result = await this.prisma.$transaction(async (tx) => {
      const ticketTypes = await tx.ticketType.findMany({
        where: { id: { in: ticketTypeIds } },
      });

      for (const type of ticketTypes) {
        if (type.remaining <= 0) {
          throw new ForbiddenException(`Ticket type ${type.name} is sold out`);
        }
      }

      let priceBeforeVoucher = ticketTypes.reduce(
        (sum, type) => sum + (type.price ?? 0),
        0
      );

      let totalPrice = priceBeforeVoucher;
      let voucherIds: string[] = [];

      if (vouchers && vouchers.length > 0) {
        for (const v of vouchers) {
          const voucher = await tx.voucher.findUnique({
            where: { id: v.voucher_id }
          });

          if (!voucher) continue;

          const now = new Date();
          if (voucher.start_date <= now && voucher.end_date >= now) {
            if (totalPrice >= voucher.price) {
              if (voucher.reduce_type === "PERCENTAGE") {
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

      const trx = await tx.transaction.create({
        data: {
          time_date: new Date(),
          method: "CREDIT_CARD",
          status: "PENDING",
          customer: { connect: { id: customerId } },
          price_before_voucher: priceBeforeVoucher,
          total_price: totalPrice,
        },
      });

      const createdTickets: string[] = [];

      for (const type of ticketTypes) {
        const ticket = await this.ticketService.createTicket(type.id);
        createdTickets.push(ticket.id);
      }

      return { trx, ticketTypes, createdTickets, totalPrice, voucherIds, priceBeforeVoucher };
    });

    const stripeCustomers = await this.stripe.customers.search({
      query: `metadata['customer_id']:'${customerId}'`,
    });
    const stripeCustomer = stripeCustomers.data[0];

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: { name: `Tickets (${result.createdTickets.length})` },
            unit_amount: result.totalPrice,
          },
          quantity: 1,
        },
      ],
      success_url: config.stripeCheckoutSuccessUrl,
      cancel_url: config.stripeCheckoutCancelUrl,
      customer: stripeCustomer.id,

      metadata: {
        transaction_id: result.trx.id,
        customer_id: customerId,
        ticket_type_ids: ticketTypeIds.join(","),
        ticket_ids: result.createdTickets.join(","),
        voucher_ids: result.voucherIds.join(","),
        price_before_voucher: String(result.priceBeforeVoucher),
        total_price: String(result.totalPrice),
      },
      payment_intent_data: {
        metadata: {
          transaction_id: result.trx.id,
          customer_id: customerId,
          ticket_ids: result.createdTickets.join(','),
          voucher_ids: result.voucherIds.join(','),
          price_before_voucher: String(result.priceBeforeVoucher),
          total_price: String(result.totalPrice),
          currency: 'vnd',
        }
      }
    });

    return { url: session.url };
  }

  private async handlePaymentSuccess(pi: Stripe.PaymentIntent) {
    const metadata = pi.metadata ?? {};
    const transactionId = metadata.transaction_id;
    const customerId = metadata.customer_id;
    const ticketIds = (metadata.ticket_ids ?? '').split(',').filter(Boolean);
    const voucherIds = (metadata.voucher_ids ?? '').split(',').filter(Boolean);
    const priceBefore = Number(metadata.price_before_voucher ?? 0);
    const totalPriceMeta = Number(metadata.total_price ?? 0);
    const currency = (metadata.currency ?? 'vnd').toLowerCase();

    if (!transactionId || !customerId) {
      this.logger.warn(`Missing metadata: transaction_id/customer_id in PI ${pi.id}`);
      return;
    }

    const existingTrx = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!existingTrx) {
      this.logger.warn(`Transaction ${transactionId} not found`);
      return;
    }
    if (existingTrx.status === 'SUCCESS') {
      this.logger.log(`Transaction ${transactionId} already processed - skipping`);
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

    let fullTickets: Array<any> = [];

    await this.prisma.$transaction(async (tx) => {
      fullTickets = await tx.ticket.findMany({
        where: { id: { in: ticketIds } },
        include: {
          ticket_type: {
            include: {
              event: true,
            }
          }
        }
      });
      if (!fullTickets.length) {
        throw new Error('No tickets to issue');
      }

      const ticketTypeIds = fullTickets.map(t => t.ticket_type.id);

      await tx.ticketType.updateMany({
        where: { id: { in: ticketTypeIds } },
        data: { remaining: { decrement: 1 } }
      });

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
            voucher_id: vId
          })),
        });
      }
    });

    const customerRecord = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { user: true },
    });

    const purchaserUser = customerRecord?.user;

    for (const ticket of fullTickets) {
      const ticketCode = ticket.code
      const qrPayload = { code: ticketCode, ticket_id: ticket.id, transaction_id: trx.id, customer_id: customerId, user_id: purchaserUser?.id ?? null };

      const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrPayload), { type: 'png', margin: 1, width: 300 });

      const fakeFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: `${ticketCode}`,
        encoding: '7bit',
        mimetype: 'image/png',
        size: qrBuffer.length,
        buffer: qrBuffer,
        destination: '',
        filename: `${ticketCode}`,
        path: '',
        stream: undefined as any,
      };

      const uploadResult = await this.cloudinaryService.uploadImage(fakeFile, 'tickets/qr_codes');
      const qr_code_url = uploadResult.secure_url;
      this.logger.log(`Generated QR for ticket ${ticket.id}: ${qr_code_url}`);

      await this.prisma.ticket.update({
        where: { id: ticket.id },
        data: { qr_code_url }
      });
    }

    fullTickets = await this.prisma.ticket.findMany({
      where: { id: { in: ticketIds } },
      include: {
        ticket_type: {
          include: {
            event: true,
          }
        }
      }
    });

    try {
      const emailTickets = fullTickets.map(t => ({
        type: t.ticket_type.name ?? 'Ticket',
        code: t.code,
        quantity: 1,
        qr: t.qr_code_url,
        price: t.ticket_type.price
      }));

      const rawEventTime = fullTickets[0].ticket_type.event.eventTime;
      const eventTimeFormatted = rawEventTime ? formatDateVN(rawEventTime) : 'N/A';

      const mailHtml = await this.mailService['renderTemplate']({
        templateName: 'ticket-order-success',
        data: {
          orderCode: trx.id,
          tickets: emailTickets,
          eventTitle: fullTickets[0].ticket_type.event.name ?? 'N/A',
          eventTime: eventTimeFormatted,
          eventAddress: fullTickets[0].ticket_type.event.destination ?? 'N/A',
          buyerName: purchaserUser?.username ?? 'Customer',
          buyerEmail: purchaserUser?.email ?? 'N/A',
          ticketCodeImg: emailTickets[0].qr,
          ticketCode: emailTickets[0].code,
          paymentMethod: 'Credit Card (Stripe)',
          createdAt: formatDateVN(new Date()),
          quantity: fullTickets.length,
          totalAmount: trx.total_price.toLocaleString('vi-VN'),
          year: new Date().getFullYear(),
        },
      });

      await this.mailService.sendMail({
        to: purchaserUser?.email || 'Customer',
        subject: `Confirm payment #${trx.id}`,
        html: mailHtml,
      });

      this.logger.log(`Email sent to ${purchaserUser?.email}`);
    } catch (emailErr) {
      this.logger.error("Failed to send email:", emailErr);
    }

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
