import { Request, Response } from 'express';
import { ChatStreamRequest } from '../types/index.js';
import { AdapterFactory } from '../adapters/factory.js';

export async function handleChatStream(req: Request, res: Response): Promise<void> {
  const body = req.body as ChatStreamRequest;

  if (!body || !body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    res.status(400).json({ error: 'Request body must include a non-empty messages array.' });
    return;
  }

  // Set SSE streaming headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const abortController = new AbortController();

  req.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  const sendEvent = (event: string, data: any) => {
    if (res.writableEnded) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const adapter = AdapterFactory.getAdapter(body);

    await adapter.streamChat(
      body,
      {
        onToken: (token: string) => {
          sendEvent('token', { token });
        },
        onMetadata: (meta: any) => {
          sendEvent('metadata', meta);
        },
        onError: (err: Error) => {
          sendEvent('error', { message: err.message });
        }
      },
      abortController.signal
    );

    sendEvent('done', { completed: true });
    res.end();
  } catch (err: any) {
    console.error('[ChatController] Streaming error:', err);
    sendEvent('error', { message: err.message || 'An error occurred during completion.' });
    res.end();
  }
}
