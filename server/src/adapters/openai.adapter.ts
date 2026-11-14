import OpenAI from 'openai';
import { BaseModelAdapter, StreamCallbacks } from './base.adapter.js';
import { ChatStreamRequest } from '../types/index.js';
import { knowledgeRetriever } from '../rag/retriever.js';

export class OpenAIAdapter extends BaseModelAdapter {
  providerName = 'openai';

  async streamChat(
    req: ChatStreamRequest,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const apiKey = req.apiKeys?.openai || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OpenAI API key is required. Please set OPENAI_API_KEY in .env.'
      );
    }

    const startTime = Date.now();
    const openai = new OpenAI({ apiKey });

    const lastUserMsg = req.messages[req.messages.length - 1]?.content || '';
    const chunks = await knowledgeRetriever.retrieve(lastUserMsg, 4);
    const knowledgeContext = knowledgeRetriever.formatContext(chunks);
    const citations = Array.from(new Set(chunks.map((c) => c.chunk.sourceFile)));

    const systemInstruction = this.assembleSystemInstruction(req, knowledgeContext, citations);

    const formattedMessages: any[] = [{ role: 'system', content: systemInstruction }];

    for (let i = 0; i < req.messages.length; i++) {
      const msg = req.messages[i];
      formattedMessages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    }

    const modelName = req.model.includes('gpt') ? req.model : 'gpt-4o-mini';

    try {
      const stream = await openai.chat.completions.create(
        {
          model: modelName,
          messages: formattedMessages,
          temperature: req.temperature ?? 0.3,
          stream: true
        },
        { signal }
      );

      let fullGeneratedText = '';

      for await (const chunk of stream) {
        if (signal?.aborted) break;
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullGeneratedText += delta;
          callbacks.onToken(delta);
        }
      }

      if (callbacks.onMetadata) {
        callbacks.onMetadata({
          model: modelName,
          provider: 'openai',
          promptTokens: Math.ceil(
            formattedMessages.reduce((acc, m) => acc + (m.content?.length || 0), 0) / 4
          ),
          completionTokens: Math.ceil(fullGeneratedText.length / 4),
          durationMs: Date.now() - startTime,
          citations
        });
      }
    } catch (err: any) {
      console.error('[OpenAIAdapter] Stream error:', err);
      throw new Error(err.message || 'Error occurred while streaming from OpenAI API');
    }
  }
}
