const chatService = require('../services/chatService');
const { success } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const getActiveChats = async (req, res, next) => {
  try {
    logger.info(`[ChatController] getActiveChats called by userId=${req.user.userId}, role=${req.user.role}`);
    const chats = await chatService.getActiveChats(req.user.userId, req.user.role);
    logger.info(`[ChatController] Returning ${chats.length} active chats`);
    return success(res, 'Active chats retrieved', chats);
  } catch (err) {
    logger.error(`[ChatController] getActiveChats error: ${err.message}`);
    next(err);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const history = await chatService.getChatHistory(req.user.userId, req.user.role);
    return success(res, 'Chat history retrieved', history);
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await chatService.getMessages(req.params.slotId, req.user.userId, req.user.role);
    return success(res, 'Messages retrieved', messages);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActiveChats,
  getChatHistory,
  getMessages,
};
