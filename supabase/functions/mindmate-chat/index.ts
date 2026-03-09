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

    const { messages, maxTokens = 2048, temperature = 0.7, stream = false } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    console.log('Processing MindMate chat request for user:', user.id, 'streaming:', stream);

    // Fetch user's memories from MindArchive
    const { data: memories } = await supabaseClient
      .from('mind_archive')
      .select('memory_text, category')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const memoryContext = memories && memories.length > 0
      ? `\n\nIMPORTANT CONTEXT - User's MindArchive (key information from previous conversations):\n${memories.map(m => `- ${m.memory_text}${m.category ? ` [${m.category}]` : ''}`).join('\n')}`
      : '';

    // Fetch recent mood entries for context
    const { data: moodEntries } = await supabaseClient
      .from('mood_entries')
      .select('mood, reason, date, time')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const moodContext = moodEntries && moodEntries.length > 0
      ? `\n\nUSER'S RECENT MOOD DATA (use this for better understanding and tailored responses):\n${moodEntries.map(m => `- ${m.date} ${m.time}: Mood "${m.mood}"${m.reason ? ` - Reason: "${m.reason}"` : ''}`).join('\n')}`
      : '';

    // Fetch today's schedule events
    const today = new Date().toISOString().split('T')[0];
    const { data: scheduleEvents } = await supabaseClient
      .from('schedule_events')
      .select('title, start_time, end_time, category, is_completed')
      .eq('user_id', user.id)
      .eq('event_date', today)
      .order('start_time', { ascending: true });

    const scheduleContext = scheduleEvents && scheduleEvents.length > 0
      ? `\n\nUSER'S TODAY SCHEDULE (${today}):\n${scheduleEvents.map(e => `- ${e.start_time}${e.end_time ? `-${e.end_time}` : ''}: ${e.title} [${e.category}]${e.is_completed ? ' ✓ done' : ''}`).join('\n')}`
      : `\n\nUSER'S TODAY SCHEDULE: No events scheduled yet for today.`;

    // Fetch user's sleep profile
    const { data: sleepProfile } = await supabaseClient
      .from('sleep_profiles')
      .select('sleep_time, wake_time')
      .eq('user_id', user.id)
      .single();

    const sleepContext = sleepProfile
      ? `\n\nUSER'S SLEEP SCHEDULE: Bedtime ${sleepProfile.sleep_time}, Wake time ${sleepProfile.wake_time}`
      : '';

    // Fetch user profile for onboarding info
    const { data: userProfile } = await supabaseClient
      .from('profiles')
      .select('name, age, gender, hobbies, problems')
      .eq('user_id', user.id)
      .single();

    const profileContext = userProfile
      ? `\n\nUSER PROFILE: Name: ${userProfile.name}, Age: ${userProfile.age}, Hobbies: ${userProfile.hobbies || 'N/A'}, Challenges: ${userProfile.problems || 'N/A'}`
      : '';

    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

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

DAILY SCHEDULE PLANNING:
You have access to the user's daily schedule, mood logs, sleep times, and profile info.
When users ask you to plan their day, suggest activities, or manage their schedule:
- Use the add_schedule_events tool to propose events
- Consider their sleep schedule (don't suggest events during sleep hours)
- Consider their recent mood - if they've been stressed, include wellness breaks
- Consider their hobbies and challenges from their profile
- Always suggest realistic, balanced schedules with breaks
- Include wellness activities like meditation, breathing exercises, or journaling
- Ask for confirmation before adding - the tool will show a confirmation dialog

TEXT FORMATTING RULES:
Use these formatting patterns in your responses:
- Heading 1: *(text)* - wrap with single asterisk
- Heading 2: **(text)** - wrap with double asterisks  
- Heading 3: ***(text)*** - wrap with triple asterisks
- Bullet list: Start line with "* " followed by item text
- Numbered list: Use standard "1. ", "2. ", "3. " format

IMPORTANT: 
- Separate headings from lists with blank lines
- Bullet lists use "* " (asterisk + space) at line start
- Numbered lists use normal "1. " format
- Indent list items properly`;

    const enhancedMessages = messages.map((msg: any, index: number) => {
      if (index === 0 && msg.role === 'system') {
        return { ...msg, content: msg.content + memoryContext + moodContext + scheduleContext + sleepContext + profileContext + toolInstructions };
      }
      return msg;
    });

    const tools = [
      {
        type: "function",
        function: {
          name: "save_memory",
          description: "Save important information about the user to their MindArchive. Only use for significant insights like triggers, preferences, important life events, ongoing challenges, or valuable context. Do NOT save simple greetings, basic requests, or casual conversation.",
          parameters: {
            type: "object",
            properties: {
              memory_text: { type: "string", description: "The key information to remember about the user" },
              category: { type: "string", description: "Category of the memory (e.g., 'trigger', 'preference', 'challenge', 'goal', 'background')" }
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
              intensity: { type: "string", enum: ["light", "moderate", "deep"] },
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
              intensity: { type: "string", enum: ["quick", "guided", "deep"] },
              customIntro: { type: "string" }
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
              prompt: { type: "string" },
              category: { type: "string", enum: ["gratitude", "awareness", "reflection", "calm"] },
              intensity: { type: "string", enum: ["brief", "guided", "deep"] },
              customMessage: { type: "string" }
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
              category: { type: "string", enum: ["self-love", "anxiety", "motivation", "general"] },
              intensity: { type: "string", enum: ["single", "series", "deep"] },
              customAffirmation: { type: "string" }
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
              intensity: { type: "string", enum: ["quick", "standard", "thorough"] },
              customIntro: { type: "string" }
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
          description: "Suggest soothing music when user needs relief, relaxation, focus for work/study, calming down, energy boost, or help sleeping.",
          parameters: {
            type: "object",
            properties: {
              mood: { type: "string", enum: ["relaxation", "focus", "calm", "energy", "sleep"] },
              customMessage: { type: "string" }
            },
            required: ["mood"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "add_schedule_events",
          description: "Propose schedule events to add to the user's daily schedule. Use when user asks to plan their day, add tasks, or organize their routine. Events will be shown to the user for confirmation before being added.",
          parameters: {
            type: "object",
            properties: {
              events: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Event title" },
                    description: { type: "string", description: "Brief description" },
                    start_time: { type: "string", description: "Start time in HH:MM 24h format" },
                    end_time: { type: "string", description: "End time in HH:MM 24h format (optional)" },
                    category: { type: "string", enum: ["task", "wellness", "exercise", "meal", "study", "mindmate"], description: "Event category" }
                  },
                  required: ["title", "start_time", "category"]
                },
                description: "Array of events to propose"
              },
              date: { type: "string", description: "Date for events in YYYY-MM-DD format. Defaults to today." }
            },
            required: ["events"]
          }
        }
      }
    ];

    // NON-STREAMING: use tools, return JSON
    if (!stream) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://zenith-ai.lovable.app',
          'X-Title': 'Zenith AI - MindMate',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-nano-30b-a3b:free',
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
                .insert({ user_id: user.id, memory_text: args.memory_text, category: args.category });
              if (memoryError) console.error('Error saving memory:', memoryError);
              else console.log('Memory saved:', args.category);
            } else if (toolCall.function.name === 'add_schedule_events') {
              toolCallsData.push({ type: 'schedule_events', events: args.events, date: args.date });
            } else {
              const typeMap: Record<string, string> = {
                'show_breathing_exercise': 'breathing_exercise',
                'show_grounding_exercise': 'grounding_exercise',
                'show_mindfulness_prompt': 'mindfulness_prompt',
                'show_affirmations': 'affirmations',
                'show_muscle_relaxation': 'muscle_relaxation',
                'show_emergency_help': 'emergency_help',
                'suggest_music': 'music_suggestion',
              };
              toolCallsData.push({ type: typeMap[toolCall.function.name] || toolCall.function.name, ...args });
            }
          } catch (e) {
            console.error('Error processing tool call:', e);
          }
        }
      }

      // Log AI usage
      await supabaseClient.from('ai_usage').insert({
        user_id: user.id, feature: 'mindmate', tokens_used: tokensUsed,
      }).then(({ error }) => { if (error) console.error('Error logging AI usage:', error); });

      return new Response(JSON.stringify({ 
        reply, tokensUsed,
        toolCalls: toolCallsData.length > 0 ? toolCallsData : undefined
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STREAMING: no tools, return SSE stream
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zenith-ai.lovable.app',
        'X-Title': 'Zenith AI - MindMate',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-nano-30b-a3b:free',
        messages: enhancedMessages,
        max_tokens: maxTokens,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter streaming error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    // Log usage estimate for streaming
    await supabaseClient.from('ai_usage').insert({
      user_id: user.id, feature: 'mindmate', tokens_used: 0,
    }).then(({ error }) => { if (error) console.error('Error logging AI usage:', error); });

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
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
