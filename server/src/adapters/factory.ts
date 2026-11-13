import { BaseModelAdapter } from './base.adapter.js';
import { MockAdapter } from './mock.adapter.js';
import { GeminiAdapter } from './gemini.adapter.js';
import { OpenAIAdapter } from './openai.adapter.js';
import { AnthropicAdapter } from './anthropic.adapter.js';
import { ChatStreamRequest } from '../types/index.js';

export class AdapterFactory {
  static getAdapter(req: ChatStreamRequest): BaseModelAdapter {
    const model = (req.model || '').toLowerCase();

    // Check explicitly for mock model
    if (model.includes('mock') || model === '') {
      return new MockAdapter();
    }

    // Gemini models
    if (model.includes('gemini')) {
      const hasKey = !!(req.apiKeys?.gemini || process.env.GEMINI_API_KEY);
      if (!hasKey) {
        // Fall back gracefully to mock with informative header if key missing
        console.warn('[AdapterFactory] No Gemini key found; falling back to MockAdapter.');
        return new MockAdapter();
      }
      return new GeminiAdapter();
    }

    // OpenAI models
    if (model.includes('gpt') || model.includes('o1') || model.includes('o3')) {
      const hasKey = !!(req.apiKeys?.openai || process.env.OPENAI_API_KEY);
      if (!hasKey) {
        console.warn('[AdapterFactory] No OpenAI key found; falling back to MockAdapter.');
        return new MockAdapter();
      }
      return new OpenAIAdapter();
    }

    // Anthropic models
    if (model.includes('claude')) {
      const hasKey = !!(req.apiKeys?.anthropic || process.env.ANTHROPIC_API_KEY);
      if (!hasKey) {
        console.warn('[AdapterFactory] No Anthropic key found; falling back to MockAdapter.');
        return new MockAdapter();
      }
      return new AnthropicAdapter();
    }

    // Default to Mock adapter
    return new MockAdapter();
  }
}
