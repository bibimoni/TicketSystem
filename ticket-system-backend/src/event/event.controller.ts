import { Controller, Get, Post, Body, Request, UseGuards, HttpStatus, HttpCode, UnauthorizedException, BadRequestException, Param, ValidationPipe, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEventCustomerDto } from './dto/create-event-customer.dto';
import { TicketService } from 'src/ticket/ticket.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreatedEventCustomerResponseDto } from './dto/created-event-customer-response';
import { CreateTicketTypeDto } from 'src/ticket/dto/create-ticket.dto';
import { EventStatusDto } from './dto/event-status.dto';
import { event_status, Voucher } from 'generated/prisma';
import { UpdateEventDto } from './dto/update-event-info.dto';
import { VoucherService } from 'src/voucher/voucher.service';
import { UpdateVoucherDto } from 'src/voucher/dto/update-voucher.dto';
import { CreateVoucherDto } from 'src/voucher/dto/create-voucher.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService, private readonly ticketService: TicketService, private readonly voucherService: VoucherService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Public get all events' })
  @Get('all_events')
  async publicGetEvents() {
    return await this.eventService.findAll();
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Event by Customer' })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateEventCustomerDto })
  async createEvent(@Body() createEventCustomerDto: CreateEventCustomerDto, @Request() req: any): Promise<CreatedEventCustomerResponseDto> {
    const username = req.user.username;
    if (!username) {
      throw new UnauthorizedException()
    }

    const createdEvent = await this.eventService.createEventByCustomer(createEventCustomerDto, username);

    const aggregatedTickets: {
      ticketTypeId: string,
      name: string,
      amount: number;
      remaining?: number;
      price: number;
      benefit_info?: string | null;
    }[] = [];

    if (Array.isArray(createEventCustomerDto.ticketTypes) && createEventCustomerDto.ticketTypes.length > 0) {
      for (const tt of createEventCustomerDto.ticketTypes) {
        const createTicketTypeDto: CreateTicketTypeDto = {
          name: tt.name,
          amount: tt.amount ?? 0,
          price: tt.price,
          benefit_info: tt.benefit_info
        };

        const createdTicketType = await this.ticketService.createTicketType(createTicketTypeDto, createdEvent.id);

        if (!createdTicketType) {
          throw new BadRequestException("Failed to create ticket type");
        }

        aggregatedTickets.push({
          ticketTypeId: createdTicketType.id,
          name: createdTicketType.name,
          amount: createdTicketType.amount,
          remaining: createdTicketType.remaining ?? createdTicketType.amount,
          price: createdTicketType.price ?? 0,
          benefit_info: createdTicketType.benefit_info
        });
      }
    }

    return {
      id: createdEvent.id,
      name: createdEvent.name,
      information: createdEvent.information ?? null,
      destination: createdEvent.destination ?? null,
      organizer: createdEvent.organizer ?? null,
      format: createdEvent.format,
      status: 'DRAFT',
      ticketTypes: aggregatedTickets.map(t => ({
        id: t.ticketTypeId,
        name: t.name,
        amount: t.amount,
        status: 'AVAILABLE',
        price: t.price ?? 0,
        benefit_info: t.benefit_info
      })),
      vouchers: createdEvent.vouchers ?? []
    };
  }

  @Post('update')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update Event by Customer' })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: UpdateEventDto })
  async update(@Body() updateEventInfo: UpdateEventDto, @Request() req: any) {
    const username = req.user.username;
    if (!username) {
      throw new UnauthorizedException()
    }

    const user_id = await this.eventService.findEventById(updateEventInfo.id);

    if (user_id !== req.user.id) {
      throw new BadRequestException();
    }

    return await this.eventService.updateEventInfo(updateEventInfo.id, updateEventInfo);
  };

  @Post('create-vouchers/:eventId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Voucher event by Customer' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'eventId', required: true })
  @ApiBody({ type: CreateVoucherDto })
  async craeteVouchers(
    @Body() createVoucherDto: CreateVoucherDto,
    @Param('eventId') eventId: string,
    @Request() req: any
  ): Promise<Voucher> {
    const username = req.user.username;
    if (!username) {
      throw new UnauthorizedException()
    }

    const user_id = await this.eventService.findEventById(eventId);

    if (user_id !== req.user.id) {
      throw new BadRequestException();
    }

    return await this.voucherService.create(createVoucherDto, eventId);
  }

  @Post('update-vouchers/:eventId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update Voucher event by Customer' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'eventId', required: true })
  @ApiBody({ type: UpdateVoucherDto })
  async updateVouchers(
    @Body() updateVoucherDto: UpdateVoucherDto,
    @Param('eventId') eventId: string,
    @Request() req: any
  ): Promise<Voucher> {
    const username = req.user.username;
    if (!username) {
      throw new UnauthorizedException()
    }

    const user_id = await this.eventService.findEventById(eventId);

    if (user_id !== req.user.id) {
      throw new BadRequestException();
    }

    return await this.voucherService.update(updateVoucherDto, eventId);
  }

  @Get('events-count/:status')
  @ApiOperation({ summary: 'Get all events count by status' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'status',
    enum: event_status,
    description: 'Filter events by status [DRAFT, PUBLISHED, CANCELLED, COMPLETED]',
    example: 'DRAFT'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 200,
    description: 'All events count retrieved',
  })
  async getAllEventsCount(@Param(ValidationPipe) status: EventStatusDto): Promise<number> {
    return this.eventService.getEventsCount(status.status);
  }

  @Get('all/:status')
  @ApiOperation({ summary: 'Get all events by status' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'status',
    enum: event_status,
    description: 'Filter events by status [DRAFT, PUBLISHED, CANCELLED, COMPLETED]',
    example: 'DRAFT'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 200,
    description: 'All events retrieved',
  })
  async findAllEvents(@Param(ValidationPipe) status: EventStatusDto) {
    return await this.eventService.findAllByStatus(status.status);
  }

  @Get('set-status/:eventId/:status')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Admin sets event status' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'eventId',
    description: 'Event ID',
    example: '68e4e22c9815978759f58203'
  })
  @ApiParam({
    name: 'status',
    schema: {
      type: 'string',
      example: 'PUBLISHED'
    },
    description: 'Filter events by status [DRAFT, PUBLISHED, CANCELLED, COMPLETED]',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer admin token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 200,
    description: 'Event has been set to PUBLISHED by Admin',
  })
  async updateEventStatus(
    @Param('eventId', new ValidationPipe({ transform: true }))
    eventId: string,
    @Param('status') status: string,
    @Request() req: any
  ) {
    const adminId = req.admin.id;
    return await this.eventService.updateEventStatus(eventId, status, adminId);
  }



  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customers get all events created by them' })
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer customer token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
  })
  @Get('customer_events')
  async findAllByCustomer(@Request() req: any) {
    const username = req.user.username;
    if (!username) {
      throw new UnauthorizedException()
    }
    return await this.eventService.findAllEvents(username);
  }
}
