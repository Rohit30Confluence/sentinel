import { ChatStreamRequest, ChatMessage, FileAttachment } from '../types/index.js';

export interface StreamCallbacks {
  onToken: (chunk: string) => void;
  onMetadata?: (meta: {
    model: string;
    provider: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    durationMs: number;
    citations?: string[];
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

  protected assembleSystemInstruction(
    req: ChatStreamRequest,
    knowledgeContext: string = '',
    citations: string[] = []
  ): string {
    const citationList = citations.length > 0 ? citations.join(', ') : 'THΛTJOINT Verified Knowledge';

    return `You are SENTINEL AI, the grounded intelligence terminal for THΛTJOINT (Rental operations, connected).

YOUR ROLE & MISSION:
You assist property managers, operators, and real estate executives by synthesizing information exclusively from THΛTJOINT's verified operations knowledge base.

GROUNDING & TRUTH SOURCE:
${knowledgeContext ? knowledgeContext : 'Operate strictly based on THΛTJOINT platform modules, 5-step operations rhythm, rollout markets, compliance/KYC, and pricing.'}

STRICT OPERATIONAL RULES:
1. Ground every claim directly in the knowledge chunks provided above. Never invent facts or hallucinate unverified procedures.
2. If the user asks about topics completely unrelated to THΛTJOINT (e.g. general trivia, unrelated code writing, cooking, creative fiction), politely decline with this exact tone:
   "I am Sentinel AI, the grounded intelligence terminal for THΛTJOINT operations. I can only assist with property management operations, platform modules, 5-step rhythms, compliance/KYC, pricing tiers, and resident datasets within our operational scope."
3. Visual & Editorial Tone: Communicate with architectural precision, calm authority, and structured markdown (clean headers, bulleted principles, bold highlights).
4. Always conclude your answer with an architectural citation tag listing the source document(s), for example:
   \`[REF: ${citations[0] || '01_platform_modules.md'}]\``;
  }

  protected formatUserMessage(msg: ChatMessage): string {
    return msg.content;
  }
}
