

## Fix Multiple Bugs & Add Multilingual Support

### 1. MindMate Back Button Fix
**File: `src/components/MindMate.tsx`**
- Add `onBack?: () => void` to `MindMateProps`
- Replace `<Link to="/chat">` with `<Button onClick={onBack || (() => navigate('/chat'))}>`

**File: `src/components/MindMateWithVerification.tsx`**
- Pass `onBack={handleBack}` down to `<MindMate>`

### 2. MindMate Hinglish/Multilingual Support
**File: `src/components/MindMate.tsx`**
- Add to system prompt: "LANGUAGE FLEXIBILITY: Mirror the user's language. Support Hinglish, Marathi+English, Tamil+English, and other Indian language mixes naturally."

### 3. Fix Soothing Music (flashing + no minibar)
**File: `src/components/SongMenu.tsx`**
- Import `useMusicPlayer` and play songs directly via context instead of navigating to `/soothing-music`
- Add full song URLs from the `SoothingMusic` component data

**File: `src/components/SoothingMusic.tsx`**
- Fix `handlePlayPause` to use `togglePlayPause()` when same song is already playing

### 4. Fix Journal Speech Repetition
**File: `src/hooks/useSpeechRecognition.ts`**
- Set `interimResults = false` to only capture final results
- Track processed result index to prevent duplicate appends

### 5. Fix Achievements Flashing Every Dashboard Open
**File: `src/components/ChatInterface.tsx`**
- Store shown achievement IDs in a persistent Set in localStorage
- Only show notifications for IDs not yet in the Set
- Update Set after showing

**File: `src/App.tsx`**
- Apply same fix for App-level achievement notifications

### 6. Fix Mood Log Hidden on Mobile
**File: `src/components/mood/MoodPromptWidget.tsx`**
- Ensure mobile view uses full-width centered positioning with proper z-index
- Remove any clipping from parent containers

### 7. Remove Persistent Purple Borders
- Search all components for `border-primary`, `border-purple`, `ring-primary` on containers/cards
- Replace with `border-border` or remove entirely

### 8. Fix Accessibility Toggle in Settings
**File: `src/components/accessibility/AccessibilityWidget.tsx`**
- Verify event listener re-reads cookie value on `zenith-a11y-visibility-changed` event
- Ensure state updates correctly trigger re-render

