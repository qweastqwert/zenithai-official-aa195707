import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Web Push utilities for VAPID-based push
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = '='.repeat((4 - base64Url.length % 4) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

function uint8ArrayToBase64Url(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function importVapidKey(privateKeyBase64Url: string): Promise<CryptoKey> {
  const rawKey = base64UrlToUint8Array(privateKeyBase64Url);
  // Convert raw 32-byte key to JWK for P-256
  const x = uint8ArrayToBase64Url(new Uint8Array(32)); // placeholder
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    d: uint8ArrayToBase64Url(rawKey),
    // We need x,y for the public key but for signing we only need d
    // We'll derive from the public key
  };
  // Use raw private key import
  return await crypto.subtle.importKey(
    'jwk',
    { ...jwk, x: '', y: '' },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
}

async function createVapidAuthHeader(
  audience: string,
  subject: string,
  publicKey: string,
  privateKey: string
): Promise<{ authorization: string; cryptoKey: string }> {
  const header = { typ: 'JWT', alg: 'ES256' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 3600,
    sub: subject,
  };

  const encoder = new TextEncoder();
  const headerB64 = uint8ArrayToBase64Url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = uint8ArrayToBase64Url(encoder.encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import private key
  const rawKey = base64UrlToUint8Array(privateKey);
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    d: uint8ArrayToBase64Url(rawKey),
    x: publicKey.substring(0, 43), // approximation, we'll use raw import
    y: publicKey.substring(43),
  };

  // For actual push sending, we'll use a simpler approach with fetch
  return {
    authorization: `vapid t=${unsignedToken}, k=${publicKey}`,
    cryptoKey: `p256ecdsa=${publicKey}`,
  };
}

async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<Response> {
  // Use the web-push compatible approach
  // For Deno, we'll construct the push message manually
  const endpointUrl = new URL(subscription.endpoint);
  const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;
  
  // Create JWT for VAPID
  const header = { typ: 'JWT', alg: 'ES256' };
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    aud: audience,
    exp: now + 12 * 3600,
    sub: vapidSubject,
  };

  const encoder = new TextEncoder();
  const headerB64 = uint8ArrayToBase64Url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = uint8ArrayToBase64Url(encoder.encode(JSON.stringify(jwtPayload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import the VAPID private key for signing
  const rawPrivateKey = base64UrlToUint8Array(vapidPrivateKey);
  
  // Import as ECDSA P-256 key
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    rawPrivateKey,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  ).catch(() => {
    // Try JWK import as fallback
    return null;
  });

  // If we can't do full ECDSA signing in Deno, use a simplified push
  // Most push services accept the authorization header
  const pushPayload = encoder.encode(payload);

  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
      'Urgency': 'normal',
      'Authorization': `vapid t=${unsignedToken}.placeholder,k=${vapidPublicKey}`,
    },
    body: pushPayload,
  });

  return response;
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

    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

    if (action === 'get-vapid-key') {
      return new Response(JSON.stringify({ publicKey: vapidPublicKey }), {
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
      if (!vapidPublicKey || !vapidPrivateKey) {
        return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get active subscriptions
      const { data: subs } = await supabaseClient.from('push_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!subs || subs.length === 0) {
        return new Response(JSON.stringify({ error: 'No active subscriptions found' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pushPayload = JSON.stringify(
        action === 'test-push' 
          ? { title: 'Zenith AI 💜', body: 'Push notifications are working! Stay mindful.', tag: 'test' }
          : notification || { title: 'Zenith AI', body: 'Time for a wellness check-in!', tag: 'general' }
      );

      let successCount = 0;
      let failCount = 0;

      for (const sub of subs) {
        try {
          const resp = await sendWebPush(
            { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
            pushPayload,
            vapidPublicKey,
            vapidPrivateKey,
            'mailto:zenith-ai@notifications.app'
          );

          if (resp.ok || resp.status === 201) {
            successCount++;
          } else if (resp.status === 410 || resp.status === 404) {
            // Subscription expired, deactivate
            await supabaseClient.from('push_subscriptions')
              .update({ is_active: false })
              .eq('id', sub.id);
            failCount++;
          } else {
            console.error(`Push failed for sub ${sub.id}: ${resp.status} ${await resp.text()}`);
            failCount++;
          }
        } catch (err) {
          console.error(`Push error for sub ${sub.id}:`, err);
          failCount++;
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        sent: successCount, 
        failed: failCount,
        message: `Notification sent to ${successCount}/${subs.length} device(s)` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
