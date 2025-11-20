import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { StripeService } from "src/stripe/stripe.service";
import { CheckoutIntentDto } from "./dto/create-transaction.dto";
import { PublicTransactionResponseDto } from "./dto/public-transaction.dto";

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService, private stripeService: StripeService) { }

  async createCheckout(checkoutDto: CheckoutIntentDto, customerId: string) {
    return await this.stripeService.checkout(checkoutDto, customerId);
  }
  async getTransactionsByCustomer(customerId: string): Promise<PublicTransactionResponseDto[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { customer_id: customerId },
      include: {
        tickets: {
          include: {
            ticket: {
              include: {
                ticket_type: {
                  include: {
                    event: true,
                    ticketPrice: true
                  }
                }
              }
            }
          }
        },
        vouchers: {
          include: {
            voucher: true
          }
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { time_date: 'desc' }
    });
    return transactions.map(transaction => ({
      id: transaction.id,
      time_date: transaction.time_date,
      method: transaction.method as string,
      status: transaction.status as string,
      price_before_voucher: transaction.price_before_voucher,
      total_price: transaction.total_price,
      customer_id: transaction.customer_id,

      tickets: transaction.tickets.map(th => ({
        id: th.id,
        amount: th.amount,

        ticket: {
          id: th.ticket.id,
          code: th.ticket.code,
          status: th.ticket.status,

          ticket_type: {
            id: th.ticket.ticket_type.id,
            name: th.ticket.ticket_type.name ?? '',

            event: {
              id: th.ticket.ticket_type.event.id,
              name: th.ticket.ticket_type.event.name,
              destination: th.ticket.ticket_type.event.destination ?? undefined,
              organzier: th.ticket.ticket_type.event.organizer ?? undefined,
              eventTime: th.ticket.ticket_type.event.eventTime
            },

            ticketPrice: {
              id: th.ticket.ticket_type.ticketPrice.id,
              price: th.ticket.ticket_type.ticketPrice.price,
              benefit_info: th.ticket.ticket_type.ticketPrice.benefit_info ?? undefined
            }
          }
        }
      })),

      vouchers: transaction.vouchers?.map(tv => ({
        id: tv.id,
        voucher: {
          id: tv.voucher.id,
          reduce_type: tv.voucher.reduce_type as string,
          reduce_price: tv.voucher.reduce_price
        }
      })),

      customer: transaction.customer
        ? {
          id: transaction.customer.id,
          user: {
            id: transaction.customer.user.id,
            username: transaction.customer.user.username,
            email: transaction.customer.user.email,
            name: transaction.customer.user.name ?? undefined
          }
        }
        : undefined
    }));
  }

  async getTransactionById(transactionId: string): Promise<PublicTransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        tickets: {
          include: {
            ticket: {
              include: {
                ticket_type: {
                  include: {
                    event: {
                      select: {
                        id: true,
                        name: true,
                        destination: true,
                        organizer: true,
                        eventTime: true
                      }
                    },
                    ticketPrice: {
                      select: {
                        id: true,
                        price: true,
                        benefit_info: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        vouchers: {
          include: {
            voucher: {
              select: {
                id: true,
                reduce_type: true,
                reduce_price: true
              }
            }
          }
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      id: transaction.id,
      time_date: transaction.time_date,
      method: transaction.method as string,
      status: transaction.status as string,
      price_before_voucher: transaction.price_before_voucher,
      total_price: transaction.total_price,
      customer_id: transaction.customer_id,

      tickets: transaction.tickets.map(th => ({
        id: th.id,
        amount: th.amount,

        ticket: {
          id: th.ticket.id,
          code: th.ticket.code,
          status: th.ticket.status,

          ticket_type: {
            id: th.ticket.ticket_type.id,
            name: th.ticket.ticket_type.name ?? '',

            event: {
              id: th.ticket.ticket_type.event.id,
              name: th.ticket.ticket_type.event.name,
              destination: th.ticket.ticket_type.event.destination ?? undefined,
              organzier: th.ticket.ticket_type.event.organizer ?? undefined,
              eventTime: th.ticket.ticket_type.event.eventTime
            },

            ticketPrice: {
              id: th.ticket.ticket_type.ticketPrice.id,
              price: th.ticket.ticket_type.ticketPrice.price,
              benefit_info: th.ticket.ticket_type.ticketPrice.benefit_info ?? undefined
            }
          }
        }
      })),

      vouchers: transaction.vouchers?.map(tv => ({
        id: tv.id,
        voucher: {
          id: tv.voucher.id,
          reduce_type: tv.voucher.reduce_type as string,
          reduce_price: tv.voucher.reduce_price
        }
      })),

      customer: transaction.customer
        ? {
          id: transaction.customer.id,
          user: {
            id: transaction.customer.user.id,
            username: transaction.customer.user.username,
            email: transaction.customer.user.email,
            name: transaction.customer.user.name ?? undefined
          }
        }
        : undefined
    }
  }
}