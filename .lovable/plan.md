# Plan

Large scope — grouping into 5 work areas. I'll implement sequentially in one pass after approval.

## 1. PIN Reset Hardening
- **Migration**: Add `expires_at timestamptz` (default `now() + 24h`) to `pin_reset_requests`. Add partial unique index ensuring max **1 active** pending request per user (`WHERE status='pending' AND expires_at > now()`).
- Update `useJournalPin` / `PrivateSpaceGate.tsx` reset flow to:
  - Pre-check for an existing pending+unexpired request and show its status + countdown instead of allowing a new one.
  - Surface "Request expired — submit a new one" when past `expires_at`.
- Update `admin/PinResetRequests.tsx` to filter out expired requests (status auto-shown as "Expired") and show time remaining.

## 2. Universal Character Personalization Fix
- Currently the `$name` / placeholder leak fix lives partially in `useProfile.ts` and char-chat sanitizer. Move enforcement into `supabase/functions/characters-chat/index.ts`:
  - Always inject a hidden `USER_CONTEXT` block (name, age, pronouns, hobbies) at the start of every character system prompt — **regardless** of whether the creator referenced it.
  - Add a pre-pass that substitutes `{{name}}`, `$name`, `[name]`, `<name>` tokens in the creator-defined `system_prompt` before sending.
  - Strengthen `sanitizeAI.ts` to strip leaked scaffolding ("It seems there isn't much…", "Context:", "$name", bullet meta-lists) from **all** character outputs.

## 3. Contextual Mood Tags + Correlation Insights
- **Migration**: Add `context_tags text[]` to `mood_entries`.
- **Tag taxonomy** (age-aware — under-16 hides Work/Caffeine):
  - Activities: study, exercise, gaming, screen-time, hobby, *work* (16+)
  - Social: alone, family, friends, online, conflict
  - Physical: good-sleep, poor-sleep, skipped-meal, *caffeine* (16+), sick, hydrated
  - Plus user-defined custom tags (saved to localStorage per user).
- **UI**:
  - Extend `MoodPromptWidget` with a horizontally-scrollable chip selector (multi-select, max 5).
  - In Mood Tracking page, add a "Manage Tags" sheet for custom tag CRUD.
- **Correlation Engine** (`src/hooks/useMoodCorrelations.ts`):
  - Pure client-side analysis over last 30 days of mood + sleep + tags.
  - Compute: avg mood per tag, sleep-vs-mood correlation, top negative/positive tags.
  - Render in `InsightsPanel` and Analytics page: "Your mood is 22% lower on days tagged `poor-sleep`."

## 4. Smart Routing / Dynamic Interventions
- New hook `useSmartRouting.ts` that watches latest mood + sleep entries via existing hooks and emits suggestions.
- **Proactive MindMate check-in**: when latest mood is in {sad, very-sad, stressed, overwhelmed, anxious} and last MindMate use > 2h ago, show a dismissible toast/card on dashboard with two CTAs: "Vent to MindMate" (deep-links to /chat with a pre-seeded opener) and "2-min Breathing".
- **Context-aware recommendations**: on dashboard mount, if last `sleep_logs.sleep_quality` is poor, pin a "Focus & Energy" card (links to breathing 4-7-8 + a specific soothing track id) above the feature grid. Implemented as a `RecommendationsRail` component, dismissible per-day via localStorage.

## 5. Clinical Safety Net & Crisis Routing
- **Crisis detection**: extend existing keyword/phrase checks (already partly in EmergencyHelpWidget) into a shared `src/utils/crisisDetection.ts` with weighted phrase list (self-harm, hopelessness, suicide ideation). Hook into:
  - `MindMate` send pipeline (client side) — if user message triggers, render an inline `CrisisHelpCard` above the assistant reply.
  - `JournalWriteView` autosave — debounced check; on trigger, show non-blocking banner with helpline + grounding shortcut.
- **SOS Button**: persistent floating button (bottom-right, `z-50`, 56×56 mobile / 64×64 desktop, distinct red-tinted glass style) on `/` (Index) and `/chat` (Dashboard). Opens a sheet with:
  - India helpline (iCall 9152987821, Vandrevala 1860-2662-345) + "International" expand.
  - 60-sec grounding (5-4-3-2-1) launcher.
  - Pre-filled SMS template to a saved emergency contact (new `profiles.emergency_contact` field — migration).
- Hidden during meditation/breathing fullscreen modes to avoid breaking immersion.

## Mobile considerations
- All new sheets use existing `Sheet` component (bottom slide-up on <768px).
- SOS button respects safe-area inset and sits above MobileNavigation bottom bar.
- Tag chips horizontally scroll with snap on mobile.
- Recommendation rail collapses to single card on mobile.

## Technical Notes
- 2 migrations: pin_reset expiry + mood context_tags + profiles.emergency_contact.
- ~3 new components, ~3 new hooks, 1 new util.
- No new external deps.
- All colors via semantic tokens; crisis card uses `--destructive` tinted glass.

Approve and I'll execute end-to-end.