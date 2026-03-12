/*
 * Chat realtime on terminal
 *
 * Instructions:
 *   npm install socket.io-client readline
 *   node chat.ts <JWT_TOKEN> <CONVERSATION_ID> <TÊN_HIỂN_THỊ>
 *
 * Examples:
 *   node chat.ts eyJhbGc... 69b0fba8... Alice
 *   node chat.ts eyJhbGc... 69b0fba8... Alex
 *
 * Open 2 terminals, each running with a different token and display name, but same conversation ID to chat with each other.
 * Note: Conversation ID must be created beforehand (e.g. via API or database) and both users must be participants of that conversation.
 */

import { io } from 'socket.io-client';
import readline from 'readline';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost:3001';
// ─────────────────────────────────────────────────────────────────────────────

const [, , TOKEN, CONVERSATION_ID, DISPLAY_NAME] = process.argv;

if (!TOKEN || !CONVERSATION_ID || !DISPLAY_NAME) {
  console.error('❌ Thiếu tham số!');
  console.error(
    '   Cách dùng: node chat.js <JWT_TOKEN> <CONVERSATION_ID> <TÊN>',
  );
  console.error('   Ví dụ:     node chat.js eyJhbGc... 69b0fba8... Alice');
  process.exit(1);
}

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bgBlue: '\x1b[44m',
};

function colorize(color, text) {
  return `${color}${text}${C.reset}`;
}

function timestamp() {
  const now = new Date();
  const date = now.toLocaleDateString('vi-VN'); // dd/mm/yyyy
  const time = now.toLocaleTimeString('vi-VN'); // hh:mm:ss
  return colorize(C.gray, `[${date} ${time}]`);
}

function formatDateTime(dateInput: string | Date) {
  const d = new Date(dateInput);
  const date = d.toLocaleDateString('vi-VN');
  const time = d.toLocaleTimeString('vi-VN');
  return colorize(C.gray, `[${date} ${time}]`);
}

function clearLine() {
  process.stdout.write('\r\x1b[K');
}

// ─── UI ──────────────────────────────────────────────────────────────────────
function printHeader() {
  console.clear();
  console.log(
    colorize(C.bold + C.cyan, '╔══════════════════════════════════════════╗'),
  );
  console.log(
    colorize(C.bold + C.cyan, '║         💬 TICKET SYSTEM CHAT           ║'),
  );
  console.log(
    colorize(C.bold + C.cyan, '╚══════════════════════════════════════════╝'),
  );
  console.log(colorize(C.dim, `  Conversation: ${CONVERSATION_ID}`));
  console.log(
    colorize(C.dim, `  Bạn là: ${colorize(C.bold + C.green, DISPLAY_NAME)}`),
  );
  console.log(colorize(C.gray, '─'.repeat(44)));
  console.log(
    colorize(C.dim, '  Gõ tin nhắn và Enter để gửi. Ctrl+C để thoát.'),
  );
  console.log(colorize(C.gray, '─'.repeat(44)));
}

function printMessage(sender, content, isSelf) {
  clearLine();
  const time = timestamp();
  if (isSelf) {
    const label = colorize(C.bold + C.green, `[Bạn - ${sender}]`);
    console.log(`${time} ${label} ${content}`);
  } else {
    const label = colorize(C.bold + C.blue, `[${sender}]`);
    console.log(`${time} ${label} ${colorize(C.cyan, content)}`);
  }
  rl.prompt(true);
}

function printSystem(msg) {
  clearLine();
  console.log(colorize(C.yellow, `  ⚡ ${msg}`));
  rl.prompt(true);
}

function printError(msg) {
  clearLine();
  console.log(colorize(C.red, `  ❌ ${msg}`));
  rl.prompt(true);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colorize(C.bold + C.green, `${DISPLAY_NAME} > `),
});

printHeader();
console.log(colorize(C.yellow, '  ⏳ Đang kết nối...'));

const socket = io(`${SERVER_URL}/messaging`, {
  auth: { token: TOKEN },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

let typingTimer = null;
let isTyping = false;
let otherTyping = false;
let myEmail: string | null = null;

socket.on('connect', () => {
  printSystem(`Kết nối thành công! (${socket.id})`);

  socket.emit('join_conversation', {
    conversation_id: CONVERSATION_ID,
    limit: 20,
    skip: 0,
  });

  rl.prompt();
});

socket.on('connect_error', (err) => {
  printError(`Không thể kết nối: ${err.message}`);
});

socket.on('disconnect', (reason) => {
  printSystem(`Mất kết nối: ${reason}. Đang thử lại...`);
});

socket.on('reconnect', () => {
  printSystem('Đã kết nối lại!');
  socket.emit('join_conversation', { conversation_id: CONVERSATION_ID });
});

socket.on('conversation_data', (data) => {
  if (data.messages.length === 0) {
    printSystem('Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!');
    return;
  }

  clearLine();
  console.log(
    colorize(C.dim, `  📜 ${data.messages.length} tin nhắn gần nhất:`),
  );
  console.log(colorize(C.gray, '  ' + '─'.repeat(40)));

  data.messages.forEach((msg) => {
    const isSelf =
      msg.sender_email === undefined ? false : msg.sender_name === DISPLAY_NAME;
    const time = formatDateTime(msg.created_at);
    const name = msg.sender_name || msg.sender_email;
    const isMine =
      msg.sender_name === DISPLAY_NAME || msg.content.startsWith('[Bạn');

    if (isMine) {
      console.log(
        `  ${time} ${colorize(C.bold + C.green, `[${name}]`)} ${msg.content}`,
      );
    } else {
      console.log(
        `  ${time} ${colorize(C.bold + C.blue, `[${name}]`)} ${colorize(C.cyan, msg.content)}`,
      );
    }
  });

  console.log(colorize(C.gray, '  ' + '─'.repeat(40)));
  rl.prompt(true);
});

socket.on('receive_message', (msg) => {
  const isSelf = msg.sender_email === myEmail;
  if (isSelf) return;

  const name = msg.sender_name || msg.sender_email;
  printMessage(name, msg.content, false);

  socket.emit('mark_as_read', { conversation_id: CONVERSATION_ID });
});

socket.on('message_sent', (msg) => {
  if (!myEmail) myEmail = msg.sender_email;
});

socket.on('user_typing', (data) => {
  if (data.is_typing) {
    clearLine();
    process.stdout.write(colorize(C.dim, `  ✍️  Đối phương đang gõ...`));
    otherTyping = true;
  } else {
    if (otherTyping) {
      clearLine();
      otherTyping = false;
      rl.prompt(true);
    }
  }
});

socket.on('user_status', (data) => {
  const status = data.is_online
    ? colorize(C.green, 'online 🟢')
    : colorize(C.gray, 'offline 🔴');
  printSystem(`User ${data.user_id} ${status}`);
});

socket.on('messages_read', (data) => {
  clearLine();
  process.stdout.write(colorize(C.dim, '  ✓✓ Đã xem'));
  setTimeout(() => {
    clearLine();
    rl.prompt(true);
  }, 1500);
});

socket.on('error', (err) => {
  printError(`Lỗi: ${JSON.stringify(err)}`);
});

rl.on('line', (line) => {
  const content = line.trim();

  if (!content) {
    rl.prompt();
    return;
  }

  if (content === '/quit' || content === '/exit') {
    console.log(colorize(C.yellow, '  👋 Tạm biệt!'));
    socket.disconnect();
    process.exit(0);
  }
  if (content === '/clear') {
    printHeader();
    rl.prompt();
    return;
  }
  if (content === '/help') {
    console.log(colorize(C.dim, '  Lệnh: /quit | /exit | /clear | /help'));
    rl.prompt();
    return;
  }
  if (!socket.connected) {
    printError('Chưa kết nối server!');
    rl.prompt();
    return;
  }
  socket.emit('send_message', {
    conversation_id: CONVERSATION_ID,
    content,
  });

  const time = timestamp();
  clearLine();
  console.log(
    `${time} ${colorize(C.bold + C.green, `[Bạn - ${DISPLAY_NAME}]`)} ${content}`,
  );

  if (isTyping) {
    socket.emit('stop_typing', { conversation_id: CONVERSATION_ID });
    isTyping = false;
  }
  clearTimeout(typingTimer);

  rl.prompt();
});

rl.input.on('keypress', (char, key) => {
  if (!socket.connected) return;
  if (key?.name === 'return') return;

  if (!isTyping) {
    socket.emit('typing', { conversation_id: CONVERSATION_ID });
    isTyping = true;
  }

  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    socket.emit('stop_typing', { conversation_id: CONVERSATION_ID });
    isTyping = false;
  }, 2000);
});

rl.on('close', () => {
  socket.disconnect();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(colorize(C.yellow, '\n  👋 Tạm biệt!'));
  socket.disconnect();
  process.exit(0);
});
