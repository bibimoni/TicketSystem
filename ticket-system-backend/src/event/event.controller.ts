import { Controller, Get, Post, Body, Request, UseGuards, HttpStatus, HttpCode, UnauthorizedException, BadRequestException, Param, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { PublicEventResponseDto } from './dto/public-event-response';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEventCustomerDto } from './dto/create-event-customer.dto';
import { TicketService } from 'src/ticket/ticket.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreatedEventCustomerResponseDto } from './dto/created-event-customer-response';
import { CreateTicketPriceDto, CreateTicketTypeDto } from 'src/ticket/dto/create-ticket.dto';
import { EventStatusDto } from './dto/event-status.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService, private readonly ticketService: TicketService) { }

  @Get('events-count/:dtoStatus')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get all events count by status - Admin only' })
  @HttpCode(HttpStatus.OK)
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
    description: 'All draft events retrieved',
  })
  async getAllEventsCount(@Param(ValidationPipe) dtoStatus: EventStatusDto): Promise<number> {
    return this.eventService.getEventsCount(dtoStatus.status);
  }

  @Get('all/:dtoStatus')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get all events by status - Admin only' })
  @HttpCode(HttpStatus.OK)
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
    description: 'All events retrieved',
  })
  async findAllEvents(@Param(ValidationPipe) dtoStatus: EventStatusDto) {
    return await this.eventService.findAllEvents(dtoStatus.status);
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
      ticketTypeId: string;
      name: string,
      amount: number;
      remaining?: number;
      ticketPrice: { id: string; name?: string | null; price: number; benefit_info?: string | null };
    }[] = [];

    if (Array.isArray(createEventCustomerDto.ticketsPrice) && createEventCustomerDto.ticketsPrice.length > 0) {
      for (const tp of createEventCustomerDto.ticketsPrice) {
        const createTicketPriceDto: CreateTicketPriceDto = {
          price: tp.price,
          benefit_info: tp.benefit_info ?? '',
          ticketTypes: tp.ticketTypes ?? []
        };
        const createdTicketPrice = await this.ticketService.createTicketPrice(createTicketPriceDto);

        if (!createdTicketPrice) {
          throw new BadRequestException("Failed to create ticket price");
        }

        if (Array.isArray(tp.ticketTypes) && tp.ticketTypes.length > 0) {
          for (const tt of tp.ticketTypes) {
            const createTicketTypeDto: CreateTicketTypeDto = {
              name: tt.name ?? null,
              amount: tt.amount ?? 0
            };

            const createdTicketType = await this.ticketService.createTicketType(createTicketTypeDto, createdEvent.id, createdTicketPrice.id);

            if (!createdTicketType) {
              throw new BadRequestException("Failed to create ticket type");
            }

            aggregatedTickets.push({
              ticketTypeId: createdTicketType.id,
              name: createTicketTypeDto.name,
              amount: createdTicketType.amount,
              remaining: createdTicketType.remaining ?? createdTicketType.amount,
              ticketPrice: {
                id: createdTicketPrice.id,
                name: createdTicketType.name ?? null,
                price: createdTicketPrice.price,
                benefit_info: createdTicketPrice.benefit_info
              }
            });
          }
        }
      }
    }

    return {
      id: createdEvent.id,
      name: createdEvent.name,
      information: createdEvent.information ?? null,
      destination: createdEvent.destination ?? null,
      organizer: createdEvent.organizer ?? null,
      ticketTypes: aggregatedTickets.map(t => ({
        id: t.ticketTypeId,
        name: t.name,
        amount: t.amount,
        status: 'AVAILABLE',
        ticketPrice: t.ticketPrice
      })),
      vouchers: createdEvent.vouchers ?? []
    };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customer Get All Events' })
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
