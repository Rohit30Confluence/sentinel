import assert from 'assert';
import { storage } from '../src/db/database.js';
import { MockAdapter } from '../src/adapters/mock.adapter.js';
import { AdapterFactory } from '../src/adapters/factory.js';
import { DEFAULT_PERSONAS, AVAILABLE_MODELS } from '../src/constants/personas.js';

async function runTests() {
  console.log('🧪 Starting Sentinel AI Server Unit & Integration Tests...');

  // Test 1: Personas & Models definition
  console.log('Testing Personas and Models registry...');
  assert.ok(DEFAULT_PERSONAS.length >= 5, 'Should have at least 5 default personas');
  assert.ok(AVAILABLE_MODELS.length >= 6, 'Should have at least 6 models listed');
  console.log('✅ Personas and Models verified.');

  // Test 2: Adapter Factory
  console.log('Testing Adapter Factory resolution...');
  const mockAdapter = AdapterFactory.getAdapter({
    model: 'mock-sentinel',
    messages: [{ id: '1', role: 'user', content: 'test', createdAt: Date.now() }]
  });
  assert.strictEqual(mockAdapter.providerName, 'mock');
  console.log('✅ Adapter Factory correctly resolves MockAdapter.');

  // Test 3: Mock Streaming Output
  console.log('Testing Mock Adapter token streaming...');
  const tokens: string[] = [];
  let metadataReceived = false;

  await mockAdapter.streamChat(
    {
      model: 'mock-sentinel',
      messages: [{ id: '1', role: 'user', content: 'Explain recursion', createdAt: Date.now() }],
      personaId: 'sentinel-prime'
    },
    {
      onToken: (tok) => tokens.push(tok),
      onMetadata: (meta) => {
        metadataReceived = true;
        assert.strictEqual(meta.provider, 'mock');
      }
    }
  );

  assert.ok(tokens.length > 5, 'Should receive streamed token chunks');
  assert.ok(metadataReceived, 'Should receive stream metadata');
  const fullText = tokens.join('');
  assert.ok(fullText.includes('Sentinel AI'), 'Mock output should contain Sentinel greeting');
  console.log(`✅ Streamed ${tokens.length} token chunks successfully.`);

  // Test 4: File Context Injection in Mock Adapter
  console.log('Testing File Context attachment handling...');
  const fileTokens: string[] = [];
  await mockAdapter.streamChat(
    {
      model: 'mock-sentinel',
      messages: [
        {
          id: '2',
          role: 'user',
          content: 'Analyze this file',
          createdAt: Date.now(),
          attachments: [
            {
              filename: 'demo.ts',
              content: 'const x = 42;'
            }
          ]
        }
      ]
    },
    {
      onToken: (tok) => fileTokens.push(tok)
    }
  );

  const fileText = fileTokens.join('');
  assert.ok(fileText.includes('demo.ts'), 'Should acknowledge attached filename');
  console.log('✅ File attachments recognized in streaming response.');

  // Test 5: Storage Service
  console.log('Testing Conversation History Storage...');
  const testId = `test_${Date.now()}`;
  storage.createOrUpdate({
    id: testId,
    title: 'Test Conversation',
    personaId: 'sentinel-prime',
    model: 'mock-sentinel',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [
      { id: 'm1', role: 'user', content: 'Hello', createdAt: Date.now() }
    ]
  });

  const retrieved = storage.getById(testId);
  assert.ok(retrieved, 'Should retrieve stored conversation');
  assert.strictEqual(retrieved?.title, 'Test Conversation');

  const deleted = storage.delete(testId);
  assert.strictEqual(deleted, true, 'Should successfully delete conversation');
  assert.strictEqual(storage.getById(testId), undefined);
  console.log('✅ Storage operations verified.');

  console.log('\n🎉 ALL SENTINEL BACKEND TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
