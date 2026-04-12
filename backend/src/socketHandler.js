const { verifyAccessToken } = require('./utils/jwt');
const chatService = require('./services/chatService');
const logger = require('./utils/logger');

const handleSocketConnection = (io) => {
  // Authentication Middleware for Socket.IO
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      const decoded = verifyAccessToken(token);
      socket.user = decoded; // Attach user to socket
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected via socket: ${socket.user.userId}`);

    // Join a specific chat room
    socket.on('joinChat', async ({ slotId }) => {
      try {
        const check = await chatService.validateChatAccess(slotId, socket.user.userId, socket.user.role);
        
        if (!check.valid) {
          socket.emit('error', check.message);
          return;
        }

        const roomName = `chat_${slotId}`;
        socket.join(roomName);
        logger.info(`User ${socket.user.userId} joined room ${roomName}`);
        socket.emit('joined', { slotId, message: 'Joined chat successfully' });
      } catch (err) {
        logger.error(`Error joining chat: ${err.message}`);
        socket.emit('error', 'Server error while joining chat');
      }
    });

    // Handle incoming messages
    socket.on('sendMessage', async ({ slotId, message }) => {
      try {
        // Re-validate time window + access before saving
        const check = await chatService.validateChatAccess(slotId, socket.user.userId, socket.user.role);
        if (!check.valid) {
          socket.emit('error', check.message);
          return;
        }

        // Save to DB
        const savedMsg = await chatService.saveMessage(slotId, socket.user.userId, socket.user.role, message);

        // Broadcast to everyone in room (including sender)
        io.to(`chat_${slotId}`).emit('newMessage', savedMsg);
      } catch (err) {
        logger.error(`Error sending message: ${err.message}`);
        socket.emit('error', 'Server error while sending message');
      }
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected from socket: ${socket.user.userId}`);
    });
  });
};

module.exports = handleSocketConnection;
