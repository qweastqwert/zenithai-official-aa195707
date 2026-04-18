import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
webpush.setVapidDetails('mailto:zenith-ai@notifications.app', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Returns HH:MM in user's timezone
function localHHMM(tz: string): string {
  try {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
    });
    return fmt.format(new Date());
  } catch {
    return new Date().toISOString().slice(11, 16);
  }
}

// Returns YYYY-MM-DD in user's timezone
function localDate(tz: string): string {
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    });
    return fmt.format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function pushToUser(
  admin: ReturnType<typeof createClient>,
  userId: string,
  payload: { title: string; body: string; tag: string }
) {
  const { data: subs } = await admin.from('push_subscriptions')
    .select('*').eq('user_id', userId).eq('is_active', true);
  if (!subs?.length) return 0;

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload)
      );
      sent++;
    } catch (err: any) {
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        await admin.from('push_subscriptions').update({ is_active: false }).eq('id', sub.id);
      } else {
        console.error('push fail', userId, err?.statusCode, err?.body);
      }
    }
  }
  return sent;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Load all users with prefs + push enabled
    const { data: prefs } = await admin.from('notification_preferences')
      .select('*').eq('push_enabled', true);

    if (!prefs?.length) {
      return new Response(JSON.stringify({ checked: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let totalSent = 0;
    const fired: string[] = [];

    for (const p of prefs) {
      const tz = p.timezone || 'Asia/Kolkata';
      const nowHHMM = localHHMM(tz);

      // Mood reminder
      if (p.mood_reminder_time && p.mood_reminder_time.slice(0, 5) === nowHHMM) {
        const n = await pushToUser(admin, p.user_id, {
          title: 'Mood Check 💜',
          body: 'How are you feeling right now? Take a moment to track your mood.',
          tag: 'mood-reminder',
        });
        totalSent += n;
        fired.push(`mood:${p.user_id}`);
      }

      // Journal reminder
      if (p.journal_reminder_time && p.journal_reminder_time.slice(0, 5) === nowHHMM) {
        const n = await pushToUser(admin, p.user_id, {
          title: 'Evening Reflection 📝',
          body: "It's time for your daily journal. Reflect on your day.",
          tag: 'journal-reminder',
        });
        totalSent += n;
        fired.push(`journal:${p.user_id}`);
      }

      // Sleep reminder (15 min before sleep_time, plus wake reminder)
      if (p.sleep_reminder_enabled) {
        const { data: sp } = await admin.from('sleep_profiles')
          .select('sleep_time, wake_time').eq('user_id', p.user_id).maybeSingle();
        if (sp) {
          // 15 minutes before sleep_time
          const [sh, sm] = sp.sleep_time.split(':').map(Number);
          const total = sh * 60 + sm - 15;
          const bh = ((Math.floor(total / 60) % 24) + 24) % 24;
          const bm = ((total % 60) + 60) % 60;
          const bedtimeWarn = `${String(bh).padStart(2,'0')}:${String(bm).padStart(2,'0')}`;
          if (bedtimeWarn === nowHHMM) {
            totalSent += await pushToUser(admin, p.user_id, {
              title: 'Time to Wind Down 🌙',
              body: 'Bedtime is in 15 minutes. Start your sleep routine!',
              tag: 'sleep-reminder',
            });
            fired.push(`sleep:${p.user_id}`);
          }
          if (sp.wake_time.slice(0, 5) === nowHHMM) {
            totalSent += await pushToUser(admin, p.user_id, {
              title: 'Good Morning ☀️',
              body: 'How did you sleep? Log your sleep quality.',
              tag: 'wake-reminder',
            });
            fired.push(`wake:${p.user_id}`);
          }
        }
      }
    }

    return new Response(JSON.stringify({ checked: prefs.length, sent: totalSent, fired }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('scheduler error', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
