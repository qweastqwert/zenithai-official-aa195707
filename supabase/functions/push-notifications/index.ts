import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT = 'mailto:zenith-ai@notifications.app';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (e) {
    console.error('Failed to set VAPID details:', e);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, subscription, preferences, notification } = await req.json();

    if (action === 'get-vapid-key') {
      return new Response(JSON.stringify({ publicKey: VAPID_PUBLIC_KEY }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'subscribe') {
      const { endpoint, keys } = subscription;
      const { error } = await supabaseClient.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        is_active: true,
      }, { onConflict: 'user_id,endpoint' });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'unsubscribe') {
      const { endpoint } = subscription;
      await supabaseClient.from('push_subscriptions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('endpoint', endpoint);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update-preferences') {
      const { error } = await supabaseClient.from('notification_preferences').upsert({
        user_id: user.id,
        ...preferences,
      }, { onConflict: 'user_id' });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get-preferences') {
      const { data } = await supabaseClient.from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      return new Response(JSON.stringify({ preferences: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'test-push' || action === 'send-push') {
      if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: subs } = await supabaseClient.from('push_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!subs || subs.length === 0) {
        return new Response(JSON.stringify({ error: 'No active subscriptions found' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const payload = JSON.stringify(
        action === 'test-push'
          ? { title: 'Zenith AI 💜', body: 'Push notifications are working! Stay mindful.', tag: 'test' }
          : notification || { title: 'Zenith AI', body: 'Time for a wellness check-in!', tag: 'general' }
      );

      let sent = 0, failed = 0;
      for (const sub of subs) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          );
          sent++;
        } catch (err: any) {
          const status = err?.statusCode;
          if (status === 410 || status === 404) {
            await supabaseClient.from('push_subscriptions')
              .update({ is_active: false }).eq('id', sub.id);
          } else {
            console.error(`Push failed for sub ${sub.id}:`, status, err?.body);
          }
          failed++;
        }
      }

      return new Response(JSON.stringify({
        success: true, sent, failed,
        message: `Notification sent to ${sent}/${subs.length} device(s)`
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in push-notifications function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
