import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { StripeService } from "src/stripe/stripe.service";
import { CheckoutIntentDto } from "./dto/create-transaction.dto";
import { PublicTransactionResponseDto } from "./dto/public-transaction.dto";
import { transaction_status } from "generated/prisma";
import { CancelPendingTransactionDto } from "./dto/cancel-pending.dto";

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

            price: th.ticket.ticket_type.price,
            benefit_info: th.ticket.ticket_type.benefit_info ?? undefined
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

            price: th.ticket.ticket_type.price,
            benefit_info: th.ticket.ticket_type.benefit_info ?? undefined
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

  async getTotalRevenue(): Promise<number> {
    const pipe = await this.prisma.transaction.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { total_price: true },
    });

    return pipe._sum.total_price ?? 0
  }

  async eventOrganizerGetTransactions(
    eventOrganizerId: string,
  ): Promise<PublicTransactionResponseDto[]> {
    const organizerCustomer = await this.prisma.customer.findUnique({
      where: { user_id: eventOrganizerId },
    });

    if (!organizerCustomer) {
      console.log(
        `No Customer found for user_id=${eventOrganizerId} (organizer)`,
      );
      return [];
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        tickets: {
          some: {
            ticket: {
              ticket_type: {
                event: {
                  customer_id: organizerCustomer.id,
                },
              },
            },
          },
        },
        status: transaction_status.SUCCESS,
      },
      include: {
        tickets: {
          include: {
            ticket: {
              include: {
                ticket_type: {
                  include: {
                    event: true,
                  },
                },
              },
            },
          },
        },
        vouchers: {
          include: {
            voucher: true,
          },
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { time_date: 'desc' },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      time_date: transaction.time_date,
      method: transaction.method as string,
      status: transaction.status as string,
      price_before_voucher: transaction.price_before_voucher,
      total_price: transaction.total_price,
      customer_id: transaction.customer_id,

      tickets: transaction.tickets.map((th) => ({
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
              destination:
                th.ticket.ticket_type.event.destination ?? undefined,
              organizer:
                th.ticket.ticket_type.event.organizer ?? undefined,
              eventTime: th.ticket.ticket_type.event.eventTime,
            },

            price: th.ticket.ticket_type.price,
            benefit_info: th.ticket.ticket_type.benefit_info ?? undefined,
          },
        },
      })),

      vouchers: transaction.vouchers?.map((tv) => ({
        id: tv.id,
        voucher: {
          id: tv.voucher.id,
          reduce_type: tv.voucher.reduce_type as string,
          reduce_price: tv.voucher.reduce_price,
        },
      })),

      customer: transaction.customer
        ? {
          id: transaction.customer.id,
          user: {
            id: transaction.customer.user.id,
            username: transaction.customer.user.username,
            email: transaction.customer.user.email,
            name: transaction.customer.user.name ?? undefined,
          },
        }
        : undefined,
    }));
  }

  async cancelPendingByCustomer(customerId: string, dto: CancelPendingTransactionDto) {
    const { transactionId, ticketTypeIds } = dto;

    const countMap: Record<string, number> = {};
    if (ticketTypeIds?.length) {
      for (const id of ticketTypeIds) countMap[id] = (countMap[id] ?? 0) + 1;
    }
    const uniqueTypeIds = Object.keys(countMap);

    return this.prisma.$transaction(async (tx) => {
      const whereTrx: any = {
        customer_id: customerId,
        status: 'PENDING',
      };
      if (transactionId) whereTrx.id = transactionId;

      const pending = await tx.transaction.findMany({
        where: whereTrx,
        select: { id: true },
      });

      if (pending.length === 0) {
        return { deletedTransactions: 0, restoredRemaining: 0 };
      }

      const trxIds = pending.map(t => t.id);

      await tx.transactionApplyVoucher.deleteMany({
        where: { transaction_id: { in: trxIds } },
      });

      await tx.transactionHasTicket.deleteMany({
        where: { transaction_id: { in: trxIds } },
      });

      let restoredRemaining = 0;
      if (uniqueTypeIds.length > 0) {
        for (const typeId of uniqueTypeIds) {
          const qty = countMap[typeId];
          await tx.ticketType.update({
            where: { id: typeId },
            data: { remaining: { increment: qty } },
          });
          restoredRemaining += qty;
        }
      }

      const del = await tx.transaction.deleteMany({
        where: { id: { in: trxIds } },
      });

      return {
        deletedTransactions: del.count,
        restoredRemaining,
      };
    });
  }
}

