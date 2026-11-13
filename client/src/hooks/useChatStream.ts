import { useState, useRef, useCallback } from 'react';
import { ChatMessage, FileAttachment, UserSettings, Conversation } from '../types/chat.js';
import { generateId } from '../utils/storage.js';

interface UseChatStreamProps {
  currentConversation: Conversation | null;
  onUpdateConversation: (conv: Conversation) => void;
  settings: UserSettings;
}

export function useChatStream({
  currentConversation,
  onUpdateConversation,
  settings
}: UseChatStreamProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokensProcessed, setTokensProcessed] = useState<number>(0);
  const [lastDurationMs, setLastDurationMs] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string, attachments: FileAttachment[] = []) => {
      if ((!content.trim() && attachments.length === 0) || !currentConversation || isStreaming) {
        return;
      }

      setError(null);
      const userMessageId = generateId();
      const assistantMessageId = generateId();

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content,
        attachments,
        createdAt: Date.now()
      };

      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        modelUsed: settings.selectedModel
      };

      const updatedMessages = [...currentConversation.messages, userMessage, assistantMessage];
      const newTitle =
        currentConversation.messages.length === 0
          ? content.slice(0, 36) || 'New Conversation'
          : currentConversation.title;

      const activeConv: Conversation = {
        ...currentConversation,
        title: newTitle,
        updatedAt: Date.now(),
        messages: updatedMessages
      };

      onUpdateConversation(activeConv);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const payload = {
          messages: updatedMessages.slice(0, -1), // send up to user message
          model: settings.selectedModel,
          personaId: settings.selectedPersona,
          customSystemPrompt: settings.customSystemPrompt,
          temperature: settings.temperature,
          apiKeys: {
            gemini: settings.geminiKey,
            openai: settings.openaiKey,
            anthropic: settings.anthropicKey
          }
        };

        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported by browser or backend');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedAssistantText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          let currentEvent = 'message';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith('event:')) {
              currentEvent = trimmed.replace('event:', '').trim();
            } else if (trimmed.startsWith('data:')) {
              const dataStr = trimmed.replace('data:', '').trim();
              try {
                const parsed = JSON.parse(dataStr);

                if (currentEvent === 'token' && parsed.token) {
                  accumulatedAssistantText += parsed.token;
                  setTokensProcessed((prev) => prev + 1);

                  // Update assistant message live in conversation
                  onUpdateConversation({
                    ...activeConv,
                    messages: updatedMessages.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, content: accumulatedAssistantText }
                        : m
                    )
                  });
                } else if (currentEvent === 'metadata') {
                  if (parsed.durationMs) setLastDurationMs(parsed.durationMs);
                  if (parsed.totalTokens) setTokensProcessed(parsed.totalTokens);
                } else if (currentEvent === 'error') {
                  setError(parsed.message || 'Stream error occurred.');
                }
              } catch (parseErr) {
                console.warn('Failed parsing SSE data chunk:', dataStr);
              }
            }
          }
        }

        // Finalize conversation state
        const finalizedConv: Conversation = {
          ...activeConv,
          messages: updatedMessages.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content: accumulatedAssistantText || '*(No response received)*',
                  durationMs: lastDurationMs,
                  tokens: tokensProcessed
                }
              : m
          )
        };
        onUpdateConversation(finalizedConv);

        // Optionally persist to server /api/history
        fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalizedConv)
        }).catch((err) => console.warn('History background sync error:', err));
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Stream aborted by user');
        } else {
          console.error('Chat error:', err);
          setError(err.message || 'Failed to communicate with Sentinel AI server.');

          // Update message with error badge
          onUpdateConversation({
            ...activeConv,
            messages: updatedMessages.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: m.content
                      ? m.content + '\n\n*(Stream interrupted)*'
                      : '⚠️ **Error**: ' + (err.message || 'Failed to complete response.'),
                    error: true
                  }
                : m
            )
          });
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [currentConversation, isStreaming, onUpdateConversation, settings, lastDurationMs, tokensProcessed]
  );

  return {
    sendMessage,
    stopGenerating,
    isStreaming,
    error,
    tokensProcessed,
    lastDurationMs
  };
}
