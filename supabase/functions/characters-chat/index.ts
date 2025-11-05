import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, maxTokens, temperature } = await req.json();
    console.log('Processing Characters chat request');
    console.log('Messages count:', messages?.length);

    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterApiKey) {
      console.error('OPENROUTER_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zenith-ai.lovable.app',
        'X-Title': 'Zenith AI - Characters Chat',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick:free',
        messages: messages,
        max_tokens: maxTokens || 800,
        temperature: temperature || 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm having trouble responding right now.";
    
    console.log('Characters chat response generated successfully');

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
