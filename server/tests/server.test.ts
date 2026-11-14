import assert from 'assert';
import { storage } from '../src/db/database.js';
import { MockAdapter } from '../src/adapters/mock.adapter.js';
import { AdapterFactory } from '../src/adapters/factory.js';
import { DEFAULT_PERSONAS, AVAILABLE_MODELS } from '../src/constants/personas.js';
import { knowledgeIndexer } from '../src/rag/indexer.js';
import { knowledgeRetriever } from '../src/rag/retriever.js';

async function runTests() {
  console.log('🧪 Starting THΛTJOINT / Sentinel AI Backend & RAG Tests...');

  // Test 1: Personas & Models definition
  console.log('Testing Personas and Models registry...');
  assert.ok(DEFAULT_PERSONAS.length >= 5, 'Should have default personas');
  assert.ok(AVAILABLE_MODELS.length >= 6, 'Should have models listed');
  console.log('✅ Personas and Models verified.');

  // Test 2: Knowledge Indexer
  console.log('Testing Knowledge Indexer on server/knowledge directory...');
  const manifest = await knowledgeIndexer.buildIndex();
  assert.ok(manifest.totalFiles >= 6, `Expected at least 6 files indexed, got ${manifest.totalFiles}`);
  assert.ok(manifest.totalChunks >= 15, `Expected at least 15 chunks, got ${manifest.totalChunks}`);
  console.log(`✅ Indexed ${manifest.totalFiles} files into ${manifest.totalChunks} chunks.`);

  // Test 3: RAG Hybrid Retriever
  console.log('Testing Hybrid Knowledge Retriever...');
  const pricingChunks = await knowledgeRetriever.retrieve('What are the pricing tiers in AED?', 3);
  assert.ok(pricingChunks.length > 0, 'Should retrieve pricing chunks');
  assert.ok(
    pricingChunks[0].chunk.content.includes('914') || pricingChunks[0].chunk.content.includes('AED'),
    'Should contain AED pricing numbers'
  );
  console.log(`✅ Retrieved ${pricingChunks.length} chunks for pricing query. Top file: ${pricingChunks[0].chunk.sourceFile}`);

  const kycChunks = await knowledgeRetriever.retrieve('How does ThatJoint handle Foreign National Form C?', 3);
  assert.ok(kycChunks.length > 0, 'Should retrieve Form C chunks');
  assert.ok(
    kycChunks[0].chunk.content.includes('Form C') || kycChunks[0].chunk.content.includes('FRRO'),
    'Should contain Form C / FRRO details'
  );
  console.log(`✅ Retrieved Form C chunks: ${kycChunks[0].chunk.title}`);

  // Test 4: Mock Adapter Grounded Streaming with Citations
  console.log('Testing Mock Adapter grounded streaming output...');
  const mockAdapter = new MockAdapter();
  const tokens: string[] = [];
  let metadataReceived: any = null;

  await mockAdapter.streamChat(
    {
      model: 'mock-sentinel',
      messages: [{ id: '1', role: 'user', content: 'Explain the 5-step operations rhythm', createdAt: Date.now() }],
      personaId: 'sentinel-prime'
    },
    {
      onToken: (tok) => tokens.push(tok),
      onMetadata: (meta) => {
        metadataReceived = meta;
      }
    }
  );

  const fullText = tokens.join('');
  assert.ok(fullText.includes('Capture') && fullText.includes('Prove'), 'Response should detail 5-step rhythm');
  assert.ok(fullText.includes('[REF:'), 'Response should include citation tag [REF: ...]');
  assert.ok(metadataReceived?.citations?.length > 0, 'Metadata should include citations list');
  console.log(`✅ Streamed ${tokens.length} token chunks with citations: ${metadataReceived.citations.join(', ')}`);

  // Test 5: Out of Domain Query Declination
  console.log('Testing out-of-domain query polite declination...');
  const oodTokens: string[] = [];
  await mockAdapter.streamChat(
    {
      model: 'mock-sentinel',
      messages: [{ id: '2', role: 'user', content: 'Give me a chocolate cake recipe', createdAt: Date.now() }]
    },
    {
      onToken: (tok) => oodTokens.push(tok)
    }
  );

  const oodText = oodTokens.join('');
  assert.ok(
    oodText.includes('grounded intelligence terminal for **THΛTJOINT**') || oodText.includes('operational scope'),
    'Should politely decline out-of-domain queries'
  );
  console.log('✅ Out-of-domain query declined gracefully.');

  // Test 6: Storage Service
  console.log('Testing Conversation History Storage...');
  const testId = `test_${Date.now()}`;
  storage.createOrUpdate({
    id: testId,
    title: 'Test ThatJoint Chat',
    personaId: 'sentinel-prime',
    model: 'mock-sentinel',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [
      { id: 'm1', role: 'user', content: 'Hello ThatJoint', createdAt: Date.now() }
    ]
  });

  const retrieved = storage.getById(testId);
  assert.ok(retrieved, 'Should retrieve stored conversation');
  const deleted = storage.delete(testId);
  assert.strictEqual(deleted, true, 'Should successfully delete conversation');
  console.log('✅ Storage operations verified.');

  console.log('\n🎉 ALL THΛTJOINT / SENTINEL BACKEND & RAG TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
