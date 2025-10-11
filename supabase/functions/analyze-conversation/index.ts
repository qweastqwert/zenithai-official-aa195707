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

    console.log('Analyzing conversation for user:', user.id);

    // Save conversation to temporary storage if conversationId not provided
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

    const openaiApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Prepare conversation for analysis
    const conversationText = messages
      .filter((msg: any) => msg.role !== 'system')
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    // Use AI to extract key insights
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

Return your analysis as a JSON array of memory objects, each with "memory_text" and "category" fields. Only include memories that are genuinely significant. If there's nothing significant to remember, return an empty array.

Categories should be one of: "trigger", "preference", "challenge", "goal", "background", "relationship"

Conversation:
${conversationText}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zenith-ai.lovable.app',
        'X-Title': 'Zenith AI - Memory Analysis',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content || '{"memories":[]}';
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error('Failed to parse analysis:', analysisText);
      analysis = { memories: [] };
    }

    const memories = analysis.memories || [];
    console.log('Extracted memories:', memories.length);

    // Save memories to MindArchive
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

    // Mark conversation as analyzed
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
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
