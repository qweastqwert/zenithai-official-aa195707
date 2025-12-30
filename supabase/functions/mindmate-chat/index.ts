import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get user from the request headers
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

    const { messages, maxTokens = 150, temperature = 0.7 } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    console.log('Processing MindMate chat request for user:', user.id);
    console.log('Messages count:', messages.length);

    // Fetch user's memories from MindArchive
    const { data: memories } = await supabaseClient
      .from('mind_archive')
      .select('memory_text, category')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Build memory context for AI
    const memoryContext = memories && memories.length > 0
      ? `\n\nIMPORTANT CONTEXT - User's MindArchive (key information from previous conversations):\n${memories.map(m => `- ${m.memory_text}${m.category ? ` [${m.category}]` : ''}`).join('\n')}`
      : '';

    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Prepare messages with memory context and tool instructions added to system message
    const toolInstructions = `

EMOTIONAL INTELLIGENCE & SUPPORT TOOLS:
After EACH user message, analyze their emotional state:
- Signs of stress/anxiety: tension, worry, overwhelm, racing thoughts, difficulty focusing
- Signs of crisis: suicidal thoughts, self-harm mentions, hopelessness, saying goodbye, discussing methods

When you detect stress/anxiety: Call show_breathing_exercise with appropriate cycles (1-5)
When you detect severe crisis/suicidal ideation: IMMEDIATELY call show_emergency_help with user's country

TEXT FORMATTING RULES:
Use these formatting patterns in your responses:
- Heading 1: *(text)* - wrap with single asterisk
- Heading 2: **(text)** - wrap with double asterisks  
- Heading 3: ***(text)*** - wrap with triple asterisks
- Bullet list: Start line with "* " followed by item text
- Numbered list: Use standard "1. ", "2. ", "3. " format

Example formatting:
*(Main Topic)*
Here's some text.

**(Subtopic)**
* First point
* Second point
* Third point

1. First step
2. Second step

IMPORTANT: 
- Separate headings from lists with blank lines
- Bullet lists use "* " (asterisk + space) at line start
- Numbered lists use normal "1. " format
- Indent list items properly`;

    const enhancedMessages = messages.map((msg: any, index: number) => {
      if (index === 0 && msg.role === 'system') {
        return {
          ...msg,
          content: msg.content + memoryContext + toolInstructions
        };
      }
      return msg;
    });

    // Tools for emotional intelligence and support
    const tools = [
      {
        type: "function",
        function: {
          name: "save_memory",
          description: "Save important information about the user to their MindArchive. Only use for significant insights like triggers, preferences, important life events, ongoing challenges, or valuable context. Do NOT save simple greetings, basic requests, or casual conversation.",
          parameters: {
            type: "object",
            properties: {
              memory_text: {
                type: "string",
                description: "The key information to remember about the user"
              },
              category: {
                type: "string",
                description: "Category of the memory (e.g., 'trigger', 'preference', 'challenge', 'goal', 'background')"
              }
            },
            required: ["memory_text", "category"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "show_breathing_exercise",
          description: "Display an interactive breathing exercise widget when the user shows signs of stress, anxiety, overwhelm, or needs calming. This helps them regulate their emotions through guided breathing.",
          parameters: {
            type: "object",
            properties: {
              cycles: {
                type: "number",
                description: "Number of breathing cycles to perform (default 3, range 1-5)"
              }
            },
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "show_emergency_help",
          description: "CRITICAL: Display emergency helpline widget ONLY when you detect clear signs of suicidal ideation, self-harm intent, or severe crisis. Signs include: explicit mentions of wanting to die, self-harm plans, feeling hopeless/worthless, saying goodbye, or discussing suicide methods. Be cautious and supportive.",
          parameters: {
            type: "object",
            properties: {
              country: {
                type: "string",
                description: "User's country code for appropriate helpline (US, UK, CA, AU, IN, or 'default')"
              }
            },
            required: ["country"]
          }
        }
      }
    ];

    // Call OpenRouter API with tool support
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zenith-ai.lovable.app',
        'X-Title': 'Zenith AI - MindMate',
      },
      body: JSON.stringify({
        model: 'xiaomi/mimo-v2-flash:free',
        messages: enhancedMessages,
        max_tokens: maxTokens,
        temperature,
        tools,
        tool_choice: "auto",
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const reply = choice?.message?.content || 'I apologize, but I had trouble generating a response. Please try again.';
    const tokensUsed = data.usage?.total_tokens || 0;

    // Handle tool calls
    const toolCalls = choice?.message?.tool_calls;
    const toolCallsData: any[] = [];
    
    if (toolCalls && toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          
          if (toolCall.function.name === 'save_memory') {
            const { error: memoryError } = await supabaseClient
              .from('mind_archive')
              .insert({
                user_id: user.id,
                memory_text: args.memory_text,
                category: args.category
              });
            
            if (memoryError) {
              console.error('Error saving memory:', memoryError);
            } else {
              console.log('Memory saved successfully:', args.category);
            }
          } else if (toolCall.function.name === 'show_breathing_exercise') {
            toolCallsData.push({
              type: 'breathing_exercise',
              cycles: args.cycles || 3
            });
            console.log('Breathing exercise triggered:', args.cycles || 3);
          } else if (toolCall.function.name === 'show_emergency_help') {
            toolCallsData.push({
              type: 'emergency_help',
              country: args.country || 'default'
            });
            console.log('Emergency help triggered:', args.country);
          }
        } catch (e) {
          console.error('Error processing tool call:', e);
        }
      }
    }

    // Log AI usage for analytics
    const { error: logError } = await supabaseClient
      .from('ai_usage')
      .insert({
        user_id: user.id,
        feature: 'mindmate',
        tokens_used: tokensUsed,
      });

    if (logError) {
      console.error('Error logging AI usage:', logError);
    }

    console.log('MindMate response generated successfully, tokens used:', tokensUsed);

    return new Response(JSON.stringify({ 
      reply,
      tokensUsed,
      toolCalls: toolCallsData.length > 0 ? toolCallsData : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in mindmate-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: 'I apologize, but I encountered an error. Please try again later.'
    }), {
      status: error.message.includes('Invalid user token') ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});