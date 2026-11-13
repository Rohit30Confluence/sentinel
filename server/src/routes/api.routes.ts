import { Router } from 'express';
import { handleChatStream } from '../controllers/chat.controller.js';
import {
  getAllConversations,
  getConversationById,
  saveConversation,
  deleteConversation,
  clearAllConversations
} from '../controllers/history.controller.js';
import { getAvailableModels, getPersonas } from '../controllers/models.controller.js';

export const apiRouter = Router();

// Chat streaming
apiRouter.post('/chat/stream', handleChatStream);

// Models & Personas
apiRouter.get('/models', getAvailableModels);
apiRouter.get('/personas', getPersonas);

// Conversation history
apiRouter.get('/history', getAllConversations);
apiRouter.get('/history/:id', getConversationById);
apiRouter.post('/history', saveConversation);
apiRouter.delete('/history/:id', deleteConversation);
apiRouter.delete('/history', clearAllConversations);
