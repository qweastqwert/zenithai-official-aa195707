import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { timeframe, moodData, journalData, usageStats } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Based on the following user wellness data from the ${timeframe} period, provide a single, concise, and actionable wellness tip (max 20 words):

Mood Data: ${moodData || 'No mood data available'}
Journal Insights: ${journalData || 'No journal entries'}
AI Usage: ${usageStats?.mindMateUsage || 0} sessions
Activity Level: ${usageStats?.totalSessions || 0} total wellness interactions

Guidelines:
- Keep it positive and encouraging
- Make it actionable
- Focus on mental wellness
- Be supportive, not prescriptive
- Use encouraging emojis sparingly (max 1)`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive mental wellness coach. Provide brief, actionable, and encouraging tips based on user data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate tip');
    }

    const data = await response.json();
    const tip = data.choices[0]?.message?.content?.trim() || 'Keep nurturing your mental wellness journey! 🌱';

    console.log('Generated AI tip:', tip);

    return new Response(JSON.stringify({ tip }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating AI tip:', error);
    
    // Fallback tips based on timeframe
    const fallbackTips = {
      weekly: 'Focus on small daily wins - they build momentum for bigger changes! 💪',
      monthly: 'Reflect on your progress and celebrate how far you\'ve come this month! 🌟'
    };
    
    const fallbackTip = fallbackTips[req.body?.timeframe as keyof typeof fallbackTips] || 
                      'Remember: every step forward is progress, no matter how small! ✨';

    return new Response(JSON.stringify({ tip: fallbackTip }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});