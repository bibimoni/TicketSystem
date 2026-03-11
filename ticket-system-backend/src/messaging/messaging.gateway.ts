import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { config } from 'src/config/config';
import { JwtService } from '@nestjs/jwt';
import { MessagingService } from './messaging.service';
import { CreateMessageDto } from './dto/create-message.dto';

/**
 * WebSocket namespace: /messaging
 *
 * Auth: connect with  { auth: { token: '<jwt>' } }
 *
 * ── Client → Server events ──────────────────────────────────────────────────
 *  send_message        { conversation_id, content }
 *  join_conversation   { conversation_id, limit?, skip? }
 *  leave_conversation  { conversation_id }
 *  typing              { conversation_id }
 *  stop_typing         { conversation_id }
 *  mark_as_read        { conversation_id }
 *  get_conversations
 *
 * ── Server → Client events ──────────────────────────────────────────────────
 *  receive_message     MessageResponseDto          (to conversation room)
 *  message_sent        MessageResponseDto          (echo to sender)
 *  conversation_data   { conversation_id, messages: MessageResponseDto[] }
 *  conversations_list  { conversations, total_unread }
 *  messages_read       { conversation_id, read_by: userId }
 *  user_typing         { sender_id, conversation_id, is_typing }
 *  user_status         { user_id, is_online, timestamp }
 *  error               { message: string }
 */
@WebSocketGateway({
  namespace: 'messaging',
  cors: { origin: '*' },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessagingGateway.name);

  @WebSocketServer()
  server: Server;

  /** userId → Set of socket IDs (a user can have multiple tabs open) */
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly messagingService: MessagingService,
    private readonly jwtService: JwtService,
  ) {}

  // ─── Connection lifecycle ──────────────────────────────────────────────────

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;

      if (!token) throw new WsException('Missing token');

      const payload = this.jwtService.verify(token, {
        secret: config.load().jwtSecret,
      });
      // JWT payload shape: { id, username, isAdmin } — see auth.service.ts
      const userId: string = payload.id;

      client.data.userId = userId;
      client.data.user = payload;

      // Register socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Each user has a personal room for targeted notifications
      client.join(`user:${userId}`);

      this.logger.log(`User ${userId} connected [${client.id}]`);
      this.broadcastUserStatus(userId, true);
    } catch {
      this.logger.warn('Rejected unauthenticated connection');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId: string | undefined = client.data.userId;
    if (!userId) return;

    const sockets = this.userSockets.get(userId);
    sockets?.delete(client.id);

    if (!sockets || sockets.size === 0) {
      this.userSockets.delete(userId);
      this.broadcastUserStatus(userId, false);
    }

    this.logger.log(`User ${userId} disconnected [${client.id}]`);
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /** Send a message to a conversation */
  @SubscribeMessage('send_message')
  async onSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversation_id?: string; content?: string },
  ) {
    if (!data?.conversation_id || !data?.content?.trim()) {
      throw new WsException('conversation_id and content are required');
    }

    const userId: string = client.data.userId;

    const dto: CreateMessageDto = {
      conversation_id: data.conversation_id,
      content: data.content.trim(),
    };

    const message = await this.messagingService.createMessage(userId, dto);

    const room = `conversation:${data.conversation_id}`;

    // Deliver to everyone in the room (including sender's other tabs)
    this.server.to(room).emit('receive_message', message);

    // Explicit ack to the sending tab
    client.emit('message_sent', message);
  }

  /** Join a conversation room and receive its recent history */
  @SubscribeMessage('join_conversation')
  async onJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { conversation_id?: string; limit?: number; skip?: number },
  ) {
    if (!data?.conversation_id) {
      throw new WsException('conversation_id is required');
    }

    const userId: string = client.data.userId;
    const limit = data.limit ?? 50;
    const skip = data.skip ?? 0;

    // Validates participant access
    await this.messagingService.getConversation(data.conversation_id, userId);

    const room = `conversation:${data.conversation_id}`;
    client.join(room);

    const messages = await this.messagingService.getConversationMessages(
      data.conversation_id,
      userId,
      limit,
      skip,
    );

    client.emit('conversation_data', {
      conversation_id: data.conversation_id,
      messages,
    });
  }

  /** Leave a conversation room (stop receiving real-time updates) */
  @SubscribeMessage('leave_conversation')
  onLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversation_id?: string },
  ) {
    if (!data?.conversation_id) return;

    client.leave(`conversation:${data.conversation_id}`);
  }

  /** Broadcast typing indicator */
  @SubscribeMessage('typing')
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversation_id?: string },
  ) {
    if (!data?.conversation_id) return;

    client.to(`conversation:${data.conversation_id}`).emit('user_typing', {
      sender_id: client.data.userId,
      conversation_id: data.conversation_id,
      is_typing: true,
    });
  }

  /** Broadcast stop-typing indicator */
  @SubscribeMessage('stop_typing')
  onStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversation_id?: string },
  ) {
    if (!data?.conversation_id) return;

    client.to(`conversation:${data.conversation_id}`).emit('user_typing', {
      sender_id: client.data.userId,
      conversation_id: data.conversation_id,
      is_typing: false,
    });
  }

  /** Mark all messages in a conversation as read */
  @SubscribeMessage('mark_as_read')
  async onMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversation_id?: string },
  ) {
    if (!data?.conversation_id)
      throw new WsException('conversation_id required');

    const userId: string = client.data.userId;

    await this.messagingService.markAsRead(data.conversation_id, userId);

    this.server
      .to(`conversation:${data.conversation_id}`)
      .emit('messages_read', {
        conversation_id: data.conversation_id,
        read_by: userId,
      });
  }

  /** Return the conversation list for the connected user */
  @SubscribeMessage('get_conversations')
  async onGetConversations(@ConnectedSocket() client: Socket) {
    const userId: string = client.data.userId;

    const [conversations, total_unread] = await Promise.all([
      this.messagingService.getConversations(userId),
      this.messagingService.getUnreadCount(userId),
    ]);

    client.emit('conversations_list', { conversations, total_unread });
  }

  // ─── Utility (callable from other services) ────────────────────────────────

  /** Push an arbitrary event directly to a user's personal room */
  notifyUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  private broadcastUserStatus(userId: string, isOnline: boolean) {
    this.server.emit('user_status', {
      user_id: userId,
      is_online: isOnline,
      timestamp: new Date(),
    });
  }
}
