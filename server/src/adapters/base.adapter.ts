import { ChatStreamRequest, ChatMessage, FileAttachment } from '../types/index.js';
import { DEFAULT_PERSONAS } from '../constants/personas.js';

export interface StreamCallbacks {
  onToken: (chunk: string) => void;
  onMetadata?: (meta: {
    model: string;
    provider: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    durationMs: number;
  }) => void;
  onError?: (err: Error) => void;
}

export abstract class BaseModelAdapter {
  abstract providerName: string;

  abstract streamChat(
    req: ChatStreamRequest,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void>;

  protected assembleSystemInstruction(req: ChatStreamRequest): string {
    let baseInstruction = '';

    if (req.customSystemPrompt && req.customSystemPrompt.trim().length > 0) {
      baseInstruction = req.customSystemPrompt.trim();
    } else if (req.personaId) {
      const persona = DEFAULT_PERSONAS.find((p) => p.id === req.personaId);
      if (persona) {
        baseInstruction = persona.systemPrompt;
      }
    }

    if (!baseInstruction) {
      baseInstruction = `You are Sentinel AI, an intelligent, versatile, and secure assistant. Provide helpful, structured, and accurate responses. Format all code with markdown language tags.`;
    }

    return baseInstruction;
  }

  protected formatUserMessageWithAttachments(msg: ChatMessage): string {
    if (!msg.attachments || msg.attachments.length === 0) {
      return msg.content;
    }

    let attachmentContext = '\n\n[CONTEXT / ATTACHED FILES]:\n';
    for (const file of msg.attachments) {
      attachmentContext += `\n--- START FILE: ${file.filename} ---\n`;
      attachmentContext += file.content;
      attachmentContext += `\n--- END FILE: ${file.filename} ---\n`;
    }

    return `${msg.content}${attachmentContext}`;
  }
}
