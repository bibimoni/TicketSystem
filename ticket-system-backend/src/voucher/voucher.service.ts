import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Voucher } from 'generated/prisma';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) { }

  async create(createVoucherDto: CreateVoucherDto, eventId: string): Promise<Voucher> {
    const { code, reduce_type, reduce_price, price, start_date, end_date } = createVoucherDto;

    let createdVoucher: Voucher | null = null;
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const data: any = {
        code,
        reduce_type,
        reduce_price,
        price,
        start_date,
        end_date
      };

      if (eventId) {
        data.event = { connect: { id: eventId } };
      }

      try {
        createdVoucher = await this.prisma.voucher.create({ data });
        break;
      } catch (err: any) {
        const isUniqueError = err?.code === 'P2002' || (err?.message && err.message.includes('duplicate key'));
        if (!isUniqueError) {
          throw err;
        }
      }
    }

    if (!createdVoucher) {
      throw new ForbiddenException('Failed to create voucher');
    }

    return createdVoucher;
  }

  async update(updateVoucherDto: UpdateVoucherDto, eventId: string): Promise<Voucher> {
    const { id, ...rest } = updateVoucherDto;
    return await this.prisma.voucher.update({
      where: {
        id,
        event_id: eventId,
      },
      data: rest
    })
  }

  async findAll() {
    return await this.prisma.voucher.findMany({
      where: {
        end_date: {
          gte: new Date()
        }
      },
      orderBy: {
        start_date: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id }
    });

    if (!voucher) {
      throw new ForbiddenException('Voucher not found');
    }

    return voucher;
  }

  async remove(id: string) {
    await this.prisma.voucher.delete({
      where: { id }
    });

    return { message: 'Voucher deleted successfully' };
  }
}