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
  durationMs?: number;
  error?: boolean;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon?: string;
  tag?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: 'mock' | 'gemini' | 'openai' | 'anthropic';
  description: string;
  contextWindow: number;
  requiresKey: boolean;
  serverConfigured?: boolean;
  recommended?: boolean;
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

export interface UserSettings {
  geminiKey: string;
  openaiKey: string;
  anthropicKey: string;
  selectedModel: string;
  selectedPersona: string;
  customSystemPrompt: string;
  temperature: number;
  streamTokens: boolean;
  autoSaveHistory: boolean;
}
