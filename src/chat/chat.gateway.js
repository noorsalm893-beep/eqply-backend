'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require('@nestjs/websockets');
const socket_io_1 = require('socket.io');
const jwt = require('jsonwebtoken');

let ChatGateway = class ChatGateway {
  server;

  // Map of userId -> socketId so we can route messages
  connectedUsers = new Map();

  handleConnection(client) {
    try {
      // Expect token in handshake: socket({ auth: { token: '...' } })
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.emit('error', { message: 'No token provided' });
        client.disconnect();
        return;
      }

      const secret = process.env.JWT_SECRET || 'secret';
      const payload = jwt.verify(token, secret);
      const userId = payload.sub || payload._id || payload.id;

      if (!userId) {
        client.emit('error', { message: 'Invalid token' });
        client.disconnect();
        return;
      }

      // Store userId on the socket for later use
      client.data.userId = userId;
      this.connectedUsers.set(userId, client.id);

      console.log(`[Chat] User ${userId} connected (socket: ${client.id})`);
      client.emit('connected', { message: 'Connected to chat', userId });
    } catch (err) {
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client) {
    const userId = client.data?.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`[Chat] User ${userId} disconnected`);
    }
  }

  handleSendMessage(data, client) {
    // data = { toUserId: '...', message: '...' }
    const fromUserId = client.data?.userId;

    if (!fromUserId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    const { toUserId, message } = data;

    if (!toUserId || !message) {
      client.emit('error', { message: 'toUserId and message are required' });
      return;
    }

    const payload = {
      fromUserId,
      message,
      timestamp: new Date().toISOString(),
    };

    // Send to recipient if they are online
    const recipientSocketId = this.connectedUsers.get(toUserId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receiveMessage', payload);
    } else {
      // Notify sender that recipient is offline
      client.emit('userOffline', { toUserId, message: 'User is currently offline' });
    }

    // Echo back to sender so they see their own message
    client.emit('messageSent', payload);
  }
};
__decorate(
  [
    (0, websockets_1.WebSocketServer)(),
    __metadata('design:type', socket_io_1.Server),
  ],
  ChatGateway.prototype, 'server', void 0,
);
__decorate(
  [
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  ChatGateway.prototype, 'handleSendMessage', null,
);
exports.ChatGateway = ChatGateway = __decorate(
  [
    (0, websockets_1.WebSocketGateway)({
      cors: {
        origin: '*', // tighten this in production
        credentials: true,
      },
      namespace: '/chat',
    }),
    (0, websockets_1.UsePipes)?.() ?? (target => target), // safe no-op if not needed
  ],
  ChatGateway,
);
//# sourceMappingURL=chat.gateway.js.map