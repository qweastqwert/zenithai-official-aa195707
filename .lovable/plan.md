

## Plan: Characters Chat Enhancements, AI Usage Fix, and Mood Widget Scroll

This plan addresses 7 distinct issues across multiple files, plus a database migration for conversation storage.

---

### 1. Fix AI Session Usage Tracking

**Problem**: `trackActivity('mindmate')` fires when navigating to MindMate, not when actually using AI.

**Fix**:
- Remove `trackActivity('mindmate')` from `handleNavigation` in `ChatInterface.tsx`
- Move it into `MindMate.tsx` inside `handleSend` (after a successful AI response)
- Similarly for Characters: add tracking in `CharactersChat.tsx` `sendMessage` after successful response
- This way AI usage only increments when a real message exchange happens

---

### 2. Character Creator Button as Circle

**Change**: In `CharactersChat.tsx`, change the "Create Character" button (the `<Plus>` button) from a square icon button to a floating action button (FAB) positioned in the bottom-right corner of the community tab, styled as a circle with the zenith-primary color.

---

### 3. Character Avatar Customization (PFP)

**Current**: Only emoji input for avatar.

**New system in character creator dialog**:
- **Three avatar modes**: Emoji, Image Upload, or Auto-generated letter
- **Emoji mode**: Current behavior (text input)
- **Image mode**: File input that crops to 128x128 using a simple crop UI (drag/resize within a fixed square viewport). Store the cropped image as a base64 data URL in the `avatar_emoji` field (rename concept to `avatar_url` display logic) or upload to Supabase Storage
- **Letter fallback**: If no avatar is set, display the first letter of the character name in bold with a deterministic random background color (seeded from character name)
- Requires a new `avatar_type` column (`emoji` | `image` | `letter`) and `avatar_image_url` column on `community_characters`

**Database migration**: Add `avatar_type text NOT NULL DEFAULT 'emoji'` and `avatar_image_url text` columns to `community_characters`. Create a public Storage bucket `character-avatars` for image uploads.

---

### 4. Optional Mood/Tone Field in Character Creator

**Add** an optional "Mood / Tone" text input in the create character dialog (e.g., "Sarcastic", "Cheerful", "Dark humor"). This gets appended to the system prompt when chatting: `"Tone/Mood: {value}"`.

**Database migration**: Add `mood_tone text` column to `community_characters`.

---

### 5. Auto-Save Character Conversations + Export

**New table**: `character_conversations` with columns:
- `id uuid PK`
- `user_id uuid NOT NULL`
- `character_id text NOT NULL` (can be featured ID or community UUID)
- `character_name text NOT NULL`
- `title text NOT NULL DEFAULT 'New Conversation'`
- `messages jsonb NOT NULL DEFAULT '[]'`
- `created_at timestamptz`
- `updated_at timestamptz`

With RLS: users can CRUD their own conversations only.

**UI changes in CharactersChat.tsx**:
- When chatting, auto-save messages to the database periodically (on each new message pair)
- Add a "Conversations" tab/panel in the chat header that shows past conversations for this character
- "New Conversation" button to start fresh
- "Export to JSON" button that downloads the conversation as a `.json` file
- Conversations get deleted when account is deleted (add `DELETE FROM public.character_conversations WHERE user_id = _uid` to the `delete_user_account` function)

**Update DangerZoneSection.tsx**: Add mention of character conversations being deleted in the warning text.

---

### 6. Make Mood Widget Scrollable

**In `MoodPromptWidget.tsx`**: The mobile bottom sheet `CardContent` area is already `overflow-y-auto`, but the `MoodSelection` grid may overflow. Wrap the content in a scrollable container with `max-h` constraint and ensure `overflow-y-auto` propagates correctly. Also add `overscroll-contain` to prevent background scroll.

---

### 7. Update Account Deletion Warning

Add "character conversations" to the list of data that gets deleted in both `DangerZoneSection.tsx` dialog text and the `delete_user_account` RPC function.

---

### Technical Summary

**Database migration** (single migration):
1. `ALTER TABLE community_characters ADD COLUMN mood_tone text, ADD COLUMN avatar_type text NOT NULL DEFAULT 'emoji', ADD COLUMN avatar_image_url text`
2. Create `character_conversations` table with RLS
3. Create Storage bucket `character-avatars` (public)
4. Update `delete_user_account` function to delete from `character_conversations`

**Files to edit**:
- `src/components/ChatInterface.tsx` — remove premature `trackActivity('mindmate')`
- `src/components/MindMate.tsx` — add `trackActivity('mindmate')` after successful AI response
- `src/components/CharactersChat.tsx` — major refactor: FAB button, avatar system, mood/tone field, conversation management, export, AI usage tracking
- `src/components/mood/MoodPromptWidget.tsx` — ensure scrollability
- `src/components/mood/MoodSelection.tsx` — ensure grid is scrollable in compact mode
- `src/components/settings/DangerZoneSection.tsx` — update warning text
- `src/hooks/useActivityTracker.ts` — no changes needed (already supports event-based tracking)

**Files to create**:
- `src/components/characters/AvatarEditor.tsx` — image crop/emoji/letter avatar picker component
- `src/components/characters/ConversationManager.tsx` — conversation list, new/export UI

