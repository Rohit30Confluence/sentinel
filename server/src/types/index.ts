export interface FileAttachment {
  filename: string;
  content: string;
  mimeType?: string;
  size?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
  attachments?: FileAttachment[];
  tokens?: number;
  modelUsed?: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon?: string;
  tag?: string;
}

export interface ChatStreamRequest {
  messages: ChatMessage[];
  model: string;
  personaId?: string;
  customSystemPrompt?: string;
  apiKeys?: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
  };
  temperature?: number;
}

export interface StreamTokenData {
  text: string;
}

export interface StreamMetadataData {
  model: string;
  provider: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  durationMs: number;
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

export interface ModelOption {
  id: string;
  name: string;
  provider: 'mock' | 'gemini' | 'openai' | 'anthropic';
  description: string;
  contextWindow: number;
  requiresKey: boolean;
  recommended?: boolean;
}
