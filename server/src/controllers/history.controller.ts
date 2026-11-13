import { Request, Response } from 'express';
import { storage } from '../db/database.js';
import { Conversation } from '../types/index.js';

export function getAllConversations(req: Request, res: Response): void {
  try {
    const list = storage.getAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export function getConversationById(req: Request, res: Response): void {
  try {
    const id = String(req.params.id);
    const conv = storage.getById(id);
    if (!conv) {
      res.status(404).json({ error: `Conversation ${id} not found.` });
      return;
    }
    res.json(conv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export function saveConversation(req: Request, res: Response): void {
  try {
    const conv = req.body as Conversation;
    if (!conv || !conv.id) {
      res.status(400).json({ error: 'Valid conversation object with id is required.' });
      return;
    }
    const saved = storage.createOrUpdate(conv);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export function deleteConversation(req: Request, res: Response): void {
  try {
    const id = String(req.params.id);
    const deleted = storage.delete(id);
    res.json({ success: deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export function clearAllConversations(req: Request, res: Response): void {
  try {
    storage.clear();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
