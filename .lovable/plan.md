

## Plan: Fix Borders, Dashboard Re-mount Reloads, Schedule Animations & Community Posts

### 1. Remove Purple Borders (Mobile + General)

**Cause**: `src/App.css` adds `padding: 2rem` on `#root` for desktop and `max-width: 1280px` centering, which combined with body background creates side gutters that look like a "purple border". Some sub-pages (Community, SleepTracking, BreathingExercises, DailySchedule) use full-width `bg-background`, but the `#root` desktop padding still pushes them inward.

**Fix**: In `src/App.css`, remove the `2rem` padding for desktop and remove `max-width: 1280px` constraint (let pages own their max-width). Also drop `text-align: center` on `#root` since it's a global anti-pattern.

### 2. Stop Dashboard Re-mount (intro animation + mood prompt re-firing)

**Cause**: Sub-pages (`/community`, `/sleep-tracking`, `/breathing-exercises`, `/daily-schedule`, `/mood-tracking`) are separate routes. When the user navigates back to `/chat`, `ChatInterface` fully remounts → `showIntro` resets to `true`, mood prompt re-fires, sleep prompt re-fires.

**Fix (two-part)**:

**a) Persist intro state across mounts** in `ChatInterface.tsx`:
- Initialize `showIntro` from `sessionStorage.getItem('zenith-chat-intro-shown')`. Set the flag once intro completes. So subsequent mounts skip the 3s intro animation.
- Same persistence for mood prompt: only show once per session/4h window (it already uses cookie — check that the timer doesn't re-fire when cookie was just set; gate the `setTimeout` properly).
- Same for sleep prompt: add a `sessionStorage` flag `zenith-sleep-prompt-shown`.

**b) Update sub-page back buttons** to navigate to `/chat` explicitly (they already do via `<Link to="/chat">`), so no changes needed there — the persistence above is what fixes the perceived "reload".

### 3. Daily Schedule Page — Add Animations

In `src/components/schedule/DailySchedule.tsx` and `src/pages/DailySchedule.tsx`:
- Wrap the page in a `motion.div` with fade+slide-up enter (`initial={{ opacity: 0, y: 20 }}`).
- Wrap calendar, header, and event card with staggered `motion` children using framer-motion variants.
- Add `AnimatePresence` around the `EventList` so adding/removing events animates.
- Animate dialog opening with the existing Radix transitions (already present) — just ensure the Add Event dialog content uses motion fade.

### 4. Community Posts "Fail to Load"

**Likely cause**: `useCommunityPosts.fetchPosts` queries `community_posts` directly. If RLS requires authentication or a specific policy, anonymous/unauth or session-mismatched calls silently fail and toast errors. Also the hook subscribes to `sharedPosts` and may show stale empty state.

**Fix**:
- Add proper error logging that surfaces the Supabase error message in the toast (currently swallows it).
- Guard `fetchPosts` to wait until `useAuth` has resolved (currently it runs immediately and may race with auth init).
- Add a "Retry" button in the empty/error state in `CommunitySupport.tsx`.
- Verify RLS policy on `community_posts` allows authenticated SELECT (run a quick check via Supabase tools post-approval).

### 5. Sub-page Background Consistency

Pages with the colored header (Community, SleepTracking, BreathingExercises, DailySchedule, MoodTracking) use `bg-primary` headers — once `#root` padding is removed they'll go edge-to-edge correctly. No further changes required beyond Step 1.

### Files to Edit
- `src/App.css` — remove root padding/max-width (purple border fix)
- `src/components/ChatInterface.tsx` — persist intro/sleep prompt across mounts via sessionStorage
- `src/components/schedule/DailySchedule.tsx` — add framer-motion enter/stagger animations
- `src/pages/DailySchedule.tsx` — wrap header in motion
- `src/hooks/useCommunityPosts.ts` — better error reporting, await auth
- `src/components/community/CommunitySupport.tsx` — add retry button on empty/error

### Files to Create
- None

