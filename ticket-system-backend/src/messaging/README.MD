# Messaging WebSocket — Ticket System

Documentation for the realtime messaging module in the Ticket System, covering architecture, event flow, and how to run the terminal chat tool.

---

## 📁 File Structure

```
messaging/
├── messaging.gateway.ts       # WebSocket server — handles connections & realtime events
├── messaging.service.ts       # Business logic — database queries & updates
├── messaging.controller.ts    # REST API — create conversations, fetch history
├── messaging.module.ts        # NestJS module — declares providers and dependencies
├── messaging.client.ts        # WebSocket client helper (for frontend or other services)
└── dto/
    ├── create-message.dto.ts
    ├── message-response.dto.ts
    └── start-conversation.dto.ts

chat.ts                        # Terminal chat tool for realtime testing & debugging
```

---

## Event Flow

### 1. Create a Conversation (REST API)

Before chatting, a conversation between two users must be created via HTTP:

```
Client A  ──POST /messaging/conversations──►  Server
                                               └─ Find or create conversation
                                               └─ Return { id, participant_ids }
```

### 2. Connect via WebSocket

Each user connects to the `/messaging` namespace with a JWT token:

```
Client  ──connect (auth: { token: JWT })──►  Gateway
                                              └─ Verify JWT
                                              └─ Join personal room "user:<userId>"
                                              └─ Broadcast user_status: online
```

### 3. Join a Conversation Room

After connecting, the client joins a conversation room to receive realtime messages:

```
Client  ──join_conversation──►  Gateway
                                 └─ Validate user is a participant
                                 └─ Join room "conversation:<id>"
                                 └─ Return message history (conversation_data)
```

### 4. Send & Receive Messages

```
User A  ──send_message──►  Gateway  ──receive_message──►  User B (and other tabs of A)
                            └─ Save to database            └─ message_sent (echo to sender)
```

### 5. Supporting Events

| Event                    | Direction                | Description                     |
| ------------------------ | ------------------------ | ------------------------------- |
| `typing` / `stop_typing` | Client → Server → Room   | Show typing indicator           |
| `mark_as_read`           | Client → Server → Room   | Mark messages as read           |
| `get_conversations`      | Client → Server → Client | Fetch conversation list         |
| `user_status`            | Server → All             | Broadcast online/offline status |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Ticket System backend is running
- Two user accounts and a conversation between them already exist

### Step 1 — Install dependencies

```bash
npm install socket.io-client
```

### Step 2 — Get JWT Tokens

Log in via the REST API to obtain a token for each user:

```bash
# User A
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "userA@example.com", "password": "password" }'

# User B
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "userB@example.com", "password": "password" }'
```

### Step 3 — Create a Conversation (if not yet created)

```bash
curl -X POST http://localhost:3001/messaging/conversations \
  -H "Authorization: Bearer <TOKEN_USER_A>" \
  -H "Content-Type: application/json" \
  -d '{ "other_user_email": "userB@example.com" }'

# Response:
# { "id": "69b0fba88bef65954206ebcc", "participant_ids": [...] }
```

### Step 4 — Run the terminal chat

Open **2 separate terminals**, each with a different token and display name but the same `CONVERSATION_ID`:

```bash
# Terminal 1 — User A
node chat.ts <TOKEN_USER_A> <CONVERSATION_ID> Alice

# Terminal 2 — User B
node chat.ts <TOKEN_USER_B> <CONVERSATION_ID> Bob
```

**Example:**

```bash
# Terminal 1
node chat.ts eyJhbGciOiJIUzI1NiJ9... 69b0fba88bef65954206ebcc Alice

# Terminal 2
node chat.ts eyJhbGciOiJIUzI1NiJ9... 69b0fba88bef65954206ebcc Bob
```

---

## ⚙️ Configuration

By default, `chat.ts` connects to `http://localhost:3001`. To use a different server, set the environment variable:

```bash
# Use a public server
SERVER_URL=https://your-server.com node chat.ts <TOKEN> <CONV_ID> <NAME>

# Or export first
export SERVER_URL=https://your-server.com
node chat.ts <TOKEN> <CONV_ID> <NAME>
```

---

## Terminal UI

When running successfully, the interface looks like this:

```
╔══════════════════════════════════════════╗
║         💬 TICKET SYSTEM CHAT           ║
╚══════════════════════════════════════════╝
  Conversation: 69b0fba88bef65954206ebcc
  You are: Alice
────────────────────────────────────────────
  Type a message and press Enter to send. Ctrl+C to exit.
────────────────────────────────────────────
  ⚡ Connected successfully!
  📜 5 most recent messages:
  ────────────────────────────────────────
  [12/03/2026 09:00:01] [Bob] Hello!
  [12/03/2026 09:00:05] [Alice] Hey Bob!
  ────────────────────────────────────────

Alice >
```

**Features:**

- 📜 Displays the 20 most recent messages, newest first
- 💬 Realtime chat between two users
- ✍️ Shows "Other user is typing..." indicator
- ✓✓ Read receipt notification
- 🟢🔴 Online / offline status
- 🕐 Full timestamp on every message `[dd/mm/yyyy hh:mm:ss]`

---

## 🛠️ Chat Commands

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `/help`            | Show available commands           |
| `/clear`           | Clear the screen, keep the header |
| `/quit` or `/exit` | Exit the chat                     |
| `Ctrl+C`           | Exit and disconnect               |
