// Cap Core CAPTCHA endpoints: POST /cap/challenge and POST /cap/redeem
import { generateChallenge, validateChallenge } from "npm:capjs-core";
import { createClient } from "npm:@supabase/supabase-js@2";

const SECRET = Deno.env.get("CAP_SECRET")!;
const SCOPE = "zenith";
const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const path = new URL(req.url).pathname;

  try {
    if (path.endsWith("/challenge")) {
      return json(await generateChallenge(SECRET, { scope: SCOPE, instrumentation: true }));
    }

    if (path.endsWith("/redeem")) {
      const { token, solutions, instr } = await req.json();
      const result = await validateChallenge(
        SECRET,
        { token, solutions, instr },
        {
          scope: SCOPE,
          consumeNonce: async (sigHex: string, ttlMs: number) => {
            const { error } = await admin.from("cap_nonces").insert({
              sig: sigHex,
              expires_at: new Date(Date.now() + ttlMs).toISOString(),
            });
            return !error; // duplicate key => already used
          },
        },
      );
      if (!result.success) return json({ success: false, reason: result.reason }, 400);

      const { error } = await admin.from("cap_tokens").insert({
        token_key: result.tokenKey,
        expires_at: new Date(result.expires).toISOString(),
      });
      if (error) return json({ success: false, reason: "store_failed" }, 500);
      return json({ success: true, token: result.token, expires: result.expires });
    }

    return json({ error: "Not found" }, 404);
  } catch (e) {
    console.error("cap error", e);
    return json({ success: false, error: "Server error" }, 500);
  }
});
