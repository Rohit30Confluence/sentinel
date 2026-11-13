import fs from 'fs';
import path from 'path';
import { Conversation, ChatMessage } from '../types/index.js';

export class StorageService {
  private filePath: string;
  private conversations: Map<string, Conversation> = new Map();

  constructor(customPath?: string) {
    const dataDir = customPath ? path.dirname(customPath) : path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = customPath || path.join(dataDir, 'sentinel_history.json');
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const data: Conversation[] = JSON.parse(raw);
        this.conversations.clear();
        for (const conv of data) {
          this.conversations.set(conv.id, conv);
        }
      }
    } catch (err) {
      console.error('[StorageService] Error loading conversations file:', err);
      this.conversations.clear();
    }
  }

  private persist(): void {
    try {
      const data = Array.from(this.conversations.values());
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[StorageService] Error saving conversations file:', err);
    }
  }

  public getAll(): Conversation[] {
    return Array.from(this.conversations.values()).sort(
      (a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt)
    );
  }

  public getById(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  public createOrUpdate(conv: Conversation): Conversation {
    conv.updatedAt = Date.now();
    this.conversations.set(conv.id, conv);
    this.persist();
    return conv;
  }

  public delete(id: string): boolean {
    const existed = this.conversations.delete(id);
    if (existed) {
      this.persist();
    }
    return existed;
  }

  public clear(): void {
    this.conversations.clear();
    this.persist();
  }

  public appendMessage(convId: string, message: ChatMessage): Conversation {
    let conv = this.conversations.get(convId);
    if (!conv) {
      conv = {
        id: convId,
        title: message.content.slice(0, 32) || 'New Conversation',
        personaId: 'sentinel-prime',
        model: 'mock-sentinel',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
      };
    }
    conv.messages.push(message);
    conv.updatedAt = Date.now();
    this.conversations.set(convId, conv);
    this.persist();
    return conv;
  }
}

export const storage = new StorageService();
