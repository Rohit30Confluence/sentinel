import { Router, Request, Response } from 'express';
import { handleChatStream } from '../controllers/chat.controller.js';
import {
  getAllConversations,
  getConversationById,
  saveConversation,
  deleteConversation,
  clearAllConversations
} from '../controllers/history.controller.js';
import { getAvailableModels, getPersonas } from '../controllers/models.controller.js';
import { knowledgeIndexer } from '../rag/indexer.js';
import { knowledgeRetriever } from '../rag/retriever.js';

export const apiRouter = Router();

// Chat streaming
apiRouter.post('/chat/stream', handleChatStream);

// Knowledge & Admin Endpoints
apiRouter.get('/knowledge/status', (req: Request, res: Response) => {
  try {
    const manifest = knowledgeIndexer.loadIndex();
    if (!manifest) {
      res.json({
        status: 'UNINDEXED',
        totalFiles: 0,
        totalChunks: 0,
        files: []
      });
      return;
    }
    res.json({
      status: 'INDEXED',
      version: manifest.version,
      indexedAt: manifest.indexedAt,
      totalFiles: manifest.totalFiles,
      totalChunks: manifest.totalChunks,
      files: manifest.files
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/reindex', async (req: Request, res: Response) => {
  const adminSecret = process.env.ADMIN_SECRET;
  const providedSecret = req.headers['x-admin-secret'] || req.body?.adminSecret;

  if (adminSecret && adminSecret !== providedSecret) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin secret' });
    return;
  }

  try {
    const manifest = await knowledgeIndexer.buildIndex();
    knowledgeRetriever.setChunks(manifest.chunks);
    res.json({
      success: true,
      message: 'Knowledge base reindexed successfully',
      indexedAt: manifest.indexedAt,
      totalFiles: manifest.totalFiles,
      totalChunks: manifest.totalChunks,
      files: manifest.files
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Models & Personas
apiRouter.get('/models', getAvailableModels);
apiRouter.get('/personas', getPersonas);

// Conversation history
apiRouter.get('/history', getAllConversations);
apiRouter.get('/history/:id', getConversationById);
apiRouter.post('/history', saveConversation);
apiRouter.delete('/history/:id', deleteConversation);
apiRouter.delete('/history', clearAllConversations);
