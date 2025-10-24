import { Controller, Get, Post, Body, Param, Request, UseGuards, HttpStatus, HttpCode, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { EventService } from './event.service';
import { PublicEventResponseDto } from './dto/public-event-response';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEventCustomerDto } from './dto/create-event-customer.dto';
import { TicketService } from 'src/ticket/ticket.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreatedEventCustomerResponseDto } from './dto/created-event-customer-response';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService, private readonly ticketService: TicketService) { }

  @Get('/all')
  @ApiOperation({ summary: 'Get all events' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'All events retrieved',
  })
  async findAllEvents() {
    return await this.eventService.findAllEvents();
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
      id: string;
      seat: string;
      status: string;
      ticketPrice: {
        id: string;
        name: string | null;
        price: number;
        benefit_info: string | null;
      };
    }[] = [];

    await Promise.all(
      createEventCustomerDto.ticketsType.map(async ticketType => {
        const createdTicketPrice = await this.ticketService.createTicketPrice({
          name: ticketType.name,
          price: ticketType.price,
          benefit_info: ticketType.benefit_info
        });

        if (!createdTicketPrice) {
          throw new BadRequestException("Failed to create ticket price");
        }

        const tickets = await Promise.all(
          ticketType.tickets.map(async ticketDto => {
            const createdTicket = await this.ticketService.createTicket(
              ticketDto,
              createdEvent.id,
              createdTicketPrice.id
            );
            if (!createdTicket) {
              throw new BadRequestException("Failed to create ticket");
            }

            aggregatedTickets.push({
              id: createdTicket.id,
              seat: createdTicket.seat ?? '',
              status: createdTicket.status,
              ticketPrice: {
                id: createdTicketPrice.id,
                name: createdTicketPrice.name,
                price: createdTicketPrice.price,
                benefit_info: createdTicketPrice.benefit_info
              }
            });

            return createdTicket;
          })
        );

        if (!tickets) {
          throw new BadRequestException("Failed to create tickets");
        }

        return createdTicketPrice;
      })
    );

    return {
      id: createdEvent.id,
      name: createdEvent.name,
      information: createdEvent.information ?? null,
      destination: createdEvent.destination ?? null,
      organizer: createdEvent.organizer ?? null,
      tickets: aggregatedTickets
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

  // Action of admin: view all event
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin Get All Events' })
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
    description: "Successfully get all events",
    type: PublicEventResponseDto
  })
  @Get('all_event')
  findAll(@Request() req) {
    return this.eventService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eventService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventService.remove(+id);
  // }
}
