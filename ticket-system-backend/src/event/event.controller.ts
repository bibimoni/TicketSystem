import { Controller, Get, Post, Body, Param, Request, UseGuards, HttpStatus, HttpCode, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PublicEventResponseDto } from './dto/public-event-response';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEventCustomerDto } from './dto/create-event-customer.dto';
import { TicketService } from 'src/ticket/ticket.service';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly ticketService: TicketService
  ) { }

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Event create' })
  // @ApiBody({ type: CreateEventDto })
  // @ApiResponse({
  //   description: "Successfully create event",
  //   type: PublicEventResponseDto
  // })
  // @Post()
  // async create(@Body() createEventDto: CreateEventDto): Promise<PublicEventResponseDto> {
  //   return await this.eventService.create(createEventDto);
  // }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Event by Customer' })
  @ApiBearerAuth('JWT-auth')
  @Post('create')
  async createEvent(@Body() createEventCustomerDto: CreateEventCustomerDto, @Request() req: any) {
    const username = req.user.username;
    if (!username) {
      throw new UnauthorizedException()
    }

    const createdEvent = await this.eventService.createEventByCustomer(createEventCustomerDto, username);

    const ticketPrice = await Promise.all(
      createEventCustomerDto.ticketsType.map(async ticketType => {
        const createdTicketPrice = await this.ticketService.createTicketPrice({
          price: ticketType.price,
          name: ticketType.name,
          benefit_info: ticketType.benefit_info
        })

        if (!createdTicketPrice) {
          throw new BadRequestException("Failed to create ticket price")
        }

        const tickets = await Promise.all(
          ticketType.tickets.map(async ticketDto => {
            const createdTicket = await this.ticketService.createTicket(
              ticketDto,
              createdEvent.id,
              createdTicketPrice.id
            )
            if (!createdTicket) {
              throw new BadRequestException("Failed to create ticket")
            }
            return createdTicket;
          })
        )

        if (!tickets) {
          throw new BadRequestException("Failed to create tickets")
        }
        return createdTicketPrice;
      })
    )

    console.log(ticketPrice)
  }

  // Action of admin: view all event
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin Get All Events' })
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: "Authorization",
    description: "Bearer admin token for authorization",
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZThjMTgyOTExNzMzMjFhODZhOGQ0YiIsInVzZXJuYW1lIjoiYWRtaW5zdHJhdG9yIiwiaWF0IjoxNzYwMDg0MzkyLCJleHAiOjE3NjA2ODkxOTJ9.z8apcUkXcIfE8hau2BH3g9UPthe2urQXXF2M-gdBLXg',
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
