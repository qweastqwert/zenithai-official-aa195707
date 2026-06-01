
-- PIN reset request expiry
ALTER TABLE public.pin_reset_requests
  ADD COLUMN IF NOT EXISTS expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours');

-- One active pending request per user. Expired requests must be flipped to 'expired' by the app/edge before a new one is created.
CREATE UNIQUE INDEX IF NOT EXISTS pin_reset_requests_one_pending_per_user
  ON public.pin_reset_requests (user_id)
  WHERE status = 'pending';

-- Mood contextual tags
ALTER TABLE public.mood_entries
  ADD COLUMN IF NOT EXISTS context_tags text[] NOT NULL DEFAULT '{}'::text[];

-- Emergency contact for SOS template
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS emergency_contact_name text,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone text;
