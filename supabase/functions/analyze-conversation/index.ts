import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { conversationId, messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 200) {
      return new Response(JSON.stringify({ error: 'Invalid messages array', success: false }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    for (const m of messages) {
      if (!m || typeof m.content !== 'string' || m.content.length > 10000) {
        return new Response(JSON.stringify({ error: 'Invalid message content', success: false }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log('Analyzing conversation for user:', user.id);

    let convId = conversationId;
    if (!convId) {
      const { data: conversation, error: saveError } = await supabaseClient
        .from('conversation_history')
        .insert({
          user_id: user.id,
          messages: messages,
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving conversation:', saveError);
        throw saveError;
      }
      convId = conversation.id;
      console.log('Conversation saved with ID:', convId);
    }

    const googleApiKey = Deno.env.get('GOOGLE_AI_STUDIO_API_KEY');
    if (!googleApiKey) {
      throw new Error('Google AI Studio API key not configured');
    }

    const conversationText = messages
      .filter((msg: any) => msg.role !== 'system')
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const analysisPrompt = `Analyze the following conversation and extract ONLY truly significant information about the user that should be remembered for future conversations. 

Focus on:
- Significant emotional triggers or trauma (only major ones)
- Important personal preferences or values
- Ongoing challenges or goals that were discussed in depth
- Key life events or circumstances mentioned
- Important relationships or situations affecting them

DO NOT extract:
- Simple greetings or casual small talk
- Basic questions or simple requests
- Generic responses
- Temporary moods or fleeting thoughts
- Surface-level comments

Return your analysis as a JSON object with a "memories" array, each item having "memory_text" and "category" fields. Only include memories that are genuinely significant. If there's nothing significant to remember, return {"memories":[]}.

Categories should be one of: "trigger", "preference", "challenge", "goal", "background", "relationship"

Conversation:
${conversationText}`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${googleApiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI Studio API error:', response.status, errorText);
      throw new Error(`Google AI Studio API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{"memories":[]}';
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error('Failed to parse analysis:', analysisText);
      analysis = { memories: [] };
    }

    const memories = analysis.memories || [];
    console.log('Extracted memories:', memories.length);

    let savedCount = 0;
    if (Array.isArray(memories) && memories.length > 0) {
      for (const memory of memories) {
        if (memory.memory_text && memory.memory_text.trim()) {
          const { error: memoryError } = await supabaseClient
            .from('mind_archive')
            .insert({
              user_id: user.id,
              memory_text: memory.memory_text,
              category: memory.category || 'background'
            });

          if (memoryError) {
            console.error('Error saving memory:', memoryError);
          } else {
            savedCount++;
          }
        }
      }
    }

    await supabaseClient
      .from('conversation_history')
      .update({ analyzed: true })
      .eq('id', convId);

    console.log(`Analysis complete. Saved ${savedCount} memories.`);

    return new Response(JSON.stringify({ 
      success: true,
      memoriesExtracted: savedCount,
      conversationId: convId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-conversation function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});