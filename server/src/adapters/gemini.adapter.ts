import { GoogleGenAI } from '@google/genai';
import { BaseModelAdapter, StreamCallbacks } from './base.adapter.js';
import { ChatStreamRequest } from '../types/index.js';
import { knowledgeRetriever } from '../rag/retriever.js';

export class GeminiAdapter extends BaseModelAdapter {
  providerName = 'gemini';

  async streamChat(
    req: ChatStreamRequest,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const apiKey = req.apiKeys?.gemini || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Gemini API key is required. Please set GEMINI_API_KEY in .env.'
      );
    }

    const startTime = Date.now();
    const ai = new GoogleGenAI({ apiKey });

    // Retrieve knowledge chunks
    const lastUserMsg = req.messages[req.messages.length - 1]?.content || '';
    const chunks = await knowledgeRetriever.retrieve(lastUserMsg, 4);
    const knowledgeContext = knowledgeRetriever.formatContext(chunks);
    const citations = Array.from(new Set(chunks.map((c) => c.chunk.sourceFile)));

    const systemInstruction = this.assembleSystemInstruction(req, knowledgeContext, citations);

    const contents: any[] = [];
    for (let i = 0; i < req.messages.length; i++) {
      const msg = req.messages[i];
      if (msg.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'assistant') {
        contents.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    }

    const modelName = req.model.startsWith('gemini') ? req.model : 'gemini-2.5-flash';

    try {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: req.temperature ?? 0.3
        }
      });

      let fullGeneratedText = '';

      for await (const chunk of responseStream) {
        if (signal?.aborted) break;
        const text = chunk.text;
        if (text) {
          fullGeneratedText += text;
          callbacks.onToken(text);
        }
      }

      if (callbacks.onMetadata) {
        callbacks.onMetadata({
          model: modelName,
          provider: 'gemini',
          promptTokens: Math.ceil(contents.reduce((acc, c) => acc + (c.parts[0]?.text?.length || 0), 0) / 4),
          completionTokens: Math.ceil(fullGeneratedText.length / 4),
          durationMs: Date.now() - startTime,
          citations
        });
      }
    } catch (err: any) {
      console.error('[GeminiAdapter] Stream error:', err);
      throw new Error(err.message || 'Error occurred while streaming from Gemini API');
    }
  }
}
