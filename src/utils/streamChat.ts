import { supabase } from '@/integrations/supabase/client';

interface StreamChatOptions {
  functionName: string;
  body: Record<string, any>;
  onDelta: (text: string) => void;
  onDone: (meta?: { toolCalls?: any[] }) => void;
  onError: (error: Error) => void;
  onToolCalls?: (toolCalls: any[]) => void;
}

export async function streamChat({ functionName, body, onDelta, onDone, onError, onToolCalls }: StreamChatOptions) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const supabaseUrl = 'https://tipqgwdgplxlbwuvxyxa.supabase.co';
    const resp = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcHFnd2RncGx4bGJ3dXZ4eXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3OTg1MjYsImV4cCI6MjA2NzM3NDUyNn0.J9M4wG60dxyP17Jx95quletRqvJmUQbawEIwJS9MfO0',
      },
      body: JSON.stringify({ ...body, stream: true }),
    });

    if (!resp.ok || !resp.body) {
      // Edge function may return SSE even on error; try both JSON and SSE.
      const contentType = resp.headers.get('content-type') || '';
      const errorText = resp.body ? await resp.text() : '';
      if (contentType.includes('text/event-stream') && errorText) {
        // Parse SSE manually to recover the fallback reply text
        let recovered = '';
        for (let line of errorText.split('\n')) {
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === '[DONE]') continue;
          try {
            const parsed = JSON.parse(payload);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) recovered += c;
          } catch { /* ignore */ }
        }
        if (recovered) {
          onDelta(recovered);
          onDone({});
          return;
        }
      }
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.reply || errorJson.error || `Request failed (${resp.status})`);
      } catch (parseErr) {
        if (parseErr instanceof Error && parseErr.message.startsWith('Request failed')) throw parseErr;
        throw new Error(`We couldn't reach MindMate (status ${resp.status}). Please check your connection and try again.`);
      }
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let streamDone = false;
    let collectedToolCalls: any[] | undefined;

    const handleParsed = (parsed: any) => {
      const content = parsed.choices?.[0]?.delta?.content as string | undefined;
      if (content) onDelta(content);
      if (parsed.toolCalls && Array.isArray(parsed.toolCalls)) {
        collectedToolCalls = parsed.toolCalls;
        onToolCalls?.(parsed.toolCalls);
      }
    };

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') {
          streamDone = true;
          break;
        }

        try {
          handleParsed(JSON.parse(jsonStr));
        } catch {
          buffer = line + '\n' + buffer;
          break;
        }
      }
    }

    if (buffer.trim()) {
      for (let raw of buffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (raw.startsWith(':') || raw.trim() === '') continue;
        if (!raw.startsWith('data: ')) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try { handleParsed(JSON.parse(jsonStr)); } catch { /* ignore */ }
      }
    }

    onDone({ toolCalls: collectedToolCalls });
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown streaming error'));
  }
}
