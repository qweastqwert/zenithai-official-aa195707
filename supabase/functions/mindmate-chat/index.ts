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
- Signs of needing relief: tired, exhausted, need a break, wanting to relax, seeking calm
- Signs of work/focus needs: studying, working, need to concentrate, preparing for tasks, deadlines

When you detect stress/anxiety: Call show_breathing_exercise with appropriate cycles (1-5)
When you detect severe crisis/suicidal ideation: IMMEDIATELY call show_emergency_help with user's country
When you detect user needs relief/relaxation: Call suggest_music with mood='relaxation' or 'calm'
When you detect user preparing for work/study: Call suggest_music with mood='focus'
When user mentions being tired or needing energy: Call suggest_music with mood='energy'
When user mentions sleep or bedtime: Call suggest_music with mood='sleep'

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
          description: "Display an interactive breathing exercise widget. Customize based on user's stress level.",
          parameters: {
            type: "object",
            properties: {
              cycles: { type: "number", description: "Number of cycles (1-5)" },
              intensity: { type: "string", enum: ["light", "moderate", "deep"], description: "light for mild stress, moderate for general anxiety, deep for severe stress" },
              customMessage: { type: "string", description: "Personalized message based on user's situation" }
            },
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "show_grounding_exercise",
          description: "Display 5-4-3-2-1 grounding exercise for disconnection, panic, or overwhelm.",
          parameters: {
            type: "object",
            properties: {
              intensity: { type: "string", enum: ["quick", "guided", "deep"], description: "quick for mild, guided for moderate, deep for severe dissociation" },
              customIntro: { type: "string", description: "Personalized introduction based on user's state" }
            },
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "show_mindfulness_prompt",
          description: "Display mindfulness reflection prompt for introspection or present-moment awareness.",
          parameters: {
            type: "object",
            properties: {
              prompt: { type: "string", description: "Custom mindfulness prompt tailored to user" },
              category: { type: "string", enum: ["gratitude", "awareness", "reflection", "calm"], description: "Category based on what user needs" },
              intensity: { type: "string", enum: ["brief", "guided", "deep"], description: "Depth of reflection" },
              customMessage: { type: "string", description: "Personalized context message" }
            },
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "show_affirmations",
          description: "Display positive affirmation cards tailored to emotional state.",
          parameters: {
            type: "object",
            properties: {
              category: { type: "string", enum: ["self-love", "anxiety", "motivation", "general"], description: "Category based on user's needs" },
              intensity: { type: "string", enum: ["single", "series", "deep"], description: "single for quick boost, series for moderate, deep for thorough" },
              customAffirmation: { type: "string", description: "A personalized affirmation for the user's specific situation" }
            },
            required: ["category"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "show_muscle_relaxation",
          description: "Display progressive muscle relaxation for physical tension or sleep issues.",
          parameters: {
            type: "object",
            properties: {
              intensity: { type: "string", enum: ["quick", "standard", "thorough"], description: "quick for mild tension, standard for moderate, thorough for severe" },
              customIntro: { type: "string", description: "Personalized introduction for the user" }
            },
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "show_emergency_help",
          description: "CRITICAL: Display emergency helpline widget for suicidal ideation or self-harm.",
          parameters: {
            type: "object",
            properties: {
              country: { type: "string", description: "User's country code (US, UK, CA, AU, IN, or 'default')" }
            },
            required: ["country"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "suggest_music",
          description: "Suggest soothing music when user needs relief, relaxation, focus for work/study, calming down, energy boost, or help sleeping. Use this when detecting stress relief needs, work/study preparation, or requests for calming content.",
          parameters: {
            type: "object",
            properties: {
              mood: { 
                type: "string", 
                enum: ["relaxation", "focus", "calm", "energy", "sleep"],
                description: "relaxation for stress relief, focus for work/study, calm for anxiety, energy for motivation, sleep for bedtime"
              },
              customMessage: { 
                type: "string", 
                description: "Personalized message explaining why this music might help based on user's situation" 
              }
            },
            required: ["mood"]
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
              cycles: args.cycles || 3,
              intensity: args.intensity || 'moderate',
              customMessage: args.customMessage
            });
            console.log('Breathing exercise triggered:', args);
          } else if (toolCall.function.name === 'show_grounding_exercise') {
            toolCallsData.push({
              type: 'grounding_exercise',
              intensity: args.intensity || 'guided',
              customIntro: args.customIntro
            });
            console.log('Grounding exercise triggered:', args);
          } else if (toolCall.function.name === 'show_mindfulness_prompt') {
            toolCallsData.push({
              type: 'mindfulness_prompt',
              prompt: args.prompt,
              category: args.category || 'awareness',
              intensity: args.intensity || 'guided',
              customMessage: args.customMessage
            });
            console.log('Mindfulness prompt triggered:', args);
          } else if (toolCall.function.name === 'show_affirmations') {
            toolCallsData.push({
              type: 'affirmations',
              category: args.category || 'general',
              intensity: args.intensity || 'series',
              customAffirmation: args.customAffirmation
            });
            console.log('Affirmations triggered:', args);
          } else if (toolCall.function.name === 'show_muscle_relaxation') {
            toolCallsData.push({
              type: 'muscle_relaxation',
              intensity: args.intensity || 'standard',
              customIntro: args.customIntro
            });
            console.log('Muscle relaxation triggered:', args);
          } else if (toolCall.function.name === 'show_emergency_help') {
            toolCallsData.push({
              type: 'emergency_help',
              country: args.country || 'default'
            });
            console.log('Emergency help triggered:', args);
          } else if (toolCall.function.name === 'suggest_music') {
            toolCallsData.push({
              type: 'music_suggestion',
              mood: args.mood || 'calm',
              customMessage: args.customMessage
            });
            console.log('Music suggestion triggered:', args);
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