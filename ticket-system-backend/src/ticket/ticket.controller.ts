import { Controller, Post, Body, Get, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader, ApiBody } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketTypeDto, CreateTicketPriceDto } from './dto/create-ticket.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { Ticket } from 'generated/prisma';

@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  // @Post('price')
  // @UseGuards(AuthGuard, AdminGuard)
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Create ticket price (Admin only)' })
  // @ApiBearerAuth('JWT-auth')
  // @ApiHeader({
  //   name: "Authorization",
  //   description: "Bearer admin token for authorization",
  //   required: true,
  //   schema: {
  //     type: 'string',
  //     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  //   }
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Ticket\'s price created successfully',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized - Invalid or missing token',
  // })
  // @ApiBody({ type: CreateTicketPriceDto })
  // async createTicketPrice(@Body() createTicketPriceDto: CreateTicketPriceDto) {
  //   return await this.ticketService.createTicketPrice(createTicketPriceDto);
  // }

  // @Post()
  // @UseGuards(AuthGuard, AdminGuard)
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Create ticket (Admin only)' })
  // @ApiBearerAuth('JWT-auth')
  // @ApiHeader({
  //   name: "Authorization",
  //   description: "Bearer admin token for authorization",
  //   required: true,
  //   schema: {
  //     type: 'string',
  //     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  //   }
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Ticket created successfully',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized - Invalid or missing token',
  // })
  // @ApiBody({ type: CreateTicketDto })
  // async create(@Body() createTicketDto: CreateTicketDto) {
  //   return await this.ticketService.createTicket(createTicketDto);
  // }

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all ticket\'s information (For testing - Admin only)' })
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
    status: 201,
    description: 'All tickets retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiOperation({ summary: 'Get all tickets' })
  async findAll(): Promise<Ticket[]> {
    return await this.ticketService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a ticket\'s information by ID (For testing - Admin only)' })
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
    status: 201,
    description: 'Ticket retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiOperation({ summary: 'Get ticket by ID' })
  async findOne(@Param('id') id: string): Promise<Ticket> {
    return await this.ticketService.findOne(id);
  }
}