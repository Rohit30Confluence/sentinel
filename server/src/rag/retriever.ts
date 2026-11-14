import { KnowledgeChunk, knowledgeIndexer } from './indexer.js';

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  score: number;
  matchedTerms: string[];
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'are', 'was',
  'were', 'will', 'been', 'about', 'what', 'when', 'where', 'which', 'who',
  'how', 'give', 'tell', 'show', 'please', 'does', 'need', 'into', 'some',
  'more', 'than', 'them', 'they', 'your', 'ours', 'mine', 'just', 'like',
  'make', 'want', 'write', 'explain', 'look', 'find'
]);

export class KnowledgeRetriever {
  private chunksCache: KnowledgeChunk[] = [];
  private lastLoaded: number = 0;

  private ensureLoaded(): void {
    const now = Date.now();
    if (this.chunksCache.length === 0 || now - this.lastLoaded > 60000) {
      const manifest = knowledgeIndexer.loadIndex();
      if (manifest && manifest.chunks) {
        this.chunksCache = manifest.chunks;
        this.lastLoaded = now;
      }
    }
  }

  public setChunks(chunks: KnowledgeChunk[]): void {
    this.chunksCache = chunks;
    this.lastLoaded = Date.now();
  }

  public async retrieve(query: string, topK: number = 4): Promise<RetrievedChunk[]> {
    this.ensureLoaded();

    if (!this.chunksCache || this.chunksCache.length === 0) {
      const manifest = await knowledgeIndexer.buildIndex();
      this.chunksCache = manifest.chunks;
    }

    const rawTerms = query
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2);

    const queryTerms = rawTerms.filter((t) => !STOP_WORDS.has(t));

    if (queryTerms.length === 0) {
      return [];
    }

    // High-value domain aliases & synonyms
    const termExpansion: Record<string, string[]> = {
      'rent': ['rent', 'billing', 'ledger', 'lease', 'revenue', 'enach', 'autopay'],
      'pricing': ['pricing', 'price', 'cost', 'tier', 'pilot', 'growth', 'enterprise', 'aed', 'usd', 'inr'],
      'price': ['pricing', 'price', 'cost', 'tier', 'pilot', 'growth', 'enterprise', 'aed', 'usd'],
      'cost': ['pricing', 'price', 'tier', 'aed', 'usd'],
      'tier': ['pricing', 'tier', 'pilot', 'growth', 'enterprise', 'aed'],
      'modules': ['single-family', 'communities', 'short-term', 'portfolio', 'module'],
      'module': ['single-family', 'communities', 'short-term', 'portfolio', 'module'],
      'platform': ['single-family', 'communities', 'short-term', 'portfolio', 'rhythm'],
      'rhythm': ['operations', 'capture', 'connect', 'coordinate', 'control', 'prove'],
      'operations': ['operations', 'rhythm', 'intake', 'context', 'ownership', 'permission', 'record'],
      'kyc': ['kyc', 'aadhaar', 'police', 'verification', 'dpdp', 'form c', 'frro'],
      'foreign': ['foreign', 'form c', 'frro', 'lukas', 'elena', 'kenji', 'passport', 'visa'],
      'residents': ['residents', 'lukas', 'elena', 'kenji', 'aditi', 'sneha', 'rooms', 'pune'],
      'resident': ['residents', 'lukas', 'elena', 'kenji', 'aditi', 'sneha', 'rooms', 'pune'],
      'market': ['maharashtra', 'pune', 'karnataka', 'bangalore', 'gcc', 'uae', 'dubai', 'riyadh'],
      'markets': ['maharashtra', 'pune', 'karnataka', 'bangalore', 'gcc', 'uae', 'dubai', 'riyadh'],
      'payment': ['enach', 'autopay', 'cashfree', 'razorpay', 'stripe', 'zoho', 'payu', 'van'],
      'payments': ['enach', 'autopay', 'cashfree', 'razorpay', 'stripe', 'zoho', 'payu', 'van'],
      'rails': ['enach', 'autopay', 'cashfree', 'razorpay', 'stripe', 'zoho', 'payu', 'van']
    };

    const expandedQueryTerms = new Set<string>(queryTerms);
    for (const term of queryTerms) {
      if (termExpansion[term]) {
        for (const syn of termExpansion[term]) {
          expandedQueryTerms.add(syn);
        }
      }
    }

    const scoredChunks: RetrievedChunk[] = [];

    for (const chunk of this.chunksCache) {
      const chunkText = (chunk.title + ' ' + chunk.content).toLowerCase();
      let score = 0;
      const matched: string[] = [];

      for (const term of expandedQueryTerms) {
        if (chunkText.includes(term)) {
          const inTitle = chunk.title.toLowerCase().includes(term);
          const weight = inTitle ? 4.0 : 1.5;
          const matches = (chunkText.match(new RegExp(`\\b${term}`, 'g')) || []).length;
          score += weight * (1 + Math.log(1 + matches));
          matched.push(term);
        }
      }

      if (score > 0) {
        scoredChunks.push({
          chunk,
          score,
          matchedTerms: matched
        });
      }
    }

    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, topK);
  }

  public isQueryRelevant(query: string, topChunks: RetrievedChunk[]): boolean {
    if (!topChunks || topChunks.length === 0) return false;

    const lower = query.trim().toLowerCase();
    const isGreeting = /^(hi|hello|hey|greetings|good morning|good afternoon|what can you do|who are you)\b/i.test(
      lower
    );
    if (isGreeting) return true;

    const top = topChunks[0];
    const meaningfulMatches = top.matchedTerms.filter((t) => !STOP_WORDS.has(t) && t.length >= 3);
    return meaningfulMatches.length >= 1 && top.score >= 2.0;
  }

  public formatContext(chunks: RetrievedChunk[]): string {
    if (chunks.length === 0) return '';

    let formatted = '=== GROUNDED THΛTJOINT KNOWLEDGE BASE (STRICT TRUTH SOURCE) ===\n\n';
    for (let i = 0; i < chunks.length; i++) {
      const { chunk } = chunks[i];
      formatted += `--- [DOCUMENT ${i + 1}: ${chunk.sourceFile} | ${chunk.title}] ---\n`;
      formatted += `${chunk.content}\n\n`;
    }
    formatted += '=== END KNOWLEDGE BASE ===\n';
    return formatted;
  }
}

export const knowledgeRetriever = new KnowledgeRetriever();
