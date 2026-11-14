import Anthropic from '@anthropic-ai/sdk';
import { BaseModelAdapter, StreamCallbacks } from './base.adapter.js';
import { ChatStreamRequest } from '../types/index.js';
import { knowledgeRetriever } from '../rag/retriever.js';

export class AnthropicAdapter extends BaseModelAdapter {
  providerName = 'anthropic';

  async streamChat(
    req: ChatStreamRequest,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const apiKey = req.apiKeys?.anthropic || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Anthropic API key is required. Please set ANTHROPIC_API_KEY in .env.'
      );
    }

    const startTime = Date.now();
    const anthropic = new Anthropic({ apiKey });

    const lastUserMsg = req.messages[req.messages.length - 1]?.content || '';
    const chunks = await knowledgeRetriever.retrieve(lastUserMsg, 4);
    const knowledgeContext = knowledgeRetriever.formatContext(chunks);
    const citations = Array.from(new Set(chunks.map((c) => c.chunk.sourceFile)));

    const systemInstruction = this.assembleSystemInstruction(req, knowledgeContext, citations);

    const formattedMessages: any[] = [];

    for (let i = 0; i < req.messages.length; i++) {
      const msg = req.messages[i];
      if (msg.role === 'system') continue;
      formattedMessages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    }

    const modelName = req.model.includes('claude') ? req.model : 'claude-3-7-sonnet-20250219';

    try {
      const stream = anthropic.messages.stream({
        model: modelName,
        max_tokens: 4096,
        system: systemInstruction,
        messages: formattedMessages,
        temperature: req.temperature ?? 0.3
      });

      let fullGeneratedText = '';

      for await (const event of stream) {
        if (signal?.aborted) {
          stream.abort();
          break;
        }

        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          const text = event.delta.text;
          fullGeneratedText += text;
          callbacks.onToken(text);
        }
      }

      if (callbacks.onMetadata) {
        callbacks.onMetadata({
          model: modelName,
          provider: 'anthropic',
          promptTokens: Math.ceil(
            formattedMessages.reduce((acc, m) => acc + (m.content?.length || 0), 0) / 4
          ),
          completionTokens: Math.ceil(fullGeneratedText.length / 4),
          durationMs: Date.now() - startTime,
          citations
        });
      }
    } catch (err: any) {
      console.error('[AnthropicAdapter] Stream error:', err);
      throw new Error(err.message || 'Error occurred while streaming from Anthropic API');
    }
  }
}
