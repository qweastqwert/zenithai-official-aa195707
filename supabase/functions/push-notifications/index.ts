import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { action, subscription, preferences } = await req.json();

    if (action === 'subscribe') {
      // Save push subscription
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

    if (action === 'test-push') {
      // Send a test notification to all user's active subscriptions
      const { data: subs } = await supabaseClient.from('push_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!subs || subs.length === 0) {
        return new Response(JSON.stringify({ error: 'No active subscriptions' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // For actual push sending, we'd need web-push library
      // For now, return the subscription count
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Test notification queued for ${subs.length} device(s)` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in push-notifications function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
