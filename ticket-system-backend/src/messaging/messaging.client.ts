import { io, Socket } from 'socket.io-client';

export class MessagingClient {
  private socket: Socket | null = null;

  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  // ─── Connection ───────────────────────────────────────────────────────────

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(`${this.url}/messaging`, {
        auth: { token: this.token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.socket.once('connect', () => {
        console.log('✓ Connected to messaging server');
        resolve();
      });

      this.socket.once('connect_error', (err) => {
        console.error('❌ Connection error:', err.message);
        reject(err);
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('⚠ Disconnected:', reason);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // ─── Emitters ─────────────────────────────────────────────────────────────

  /** Send a chat message */
  sendMessage(conversationId: string, content: string): void {
    this.emit('send_message', { conversation_id: conversationId, content });
  }

  /**
   * Join a conversation room.
   * The server will reply with a `conversation_data` event containing history.
   */
  joinConversation(conversationId: string, limit = 50, skip = 0): void {
    this.emit('join_conversation', {
      conversation_id: conversationId,
      limit,
      skip,
    });
  }

  /** Leave a conversation room (stop receiving real-time updates for it) */
  leaveConversation(conversationId: string): void {
    this.emit('leave_conversation', { conversation_id: conversationId });
  }

  /** Notify typing start */
  startTyping(conversationId: string): void {
    this.emit('typing', { conversation_id: conversationId });
  }

  /** Notify typing stop */
  stopTyping(conversationId: string): void {
    this.emit('stop_typing', { conversation_id: conversationId });
  }

  /** Mark all messages in a conversation as read */
  markAsRead(conversationId: string): void {
    this.emit('mark_as_read', { conversation_id: conversationId });
  }

  /** Request the conversation list */
  getConversations(): void {
    this.emit('get_conversations');
  }

  // ─── Listeners ────────────────────────────────────────────────────────────

  /** Incoming message from another user */
  onMessage(cb: (msg: any) => void): void {
    this.socket?.on('receive_message', cb);
  }

  /** Echo after your own message was delivered */
  onMessageSent(cb: (msg: any) => void): void {
    this.socket?.on('message_sent', cb);
  }

  /** Receive conversation history after joinConversation() */
  onConversationData(
    cb: (data: { conversation_id: string; messages: any[] }) => void,
  ): void {
    this.socket?.on('conversation_data', cb);
  }

  /** Receive full conversation list */
  onConversationsList(
    cb: (data: { conversations: any[]; total_unread: number }) => void,
  ): void {
    this.socket?.on('conversations_list', cb);
  }

  /** Another user read the messages */
  onMessagesRead(
    cb: (data: { conversation_id: string; read_by: string }) => void,
  ): void {
    this.socket?.on('messages_read', cb);
  }

  /** Typing indicator from other user */
  onTyping(
    cb: (data: {
      sender_id: string;
      conversation_id: string;
      is_typing: boolean;
    }) => void,
  ): void {
    this.socket?.on('user_typing', cb);
  }

  /** Online / offline status of any user */
  onUserStatus(
    cb: (data: {
      user_id: string;
      is_online: boolean;
      timestamp: string;
    }) => void,
  ): void {
    this.socket?.on('user_status', cb);
  }

  // Generic event helpers
  on(event: string, cb: (data: any) => void): void {
    this.socket?.on(event, cb);
  }

  off(event: string): void {
    this.socket?.off(event);
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private emit(event: string, data?: unknown): void {
    if (!this.socket?.connected) {
      console.warn(`[MessagingClient] Cannot emit '${event}' – not connected`);
      return;
    }
    this.socket.emit(event, data);
  }
}
