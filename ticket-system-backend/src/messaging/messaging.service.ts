import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  MessageResponseDto,
  ConversationDto,
  ParticipantDto,
} from './dto/message-response.dto';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  // ─── Conversation helpers ──────────────────────────────────────────────────

  /**
   * Find or create a 1-to-1 conversation between two users.
   * Accepts either the other user's ID or email.
   */
  async getOrCreateConversation(
    requesterId: string,
    otherUserId?: string,
    otherUserEmail?: string,
  ) {
    if (!otherUserId && !otherUserEmail) {
      throw new BadRequestException(
        'Provide either other_user_id or other_user_email',
      );
    }

    // Resolve the target user
    let targetUser: { id: string } | null = null;

    if (otherUserId) {
      targetUser = await this.prisma.user.findUnique({
        where: { id: otherUserId },
        select: { id: true },
      });
    } else {
      targetUser = await this.prisma.user.findUnique({
        where: { email: otherUserEmail },
        select: { id: true },
      });
    }

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    if (targetUser.id === requesterId) {
      throw new BadRequestException(
        'Cannot start a conversation with yourself',
      );
    }

    // Sort IDs so the pair is always stored in the same order
    const sortedIds = [requesterId, targetUser.id].sort();

    // Try to find an existing conversation with exactly these two participants
    const existing = await this.prisma.conversation.findFirst({
      where: {
        participant_ids: {
          equals: sortedIds,
        },
      },
    });

    if (existing) return existing;

    return this.prisma.conversation.create({
      data: {
        participant_ids: sortedIds,
      },
    });
  }

  /** Get a conversation by ID and validate the user is a participant */
  async getConversation(conversationId: string, userId?: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (userId) {
      this.assertParticipant(conversation, userId);
    }

    return conversation;
  }

  assertParticipant(
    conversation: { participant_ids: string[] },
    userId: string,
  ) {
    if (!conversation.participant_ids.includes(userId)) {
      throw new BadRequestException(
        'You are not a participant in this conversation',
      );
    }
  }

  // ─── Messages ─────────────────────────────────────────────────────────────

  async createMessage(
    senderId: string,
    dto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const conversation = await this.getConversation(
      dto.conversation_id,
      senderId,
    );

    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        conversation_id: conversation.id,
        sender_id: senderId,
        read_by: [senderId], // sender has already "read" their own message
      },
      include: {
        sender: {
          select: { id: true, email: true, name: true, avatar: true },
        },
      },
    });

    // Bump conversation updated_at for ordering
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updated_at: new Date() },
    });

    return this.mapMessage(message);
  }

  async getConversationMessages(
    conversationId: string,
    userId: string,
    limit = 50,
    skip = 0,
  ): Promise<MessageResponseDto[]> {
    await this.getConversation(conversationId, userId);

    const messages = await this.prisma.message.findMany({
      where: { conversation_id: conversationId },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip,
      include: {
        sender: {
          select: { id: true, email: true, name: true, avatar: true },
        },
      },
    });

    // Mark all messages not sent by this user as read
    await this.prisma.message.updateMany({
      where: {
        conversation_id: conversationId,
        sender_id: { not: userId },
        NOT: { read_by: { has: userId } }, // MongoDB: field does NOT contain userId
      },
      data: {
        read_by: { push: userId },
      },
    });

    return messages.map(this.mapMessage);
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await this.getConversation(conversationId, userId);

    await this.prisma.message.updateMany({
      where: {
        conversation_id: conversationId,
        sender_id: { not: userId },
        NOT: { read_by: { has: userId } },
      },
      data: {
        read_by: { push: userId },
      },
    });
  }

  /** Count unread messages across ALL conversations for this user */
  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.message.count({
      where: {
        sender_id: { not: userId },
        conversation: {
          participant_ids: { has: userId },
        },
        NOT: {
          read_by: { has: userId },
        },
      },
    });
  }

  async getConversations(userId: string): Promise<ConversationDto[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participant_ids: { has: userId },
      },
      include: {
        messages: {
          orderBy: { created_at: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, email: true, name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    // Gather all unique participant IDs (excluding self)
    const otherIds = [
      ...new Set(
        conversations.flatMap((c) =>
          c.participant_ids.filter((id) => id !== userId),
        ),
      ),
    ];

    const users = await this.prisma.user.findMany({
      where: { id: { in: otherIds } },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    // Unread counts per conversation
    const result: ConversationDto[] = await Promise.all(
      conversations.map(async (conv) => {
        const lastMsg = conv.messages[0];

        const unreadCount = await this.prisma.message.count({
          where: {
            conversation_id: conv.id,
            sender_id: { not: userId },
            NOT: { read_by: { has: userId } },
          },
        });

        const participants: ParticipantDto[] = conv.participant_ids.map(
          (pid) => {
            const u = userMap.get(pid);
            return {
              id: pid,
              email: u?.email ?? '',
              name: u?.name ?? null,
              username: u?.username ?? '',
              avatar: u?.avatar ?? null,
            };
          },
        );

        return {
          id: conv.id,
          participants,
          last_message: lastMsg?.content ?? '',
          last_message_time: lastMsg?.created_at ?? conv.updated_at,
          unread_count: unreadCount,
        };
      }),
    );

    return result;
  }

  async searchMessages(
    userId: string,
    query: string,
    limit = 20,
  ): Promise<MessageResponseDto[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        content: { contains: query, mode: 'insensitive' },
        conversation: {
          participant_ids: { has: userId },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        sender: { select: { id: true, email: true, name: true, avatar: true } },
      },
    });

    return messages.map(this.mapMessage);
  }

  // ─── Mapping ───────────────────────────────────────────────────────────────

  private mapMessage(message: any): MessageResponseDto {
    return {
      id: message.id,
      conversation_id: message.conversation_id,
      content: message.content,
      sender_id: message.sender_id,
      sender_email: message.sender?.email ?? '',
      sender_name: message.sender?.name ?? null,
      sender_avatar: message.sender?.avatar ?? null,
      read_by: message.read_by ?? [],
      created_at: message.created_at,
    };
  }
}
