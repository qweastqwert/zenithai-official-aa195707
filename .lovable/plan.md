

## Plan: Fix Mood Widget Layout, Mobile Analytics, and Push Notifications

### 1. Fix Desktop Mood Widget — Squished Labels and Scrollability

**Problem**: On desktop/tablet (non-compact mode), the `MoodSelection` grid uses `grid-cols-4` with fixed heights (`h-24 md:h-28`). With 7 moods in a 4-column grid, the second row has 3 items and labels like "Melancholy" and "Distressed" get truncated. The `MoodReasonInput` (non-compact) has a large card layout that overflows the fixed-height widget.

**Fix in `MoodSelection.tsx`**:
- Change non-compact grid from `grid-cols-4` to `grid-cols-3 sm:grid-cols-4` with `max-h-[50vh] overflow-y-auto overscroll-contain` so it scrolls when needed
- Ensure label text doesn't truncate — use `text-[11px] sm:text-xs md:text-sm` with `whitespace-nowrap`

**Fix in `MoodPromptWidget.tsx`** (desktop/tablet branch, line 334):
- Wrap the `CardContent` in a scrollable container: `max-h-[60vh] overflow-y-auto overscroll-contain`

**Fix in `MoodReasonInput.tsx`** (non-compact):
- Reduce padding and emoji size so it fits within the widget without overflow

### 2. Make Analytics Dashboard Mobile-Friendly

**Problem**: The analytics card is too large and visually jarring on mobile — full-width gradient card with desktop-sized spacing.

**Changes to `AnalyticsDashboard.tsx`**:
- Detect mobile via `useIsMobile()` hook
- On mobile: compact single-column layout with smaller text, reduced padding (`p-3`), icon sizes (`h-4 w-4`), and `text-sm` headings
- Change the 3-column stats grid to a horizontal scrollable row or stacked compact chips on mobile
- Reduce AI tip section padding
- Remove the Weekly/Monthly toggle buttons on mobile (default to weekly) or make them smaller pill buttons

### 3. Implement Working Push Notifications with VAPID

**Problem**: The push notification edge function only stores subscriptions but never actually sends notifications — no `web-push` library, no VAPID keys.

**Steps**:
1. **Generate VAPID keys** via a script (`npx web-push generate-vapid-keys`)
2. **Store as Supabase secrets**: `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`
3. **Update `push-notifications/index.ts`** edge function:
   - Import `web-push` (Deno-compatible)
   - In the `test-push` action, actually send a push notification using the VAPID keys and stored subscriptions
   - Add a new `send-push` action for programmatic notification sending
4. **Update client-side** (`notificationService.ts` or `sw.js`):
   - Use the VAPID public key when subscribing via `pushManager.subscribe({ applicationServerKey })`
   - Ensure the service worker handles `push` events and shows notifications

### Files to Edit
- `src/components/mood/MoodSelection.tsx` — scrollable grid, prevent label truncation
- `src/components/mood/MoodPromptWidget.tsx` — scrollable desktop CardContent
- `src/components/mood/MoodReasonInput.tsx` — reduce non-compact size
- `src/components/analytics/AnalyticsDashboard.tsx` — mobile-optimized compact layout
- `supabase/functions/push-notifications/index.ts` — implement actual push sending with web-push
- `public/sw.js` — handle `push` events
- `src/services/notificationService.ts` — use VAPID public key for subscription

### Files to Create
- None (all changes in existing files)

### Secrets to Add
- `VAPID_PUBLIC_KEY` — public VAPID key (also embedded in client code)
- `VAPID_PRIVATE_KEY` — private VAPID key (edge function secret only)

