## Scope

Seven related changes spanning achievements, journal, meditation, nav, and a small homepage fix.

### 1. Night Owl achievement — local-time correctness
- `useAchievements.ts > checkTimeBasedEasterEgg` already uses `Date.getHours()` (local), but the achievement is *evaluated on every render*, so once the user opens the app at 2–4 AM it gets unlocked + synced to cloud, and the next morning `isCloudUnlocked('night-owl')` makes the toast/notification re-fire as if "just earned".
- Fix: split "currently in window" from "already unlocked". Only trigger the unlock notification when `checkTimeBasedEasterEgg()` is true; show the badge as already-earned (no toast) when only `isCloudUnlocked` is true. Track last-notified id in localStorage so refreshes don't re-toast. Same treatment for `time-traveler`.

### 2. Achievements menu + rewards + leaderboard
- Revamp `src/components/achievements/Achievements.tsx`:
  - Tabs: Overview · All · Rewards · Leaderboard · Insights.
  - Overview: level ring, EXP bar, next milestone, top 3 nearly-complete.
  - All: filter chips (Streak / Milestone / Special / Easter-egg), rarity color borders, animated unlock badges.
  - Rewards: spendable-points shop using EXP (cosmetic only — theme accents, profile frames, sound-pack toggles). Persist redemptions in `localStorage` under `zenith_rewards_v1` (no schema change needed; cosmetic).
  - Leaderboard: new `public.leaderboard_entries` view + table? Simpler: aggregate from `user_activity_data` + achievements count. Create a SECURITY DEFINER RPC `get_leaderboard(limit)` returning `display_name, level, total_exp, achievements_count` for the top N. Show user's own rank highlighted. Names masked unless user has set a public `username` in profiles.
  - Insights: pull from existing mood/journal hooks — top mood, mood trend (7d), most common journal time-of-day, dominant journal sentiment proxy (mood field), streak summary. Pure client aggregation.

### 3. Journal Private Space (PIN-locked)
- New table `journal_private_pins`:
  - `user_id uuid PK`, `pin_hash text`, `salt text`, `created_at`, `failed_attempts int default 0`, `locked_until timestamptz null`.
  - RLS: user can SELECT/INSERT own row; UPDATE only via RPC `verify_and_update_journal_pin`. No client-side UPDATE/DELETE policy → forces dev reset.
- Add `is_private boolean default false` to `journal_entries`.
- UI:
  - JournalWriteView: toggle "Private entry" (lock icon).
  - JournalHistoryView: filter excludes private entries unless inside Private Space.
  - New `PrivateSpaceGate` component: prompts to set PIN first time, then asks PIN. 5 wrong attempts → 1 hour lockout. Reset only via "Contact developer" mailto with account info.
- Sanity: hash PIN client-side with SHA-256(salt + pin) before sending; store hash only.

### 4. Meditation Center — more joyful
- Update `src/pages/Meditation.tsx` + `MeditationTimer.tsx`:
  - Warm sunrise backdrop + gentle floating orbs (reuse `.bg-sunrise-warm`, `animate-soft-breathe`).
  - Friendly intro card with rotating affirmation.
  - Preset cards (Calm 5m, Focus 10m, Sleep 15m, Gratitude 3m) with emoji + soft gradient.
  - Completion celebration: confetti-lite (CSS), kind one-liner, EXP +25.

### 5. Restore Breathing Exercises tile on dashboard
- `ChatInterface.tsx` desktop feature cards + mobile quick actions: ensure a "Breathing" lively-card linking to `/breathing` is present (it was lost in the warm redesign sweep). Verify mobile grid still includes it.

### 6. Mobile navigation — give it room to breathe
- `MobileNavigation.tsx`: 8 items in one row at 9px font is squished on small phones.
  - Reduce to 5 primary items: Home, MindMate, Journal, Mood, More.
  - "More" opens a bottom sheet with the rest (Meditate, Sleep, Breathing, Rewards, Settings).
  - Bump icon to 5x5, label to 10px, taller hit area, rounded-2xl active pill.
  - Hide labels under 360px (icon-only) for ultra-small screens.

### 7. Wiring + memory
- Update `mem://index.md` core to note: local-time gating for time-based achievements; private-journal PIN flow is dev-reset only; mobile nav uses 5+More pattern.

## Technical notes

- New migration:
  ```sql
  ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;

  CREATE TABLE public.journal_private_pins (
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
  CREATE POLICY "own pin select" ON public.journal_private_pins FOR SELECT TO authenticated USING (auth.uid() = user_id);
  CREATE POLICY "own pin insert" ON public.journal_private_pins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  -- No UPDATE/DELETE policies → only service_role (dev) can reset.

  -- Leaderboard RPC (SECURITY DEFINER, returns top N with masked names)
  CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit int DEFAULT 50)
  RETURNS TABLE(user_id uuid, display_name text, total_days_used int, longest_streak int, achievements_count bigint)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT
      a.user_id,
      COALESCE(NULLIF(p.username,''), 'Zen-' || substr(a.user_id::text,1,4)) as display_name,
      a.total_days_used,
      GREATEST(a.mindmate_streak, a.journal_streak, a.mood_streak, a.meditation_streak, a.sleep_streak) as longest_streak,
      (SELECT count(*) FROM public.user_achievements ua WHERE ua.user_id = a.user_id) as achievements_count
    FROM public.user_activity_data a
    LEFT JOIN public.profiles p ON p.user_id = a.user_id
    ORDER BY achievements_count DESC, longest_streak DESC, total_days_used DESC
    LIMIT _limit;
  $$;
  GRANT EXECUTE ON FUNCTION public.get_leaderboard(int) TO authenticated;
  ```
- Hashing: `crypto.subtle.digest('SHA-256', utf8(salt + pin))`.
- No edge-function changes needed.

## Files to create
- `src/components/achievements/RewardsShop.tsx`
- `src/components/achievements/Leaderboard.tsx`
- `src/components/achievements/InsightsPanel.tsx`
- `src/components/journal/PrivateSpaceGate.tsx`
- `src/hooks/useJournalPin.ts`
- `src/hooks/useLeaderboard.ts`
- One new migration file

## Files to edit
- `src/hooks/useAchievements.ts` (time gating + toast dedupe)
- `src/components/achievements/Achievements.tsx` (tabs, rewards, leaderboard, insights)
- `src/components/journal/JournalWriteView.tsx` (private toggle)
- `src/components/journal/JournalHistoryView.tsx` (filter + entry to Private Space)
- `src/components/Journal.tsx` (add Private tab/route)
- `src/hooks/useJournalSupabase.ts` (pass `is_private` through)
- `src/pages/Meditation.tsx` + `src/components/MeditationTimer.tsx` (joyful)
- `src/components/ChatInterface.tsx` (restore Breathing card)
- `src/components/navigation/MobileNavigation.tsx` (5 + More pattern)
- `mem://index.md`

This is large; I'll implement in order: migration → achievements fix → mobile nav → breathing tile → meditation polish → private journal → achievements revamp.