import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { StartConversationDto } from './dto/start-conversation.dto';

@ApiTags('messaging')
@ApiBearerAuth('JWT-auth')
@Controller('messaging')
@UseGuards(AuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  // ─── Conversations ─────────────────────────────────────────────────────────

  /**
   * Start or retrieve a conversation with another user.
   * Pass either other_user_id or other_user_email.
   */
  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start or get a conversation with another user' })
  async startConversation(@Req() req: any, @Body() dto: StartConversationDto) {
    const userId: string = req.user.id;

    const conversation = await this.messagingService.getOrCreateConversation(
      userId,
      dto.other_user_id,
      dto.other_user_email,
    );

    return {
      id: conversation.id,
      participant_ids: conversation.participant_ids,
    };
  }

  /**
   * List all conversations for the authenticated user.
   */
  // @Get('conversations')
  // @ApiOperation({ summary: 'Get all conversations of current user' })
  // async getConversations(@Req() req: any) {
  //   const userId: string = req.user.id;

  //   const conversations = await this.messagingService.getConversations(userId);
  //   const total_unread = await this.messagingService.getUnreadCount(userId);

  //   return { conversations, total_unread };
  // }

  // /**
  //  * Get messages in a specific conversation (paginated).
  //  * Also marks incoming messages as read.
  //  */
  // @Get('conversations/:conversationId/messages')
  // @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  // @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiQuery({ name: 'skip', required: false, type: Number })
  // @ApiOperation({ summary: 'Get messages in a conversation' })
  // async getConversationMessages(
  //   @Req() req: any,
  //   @Param('conversationId') conversationId: string,
  //   @Query('limit', new ParseIntPipe({ optional: true })) limit = 50,
  //   @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
  // ): Promise<MessageResponseDto[]> {
  //   const userId: string = req.user.id;

  //   return this.messagingService.getConversationMessages(
  //     conversationId,
  //     userId,
  //     limit,
  //     skip,
  //   );
  // }

  // /**
  //  * Mark all messages in a conversation as read.
  //  */
  // @Patch('conversations/:conversationId/read')
  // @HttpCode(HttpStatus.OK)
  // @ApiParam({ name: 'conversationId' })
  // @ApiOperation({ summary: 'Mark all messages in a conversation as read' })
  // async markAsRead(
  //   @Req() req: any,
  //   @Param('conversationId') conversationId: string,
  // ): Promise<{ success: boolean }> {
  //   const userId: string = req.user.id;

  //   await this.messagingService.markAsRead(conversationId, userId);

  //   return { success: true };
  // }

  // /**
  //  * Send a message via HTTP (alternative to WebSocket).
  //  */
  // @Post('messages')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Send a message (REST fallback)' })
  // async sendMessage(
  //   @Req() req: any,
  //   @Body() createMessageDto: CreateMessageDto,
  // ): Promise<MessageResponseDto> {
  //   const userId: string = req.user.id;

  //   return this.messagingService.createMessage(userId, createMessageDto);
  // }

  // /**
  //  * Get total unread message count for the authenticated user.
  //  */
  // @Get('unread-count')
  // @ApiOperation({
  //   summary: 'Get unread message count across all conversations',
  // })
  // async getUnreadCount(@Req() req: any): Promise<{ count: number }> {
  //   const userId: string = req.user.id;

  //   const count = await this.messagingService.getUnreadCount(userId);

  //   return { count };
  // }

  // /**
  //  * Full-text search across messages the user can see.
  //  */
  // @Get('messages/search')
  // @ApiQuery({ name: 'q', description: 'Search keyword' })
  // @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiOperation({ summary: 'Search messages' })
  // async searchMessages(
  //   @Req() req: any,
  //   @Query('q') query: string,
  //   @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  // ): Promise<MessageResponseDto[]> {
  //   if (!query?.trim()) {
  //     throw new BadRequestException('Search query is required');
  //   }

  //   const userId: string = req.user.id;

  //   return this.messagingService.searchMessages(userId, query, limit);
  // }
}
