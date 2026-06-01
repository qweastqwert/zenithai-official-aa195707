-- 1) Mark journal entries as private
ALTER TABLE public.journal_entries
  ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;

-- 2) Journal Private Space PIN (dev-reset only)
CREATE TABLE IF NOT EXISTS public.journal_private_pins (
  user_id uuid PRIMARY KEY,
  pin_hash text NOT NULL,
  salt text NOT NULL,
  failed_attempts int NOT NULL DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.journal_private_pins TO authenticated;
GRANT ALL ON public.journal_private_pins TO service_role;

ALTER TABLE public.journal_private_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PIN"
  ON public.journal_private_pins FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can set their own PIN once"
  ON public.journal_private_pins FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
-- Intentionally NO update/delete policies: PIN reset requires developer (service_role).

-- 3) Leaderboard RPC
CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit int DEFAULT 50)
RETURNS TABLE(
  user_id uuid,
  display_name text,
  total_days_used int,
  longest_streak int,
  achievements_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.user_id,
    COALESCE(NULLIF(p.username, ''), 'Zen-' || substr(a.user_id::text, 1, 4)) AS display_name,
    a.total_days_used,
    GREATEST(
      a.mindmate_streak,
      a.journal_streak,
      a.mood_streak,
      a.meditation_streak,
      a.sleep_streak
    ) AS longest_streak,
    (SELECT count(*) FROM public.user_achievements ua WHERE ua.user_id = a.user_id) AS achievements_count
  FROM public.user_activity_data a
  LEFT JOIN public.profiles p ON p.user_id = a.user_id
  ORDER BY achievements_count DESC, longest_streak DESC, total_days_used DESC
  LIMIT GREATEST(1, LEAST(_limit, 200));
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard(int) TO authenticated;