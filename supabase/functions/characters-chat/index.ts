import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'Authentication required',
        reply: "Please log in to chat with characters."
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Invalid authentication token',
        reply: "Your session has expired. Please log in again."
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages, maxTokens, temperature, stream = false } = await req.json();
    console.log('Characters chat request, streaming:', stream);

    const googleApiKey = Deno.env.get('GOOGLE_AI_STUDIO_API_KEY');
    if (!googleApiKey) {
      throw new Error('AI service not configured');
    }

    // Convert messages to Gemini format
    const contents = convertToGeminiFormat(messages);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${googleApiKey}`;
    const streamApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:streamGenerateContent?alt=sse&key=${googleApiKey}`;

    // Log usage
    try {
      await supabaseClient.from('ai_usage').insert({
        user_id: user.id,
        feature: 'characters-chat',
        tokens_used: 0
      });
    } catch (usageError) {
      console.error('Error logging AI usage:', usageError);
    }

    if (stream) {
      const response = await fetch(streamApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: temperature || 0.8,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google AI Studio API error:', response.status, errorText);
        throw new Error(`AI service error: ${response.status}`);
      }

      // Transform Gemini SSE to OpenAI-compatible SSE
      const transformStream = new TransformStream({
        transform(chunk, controller) {
          const text = new TextDecoder().decode(chunk);
          const lines = text.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;
            try {
              const geminiData = JSON.parse(jsonStr);
              const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (content) {
                const openaiChunk = { choices: [{ delta: { content } }] };
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
              }
              if (geminiData.candidates?.[0]?.finishReason) {
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
              }
            } catch { /* skip */ }
          }
        }
      });

      const readable = response.body!.pipeThrough(transformStream);
      return new Response(readable, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
      });
    }

    // Non-streaming
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: temperature || 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI Studio API error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble responding right now.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in characters-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: "I apologize, but I'm having trouble connecting right now. Please try again later!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function convertToGeminiFormat(messages: any[]) {
  const contents: any[] = [];
  let systemInstruction = '';

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemInstruction += (systemInstruction ? '\n\n' : '') + msg.content;
      continue;
    }
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }

  if (systemInstruction && contents.length > 0) {
    if (contents[0].role === 'user') {
      contents[0].parts[0].text = systemInstruction + '\n\n' + contents[0].parts[0].text;
    } else {
      contents.unshift({ role: 'user', parts: [{ text: systemInstruction }] });
    }
  }

  const cleaned: any[] = [];
  for (const c of contents) {
    if (cleaned.length === 0 && c.role !== 'user') continue;
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === c.role) {
      cleaned[cleaned.length - 1].parts[0].text += '\n\n' + c.parts[0].text;
    } else {
      cleaned.push(c);
    }
  }

  return cleaned;
}