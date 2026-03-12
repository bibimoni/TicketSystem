export class MessageResponseDto {
  id: string;
  conversation_id: string;
  content: string;
  sender_id: string;
  /** Email of the sender – convenient for the client */
  sender_email: string;
  sender_name: string | null;
  sender_avatar: string | null;
  /** IDs of users who have read this message */
  read_by: string[];
  created_at: Date;
}

export class ParticipantDto {
  id: string;
  email: string;
  name: string | null;
  username: string;
  avatar: string | null;
}

export class ConversationDto {
  id: string;
  participants: ParticipantDto[];
  last_message: string;
  last_message_time: Date;
  /** Number of messages in this conversation NOT yet read by the requesting user */
  unread_count: number;
}
