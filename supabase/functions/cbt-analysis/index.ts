import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) throw new Error('Invalid user token');

    // Gather data (last 30 days)
    const since = new Date(Date.now() - 30 * 86400_000).toISOString().split('T')[0];
    const [moods, journals, sleep, plans] = await Promise.all([
      supabase.from('mood_entries').select('date, mood, reason, context_tags').eq('user_id', user.id).gte('date', since).order('date', { ascending: false }).limit(200),
      supabase.from('journal_entries').select('date, mood, content').eq('user_id', user.id).gte('date', since).order('date', { ascending: false }).limit(30),
      supabase.from('sleep_logs').select('date, sleep_quality').eq('user_id', user.id).gte('date', since).order('date', { ascending: false }).limit(30),
      supabase.from('treatment_plans').select('title, description, goals, status').eq('user_id', user.id).eq('status', 'active').limit(3),
    ]);

    const summary = {
      moods: moods.data || [],
      journals: (journals.data || []).map(j => ({ ...j, content: (j.content || '').slice(0, 300) })),
      sleep: sleep.data || [],
      activePlans: plans.data || [],
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const systemPrompt = `You are a clinical mental-health assistant trained in Cognitive Behavioral Therapy (CBT).
You will analyze the user's mood, journal, and sleep data from the last 30 days and produce a structured CBT-informed clinical analysis.

STRICTLY output valid JSON matching this schema (no extra prose, no markdown fences):
{
  "clinical_overview": "2-3 sentence professional summary of the user's current state",
  "cognitive_patterns": ["identified thinking patterns e.g. catastrophizing, rumination"],
  "behavioral_patterns": ["observed behaviors from data"],
  "cognitive_distortions": ["specific distortions with brief evidence"],
  "strengths": ["positive patterns and coping"],
  "risk_indicators": ["any signs of concern; empty array if none"],
  "recommendations": ["3-5 CBT-based actionable next steps"],
  "suggested_goals": [{"title": "short goal", "rationale": "why it matters", "measurable": "how to measure progress"}]
}

Never diagnose. Frame findings as observations. Be warm but clinical. If data is sparse, say so in clinical_overview.`;

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the user's data (JSON):\n\n${JSON.stringify(summary)}` },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error('Gateway error:', resp.status, t);
      return new Response(JSON.stringify({ error: `AI gateway error ${resp.status}` }), { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await resp.json();
    const raw = data.choices?.[0]?.message?.content ?? '{}';
    let parsed: any = {};
    try { parsed = JSON.parse(raw); } catch { parsed = { clinical_overview: raw }; }

    return new Response(JSON.stringify({ analysis: parsed, dataStats: {
      moodCount: summary.moods.length,
      journalCount: summary.journals.length,
      sleepCount: summary.sleep.length,
    } }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('cbt-analysis error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});