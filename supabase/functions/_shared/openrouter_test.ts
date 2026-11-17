import { OPENROUTER_MODEL, requestOpenRouter } from './openrouter.ts';

Deno.test('all shared OpenRouter requests use the selected Nemotron model', async () => {
  const originalFetch = globalThis.fetch;
  const previousKey = Deno.env.get('OPENROUTER_API_KEY');
  let sentBody: Record<string, unknown> | undefined;

  Deno.env.set('OPENROUTER_API_KEY', 'test-only-key');
  globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
    sentBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    await requestOpenRouter({ messages: [{ role: 'user', content: 'hello' }] });
    if (sentBody?.model !== 'nvidia/nemotron-3.5-super-vl:free' || sentBody.model !== OPENROUTER_MODEL) {
      throw new Error('The OpenRouter request did not use the selected model.');
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (previousKey === undefined) Deno.env.delete('OPENROUTER_API_KEY');
    else Deno.env.set('OPENROUTER_API_KEY', previousKey);
  }
});