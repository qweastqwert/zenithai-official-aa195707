
## Implementation plan

### What I found
- Web notifications are still purely client-side (`setTimeout` / `setInterval`) with no Push API subscription flow, no VAPID keys, no subscription storage, and no Edge Function/cron sender, so installed PWA push will never be reliable after the app is closed.
- Community has two real reliability bugs:
  1. post loading depends on the current `community_posts_safe` setup, which is brittle with the current grants/policies
  2. `CreatePost` / `PostCard` each create their own `useCommunityPosts()` instance, so create/delete updates a different local state than the visible feed.
- The ban hook also over-queries `community_bans` for regular users, which can break the Community UX with unnecessary failures.
- Characters are still hardcoded locally. There is no database model, no creator metadata, no privacy controls, and the Edge Function does not enforce access to custom characters.
- Community identity currently uses `profiles.name`; there is no dedicated editable username field for posts/characters.
- Achievements can still pop randomly because there are duplicate notification entry points (`App.tsx` and `ChatInterface.tsx`).
- Accessibility settings only expose the show/hide toggle; the real controls still live only in the floating widget.
- The mobile mood prompt is still a custom fixed panel and needs a true mobile bottom-sheet layout.

## Plan

### 1) Rebuild notifications as real Web Push
- Add backend persistence for:
  - `notification_preferences` (user_id, timezone, mood_time, journal_time, sleep_enabled, etc.)
  - `push_subscriptions` (user_id, endpoint, p256dh, auth, device info, active flag)
  - `notification_delivery_log` (for de-duplication so the same reminder is not sent repeatedly)
- Add VAPID-based Edge Functions:
  - one to register/unregister push subscriptions
  - one scheduled sender to deliver due reminders
  - one optional test-send path for QA
- Update the service worker and app boot flow so the published app registers push correctly, subscribes with the VAPID public key, and routes notification clicks to the right place.
- Change reminder settings from “mood every X hours” to exact time-based reminders:
  - Mood check-in: set time in Settings
  - Journal: set time in Settings
  - Sleep logging: use the saved sleep time directly
- Keep local in-app fallback prompts only as a secondary path when push is unavailable.

### 2) Make Community fully work again
- Replace the fragile feed loading path with a secure, stable read model that returns masked identity plus creator username/reputation safely.
- Refactor Community mutations so create/delete/update all refresh the same visible feed instead of isolated hook instances.
- Fix ban checks so regular users only read their own ban state.
- Ensure Community search, trending, comments, voting, and profile popups all work with the same safe identity model.
- Verify create post, load posts, delete post, comment, and vote flows on mobile and desktop.

### 3) Add Community-made Characters
- Add a new database-backed `community_characters` model with:
  - creator user id
  - name
  - description
  - avatar/emoji
  - system prompt
  - optional starter greeting
  - `is_private`
  - timestamps
- Add proper RLS so:
  - public characters are visible to everyone allowed to use the feature
  - private characters are visible/chat-able only by the creator
  - only the creator can edit/delete their own characters
- Update the Characters UI to have two tabs:
  - Zenith AI Featured (default)
  - Community-made
- In Community-made:
  - add fuzzy search across character name, description, and creator username
  - add create-character flow
  - show creator username below the character description in the picker
  - show creator username below the name in chat
  - tapping the username filters to that creator’s characters
  - show privacy state clearly for private characters
- Update `characters-chat` Edge Function so it loads community character prompts server-side and enforces privacy access there instead of trusting the client.

### 4) Add editable usernames for community identity
- Add a dedicated unique `username` field to `profiles` and backfill existing users safely.
- Collect username during onboarding.
- Allow username edits in Profile Settings.
- Switch community post/comment/character creator display from `name` to `username`.
- Because posts/comments are rendered by user lookup rather than storing a snapshot name, old posts will automatically reflect username changes.

### 5) Fix dashboard, accessibility, achievements, and mobile UX
- Dashboard:
  - keep MindMate first in the main row
  - remove the “New” badge/hue from Achievements
  - move the “New” badge to Daily Schedule
- Accessibility:
  - extract the accessibility controls into a reusable settings component
  - render the full accessibility controls inside Settings
  - make the floating button optional and actually hide/show reliably
  - keep the floating widget using the same shared controls/state
- Achievements:
  - remove duplicate popup triggering and keep one source of truth
  - only show truly new unlocks once
- Mood prompt:
  - replace the current mobile popup with a proper Drawer/bottom sheet using safe-area spacing
  - make sure it is centered, scrollable, and never clipped by the bottom nav
- Do one last mobile polish pass for Community, Characters, Settings, and the dashboard so nothing is squished.

## Technical details
- Likely files to update:
  - `src/services/notificationService.ts`
  - `src/hooks/useNotifications.ts`
  - `src/components/settings/NotificationsSection.tsx`
  - `src/main.tsx`
  - `public/sw.js`
  - `src/hooks/useCommunityPosts.ts`
  - `src/components/community/CommunitySupport.tsx`
  - `src/components/community/CreatePost.tsx`
  - `src/components/community/PostCard.tsx`
  - `src/hooks/useCommunityBans.ts`
  - `src/components/CharactersChat.tsx`
  - `supabase/functions/characters-chat/index.ts`
  - `src/hooks/useProfile.ts`
  - `src/components/OnboardingForm.tsx`
  - `src/components/settings/ProfileSection.tsx`
  - `src/components/accessibility/AccessibilityWidget.tsx`
  - `src/components/settings/AccessibilitySettingsSection.tsx`
  - `src/components/ChatInterface.tsx`
  - `src/components/mood/MoodPromptWidget.tsx`
  - `src/App.tsx`
- Database work will be required for usernames, push subscriptions/preferences/logging, and community characters.
- Web push will also require new secrets before implementation:
  - VAPID public key
  - VAPID private key
  - VAPID subject
- Important limitation: real installed-PWA push can only be validated on the published app, not reliably inside the editor preview iframe.

## QA after implementation
- Mobile QA at 390x844 and 360x800:
  - dashboard
  - settings
  - accessibility controls
  - mood prompt
  - community feed/create/comment
  - characters tabs/search/create/chat
- Push QA on published install:
  - permission
  - subscription save
  - test push
  - scheduled reminder delivery
  - notification click routing
- Regression QA:
  - achievements no longer pop randomly
  - accessibility button hide works
  - username changes reflect in community and characters
  - private characters are not visible/chat-able to other users
