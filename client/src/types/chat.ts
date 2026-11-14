export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
  tokens?: number;
  modelUsed?: string;
  durationMs?: number;
  error?: boolean;
  citations?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  personaId: string;
  model: string;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
  messages: ChatMessage[];
}

export interface KnowledgeStatus {
  status: 'INDEXED' | 'UNINDEXED';
  version?: string;
  indexedAt?: string;
  totalFiles: number;
  totalChunks: number;
  files: string[];
}
