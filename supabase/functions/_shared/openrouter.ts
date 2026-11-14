export const OPENROUTER_MODEL = 'nvidia/nemotron-3.5-super-vl:free';

type OpenRouterOptions = {
  messages: unknown[];
  maxTokens?: number;
  temperature?: number;
  tools?: unknown[];
  responseFormat?: { type: string };
};

export async function requestOpenRouter({
  messages,
  maxTokens = 2048,
  temperature = 0.7,
  tools,
  responseFormat,
}: OpenRouterOptions) {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) throw new Error('OpenRouter is not configured.');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
      ...(tools?.length ? { tools, tool_choice: 'auto' } : {}),
      ...(responseFormat ? { response_format: responseFormat } : {}),
    }),
  });

  if (!response.ok) {
    const details = (await response.text()).slice(0, 2000);
    console.error(`OpenRouter request failed (${response.status}): ${details}`);
    throw new Error(`OpenRouter request failed (${response.status}): ${details}`);
  }

  return await response.json();
}

export function getCompletionMessage(data: any) {
  return data?.choices?.[0]?.message ?? {};
}

export function getToolCallArguments(toolCall: any) {
  const rawArguments = toolCall?.function?.arguments;
  if (typeof rawArguments === 'string') {
    try {
      return JSON.parse(rawArguments);
    } catch {
      return {};
    }
  }
  return rawArguments && typeof rawArguments === 'object' ? rawArguments : {};
}