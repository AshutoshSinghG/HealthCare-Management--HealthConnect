const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');
const http = require('http');
const { Server } = require('socket.io');
const handleSocketConnection = require('./socketHandler');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express + HTTP server
    const server = http.createServer(app);
    
    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
    
    // Handle socket connections
    handleSocketConnection(io);

    server.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`API Docs: http://localhost:${env.PORT}/api-docs`);
      logger.info(`Health:   http://localhost:${env.PORT}/api/health`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Unhandled rejection handler
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
