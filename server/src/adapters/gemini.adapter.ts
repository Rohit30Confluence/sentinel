import { GoogleGenAI } from '@google/genai';
import { BaseModelAdapter, StreamCallbacks } from './base.adapter.js';
import { ChatStreamRequest } from '../types/index.js';

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
        'Gemini API key is required. Please set GEMINI_API_KEY in .env or provide it in the UI Settings.'
      );
    }

    const startTime = Date.now();
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = this.assembleSystemInstruction(req);

    // Format chat history into contents array
    const contents: any[] = [];

    for (let i = 0; i < req.messages.length; i++) {
      const msg = req.messages[i];
      const isLast = i === req.messages.length - 1;
      const contentText = isLast ? this.formatUserMessageWithAttachments(msg) : msg.content;

      if (msg.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: contentText }]
        });
      } else if (msg.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: contentText }]
        });
      }
    }

    const modelName = req.model.startsWith('gemini') ? req.model : 'gemini-2.5-flash';

    try {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: req.temperature ?? 0.7
        }
      });

      let fullGeneratedText = '';

      for await (const chunk of responseStream) {
        if (signal?.aborted) {
          break;
        }
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
          durationMs: Date.now() - startTime
        });
      }
    } catch (err: any) {
      console.error('[GeminiAdapter] Stream error:', err);
      throw new Error(err.message || 'Error occurred while streaming from Gemini API');
    }
  }
}
