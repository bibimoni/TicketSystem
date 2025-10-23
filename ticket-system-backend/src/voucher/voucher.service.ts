import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) { }

  async create(createVoucherDto: CreateVoucherDto) {
    const { reduce_type, reduce_price, amount, price, start_date, end_date } = createVoucherDto;

    const voucher = await this.prisma.voucher.create({
      data: {
        reduce_type,
        reduce_price,
        amount,
        price,
        start_date: start_date,
        end_date: end_date
      }
    });

    if (!voucher) {
      throw new ForbiddenException('Failed to create voucher');
    }

    return voucher;
  }

  async findAll() {
    return await this.prisma.voucher.findMany({
      where: {
        end_date: {
          gte: new Date() // Chỉ lấy voucher còn hạn
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