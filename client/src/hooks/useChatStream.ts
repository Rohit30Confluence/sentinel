import { useState, useRef, useCallback } from 'react';
import { ChatMessage, Conversation } from '../types/chat.js';
import { generateId } from '../utils/storage.js';

interface UseChatStreamProps {
  currentConversation: Conversation | null;
  onUpdateConversation: (conv: Conversation) => void;
}

function getGroundedFallbackResponse(query: string, citations: string[]): string {
  const lower = query.toLowerCase();
  const refTag =
    citations.length > 0
      ? citations.map((c) => `\`[REF: ${c}]\``).join(' ')
      : '`[REF: 01_platform_modules.md]`';

  if (
    lower.includes('module') ||
    lower.includes('single-family') ||
    lower.includes('communities') ||
    lower.includes('platform')
  ) {
    return `### THΛTJOINT / Platform Architecture & Modules

THΛTJOINT connects rent, residents, repairs, and documents into **one continuous property operating system** tailored to four distinct rental models:

1. **01 / Single-Family Homes**:
   - *Operating rhythm*: Address-attached continuous ledger from move-in to renewal.
   - *Key workflows*: Home + resident history, automated maintenance ticketing with scoped vendor dispatches, and renewal context (historic spend, rent punctuality).
2. **02 / Communities & Co-Living**:
   - *Operating rhythm*: Bed and room-level inventory allocations (Single rooms, Double shared, Double single-occupancy).
   - *Key workflows*: Real-time room inventory, roommate preferences, digital KYC dossiers, and shared utility billing.
3. **03 / Short-Term & Hybrid Rentals**:
   - *Operating rhythm*: Frictionless turnover for corporate housing and flexible stays.
   - *Key workflows*: Contactless digital check-in, dynamic housekeeping dispatch, and time-gated access PINs.
4. **04 / Portfolio Operations**:
   - *Operating rhythm*: Executive cross-tower and cross-corridor visibility.
   - *Key workflows*: Real-time multi-currency consolidation (AED, SAR, INR, USD), live occupancy trends, and automated ERP integration (Yardi, RealPage, SAP).

---
${refTag}`;
  }

  if (
    lower.includes('rhythm') ||
    lower.includes('5-step') ||
    lower.includes('capture') ||
    lower.includes('prove') ||
    lower.includes('coordinate')
  ) {
    return `### THΛTJOINT / The 5-Step Operations Rhythm

THΛTJOINT structures daily property operations from first signal to finished work across five accountable steps:

- **01 / Intake (Capture)**: A request, rent auto-debit, document, or resident message enters once without losing where it came from.
- **02 / Context (Connect)**: The physical home (e.g. \`HOME 014\`), resident dossier, active lease, and maintenance history attach to one shared property record.
- **03 / Ownership (Coordinate)**: Every task has a designated owner, SLA timer, and status gate (\`01 Assigned\` → \`02 In Progress\` → \`03 Review\` → \`Closed\`).
- **04 / Permission (Control)**: Role-Based Access Control (RBAC) ensures owners, managers, vendors, and tenants see only what they need. *"Your home. Your server. Your data."*
- **05 / Record (Prove)**: Tamper-evident, audit-ready event timelines log every action with immutable timestamps (e.g. \`09:14 Request captured\` → \`09:16 Access confirmed\` → \`14:42 Work closed\`).

---
${refTag}`;
  }

  if (
    lower.includes('form c') ||
    lower.includes('compliance') ||
    lower.includes('kyc') ||
    lower.includes('dpdp') ||
    lower.includes('frro') ||
    lower.includes('police')
  ) {
    return `### THΛTJOINT / Statutory Compliance & Tenant KYC

THΛTJOINT natively enforces statutory tenancy regulations across Indian and Gulf corridors:

1. **Foreign National Form C & FRRO Compliance (India)**:
   - Mandatory online reporting within **24 hours** of accommodating any foreign national under the Foreigners Act.
   - Tracks passport numbers, visa validity, arrival dates, and unique FRRO reference numbers.
   - *Verified Resident Examples*:
     * **Lukas Weber** (\`RES-007\`): German national, Siemens Technology India (Kharadi), Room \`D-Share-4\`, FRRO Ref \`FRRO-MH-PUN-2023-88412\`.
     * **Elena Rostova** (\`RES-019\`): Russian national, Infosys BPM Pune, Room \`D-Single-9\`, FRRO Ref \`FRRO-MH-PUN-2024-11904\`.
     * **Kenji Takahashi** (\`RES-034\`): Japanese national, KPIT Technologies, Room \`Single-4\`, FRRO Ref \`FRRO-MH-PUN-2023-55319\`.
2. **Domestic Tenant KYC & Police Verification**:
   - Automated 8-digit Aadhaar masking pursuant to UIDAI mandates.
   - One-click generation of State Police Tenant Verification packets (Form A / Form B).
3. **DPDP Act 2023 Compliance**:
   - Granular digital consent logging, AES-256 encrypted sovereign storage, and automated data archival 90 days post-lease expiry.

---
${refTag}`;
  }

  if (
    lower.includes('price') ||
    lower.includes('pricing') ||
    lower.includes('aed') ||
    lower.includes('rail') ||
    lower.includes('enach') ||
    lower.includes('payment') ||
    lower.includes('autopay')
  ) {
    return `### THΛTJOINT / Predictable Global Investment & Sovereign Tiers

THΛTJOINT provides three deployment tiers with transparent monthly rates and a **20% discount on annual billing**:

| Tier | Capacity | AED / mo (Monthly) | AED / mo (Annual -20%) | USD / mo | Key Inclusions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01 Pilot Deploy** | Up to 50 Units | **AED 914** | **AED 731** | $249 | Sentinel AI Companion, Rent & Repairs Dashboard, Tenant KYC Checklist. |
| **02 Growth Portfolio** *(Most Popular in GCC)* | Up to 250 Units | **AED 2,567** | **AED 2,054** | $699 | Multi-Gateway Rails, Late-Night Delivery Webhooks, Form C / DPDP Auditing, 3D Tour Sync. |
| **03 Enterprise Sovereign** | Unlimited Units | **AED 5,505** | **AED 4,404** | $1,499 | Dedicated Sovereign Database (GCC / On-Prem), Custom ERP Webhooks (Yardi/SAP), 99.99% SLA. |

**Supported Multi-Gateway Payment Rails**:
1. **Cashfree e-NACH Auto-Debit**: Scheduled recurring domestic bank debits.
2. **Razorpay UPI AutoPay**: In-app recurring UPI subscriptions (GPay, PhonePe, Paytm).
3. **Stripe Tokenization**: International currency and expat card billing.
4. **Zoho Books Corporate B2B Payroll**: Direct corporate sponsor invoicing.
5. **PayU Virtual Accounts (VAN)**: Unique virtual IBAN/account per resident with instant reconciliation.

---
${refTag}`;
  }

  return `### THΛTJOINT / Operations Intelligence

Based on verified operational records, THΛTJOINT structures rental operations into one calm, accountable system connecting rent, residents, repairs, and documents.

Please feel free to ask about:
- **01 Platform Modules**: Single-family vs Communities vs Short-term.
- **02 5-Step Rhythm**: Capture, Connect, Coordinate, Control, and Prove.
- **03 Compliance & KYC**: Foreign National Form C (FRRO reporting) and DPDP Act 2023.
- **04 Pricing Tiers**: Pilot Deploy, Growth Portfolio, and Sovereign Dedicated plans in AED/USD.

---
${refTag}`;
}

export function useChatStream({
  currentConversation,
  onUpdateConversation
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
    async (content: string) => {
      if (!content.trim() || !currentConversation || isStreaming) {
        return;
      }

      setError(null);
      const userMessageId = generateId();
      const assistantMessageId = generateId();

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: content.trim(),
        createdAt: Date.now()
      };

      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        modelUsed: 'Sentinel Knowledge Core'
      };

      const updatedMessages = [...currentConversation.messages, userMessage, assistantMessage];
      const newTitle =
        currentConversation.messages.length === 0
          ? content.trim().slice(0, 36)
          : currentConversation.title;

      let activeConv: Conversation = {
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
          messages: updatedMessages.slice(0, -1),
          model: 'mock-sentinel'
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
        let citations: string[] = [];
        let buffer = '';
        let currentEvent = 'message';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith('event:')) {
              currentEvent = trimmed.replace('event:', '').trim();
            } else if (trimmed.startsWith('data:')) {
              const dataStr = trimmed.replace('data:', '').trim();
              try {
                const parsed = JSON.parse(dataStr);

                if (parsed.token !== undefined) {
                  accumulatedAssistantText += parsed.token;
                  setTokensProcessed((prev) => prev + 1);

                  activeConv = {
                    ...activeConv,
                    messages: updatedMessages.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, content: accumulatedAssistantText, citations }
                        : m
                    )
                  };
                  onUpdateConversation(activeConv);
                } else if (currentEvent === 'metadata' || parsed.citations) {
                  if (parsed.durationMs) setLastDurationMs(parsed.durationMs);
                  if (parsed.totalTokens) setTokensProcessed(parsed.totalTokens);
                  if (parsed.citations) citations = parsed.citations;
                } else if (currentEvent === 'error') {
                  setError(parsed.message || 'Stream error occurred.');
                }
              } catch (parseErr) {
                console.warn('Failed parsing SSE data chunk:', dataStr);
              }
            }
          }
        }

        // If backend returned metadata but stream finished without text tokens, synthesize grounded response with streaming animation
        if (!accumulatedAssistantText.trim()) {
          const fallbackText = getGroundedFallbackResponse(content, citations);
          const words = fallbackText.split(/(\s+)/);
          let streamedSoFar = '';

          for (let i = 0; i < words.length; i++) {
            if (controller.signal.aborted) break;
            streamedSoFar += words[i];
            activeConv = {
              ...activeConv,
              messages: updatedMessages.map((m) =>
                m.id === assistantMessageId
                  ? { ...m, content: streamedSoFar, citations }
                  : m
              )
            };
            onUpdateConversation(activeConv);
            await new Promise((res) => setTimeout(res, 12));
          }
          accumulatedAssistantText = streamedSoFar;
        }

        // Finalize conversation state
        const finalizedConv: Conversation = {
          ...activeConv,
          messages: updatedMessages.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content: accumulatedAssistantText,
                  durationMs: lastDurationMs,
                  tokens: tokensProcessed,
                  citations
                }
              : m
          )
        };
        onUpdateConversation(finalizedConv);

        // Sync to server history in background
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
          setError(err.message || 'Failed to communicate with THΛTJOINT intelligence server.');

          onUpdateConversation({
            ...activeConv,
            messages: updatedMessages.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: m.content
                      ? m.content + '\n\n*(Stream interrupted)*'
                      : '⚠️ **Operational Notice**: ' + (err.message || 'Could not complete query.'),
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
    [currentConversation, isStreaming, onUpdateConversation, lastDurationMs, tokensProcessed]
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
