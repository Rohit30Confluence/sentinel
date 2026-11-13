import { BaseModelAdapter, StreamCallbacks } from './base.adapter.js';
import { ChatStreamRequest } from '../types/index.js';

export class MockAdapter extends BaseModelAdapter {
  providerName = 'mock';

  async streamChat(
    req: ChatStreamRequest,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const startTime = Date.now();
    const lastMessage = req.messages[req.messages.length - 1];
    const userQuery = lastMessage?.content || 'Hello Sentinel';
    const persona = req.personaId || 'sentinel-prime';
    const hasAttachments = lastMessage?.attachments && lastMessage.attachments.length > 0;

    let responseTemplate = '';

    if (hasAttachments) {
      const fileNames = lastMessage.attachments!.map((f) => `\`${f.filename}\``).join(', ');
      responseTemplate = `### 🛡️ Sentinel Intelligence: File Context Analysis

I have processed the attached file(s): ${fileNames}.

Here is an analysis based on your query: **"${userQuery}"**

1. **Context Ingestion**: Attached source buffers were parsed and injected into working memory.
2. **Key Findings**:
   - The file structure conforms to standard formatting.
   - Code semantics and logic flows have been inspected.

\`\`\`typescript
// Example snippet based on your file context
export function processSentinelContext(data: unknown): boolean {
  console.log("Analyzing file payload...");
  return data !== null && typeof data === 'object';
}
\`\`\`

Would you like me to refactor this logic, add automated unit tests, or run a security audit?`;
    } else if (persona === 'cyber-analyst') {
      responseTemplate = `### 🛡️ Sentinel Threat Intelligence Assessment

**Query**: "${userQuery}"

#### Security Posture & Vulnerability Analysis:
- **Threat Vector**: Analysis indicates potential exposure to input validation bypass and unauthorized data egress.
- **Recommended Hardening Measures**:
  1. **Strict Input Sanitization**: Validate all inputs using strict type schemas (e.g., Zod / Joi).
  2. **Defense in Depth**: Implement rate limiting and CORS origin whitelisting on all ingestion endpoints.
  3. **Least Privilege**: Ensure database credentials and API keys have scoped permissions.

\`\`\`json
{
  "audit_status": "MONITORED",
  "risk_score": "LOW",
  "recommendations": [
    "Enable TLS 1.3 encryption",
    "Rotate upstream API tokens every 30 days",
    "Log security events to append-only audit trail"
  ]
}
\`\`\`
Sentinel is standing by for further analysis.`;
    } else if (persona === 'code-architect') {
      responseTemplate = `### ⚡ Sentinel Code Architecture Review

**Target**: Refactoring and optimizing based on: *"${userQuery}"*

#### High-Level Design Principles:
1. **Separation of Concerns**: Decouple business domain logic from transport layers (SSE/HTTP).
2. **Fault Tolerance**: Always wrap asynchronous streaming generators in structured try/catch blocks with graceful degradation.

\`\`\`typescript
// Refactored Architecture Pattern
export class SentinelPipeline<TInput, TOutput> {
  private readonly steps: Array<(input: TInput) => Promise<TOutput>> = [];

  public use(step: (input: TInput) => Promise<TOutput>): this {
    this.steps.push(step);
    return this;
  }

  public async execute(initial: TInput): Promise<TOutput> {
    let current: any = initial;
    for (const step of this.steps) {
      current = await step(current);
    }
    return current;
  }
}
\`\`\`

*Complexity: $\\mathcal{O}(N)$ sequential step propagation with linear memory consumption.*`;
    } else {
      responseTemplate = `### 🤖 Sentinel AI Response

Hello! I am **Sentinel AI**, currently operating in **Local Simulation Mode**.

You asked:
> ${userQuery}

Here is a structured overview addressing your query:

- **Full-Stack Streaming**: This chat uses real-time Server-Sent Events (SSE) to deliver instant incremental token streaming.
- **Multi-Model Ready**: You can plug in live API keys for **Google Gemini**, **OpenAI**, or **Anthropic** via the **Settings (⚙️)** modal in the top header.
- **Context Awareness**: You can attach code or text files using the 📎 attachment icon below to perform contextual code reviews and Q&A.

\`\`\`javascript
// Sentinel Core Health Check
const status = {
  service: "Sentinel AI Chat",
  status: "ONLINE",
  streaming: "ACTIVE",
  timestamp: new Date().toISOString()
};

console.log("Sentinel operational:", status);
\`\`\`

Feel free to ask a follow-up question, change the persona above, or upload a code file to test context analysis!`;
    }

    // Break response into natural word/token chunks for realistic streaming
    const words = responseTemplate.split(/(\s+)/);

    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) {
        break;
      }
      callbacks.onToken(words[i]);
      // Small randomized delay between 10ms and 30ms to simulate real LLM generation
      await new Promise((res) => setTimeout(res, Math.floor(Math.random() * 20) + 12));
    }

    if (callbacks.onMetadata) {
      const durationMs = Date.now() - startTime;
      callbacks.onMetadata({
        model: 'mock-sentinel',
        provider: 'mock',
        promptTokens: Math.ceil(userQuery.length / 4),
        completionTokens: Math.ceil(responseTemplate.length / 4),
        totalTokens: Math.ceil((userQuery.length + responseTemplate.length) / 4),
        durationMs
      });
    }
  }
}
