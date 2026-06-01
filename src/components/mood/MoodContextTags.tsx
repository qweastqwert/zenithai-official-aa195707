import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface MoodContextTagsProps {
  selected: string[];
  onChange: (tags: string[]) => void;
  userAge?: number | null;
}

/**
 * Age-aware multi-select chip row for mood context tags.
 * Used inside MoodReasonInput to capture the *why* behind a mood log.
 */
const ALL: Array<{ key: string; label: string; emoji: string; minAge?: number; cat: string }> = [
  { key: 'study', label: 'Study', emoji: '📚', cat: 'activity' },
  { key: 'exercise', label: 'Exercise', emoji: '🏃', cat: 'activity' },
  { key: 'gaming', label: 'Gaming', emoji: '🎮', cat: 'activity' },
  { key: 'screen-time', label: 'Screens', emoji: '📱', cat: 'activity' },
  { key: 'hobby', label: 'Hobby', emoji: '🎨', cat: 'activity' },
  { key: 'work', label: 'Work', emoji: '💼', cat: 'activity', minAge: 16 },
  { key: 'alone', label: 'Alone', emoji: '🧘', cat: 'social' },
  { key: 'family', label: 'Family', emoji: '👨‍👩‍👧', cat: 'social' },
  { key: 'friends', label: 'Friends', emoji: '🤝', cat: 'social' },
  { key: 'online', label: 'Online', emoji: '🌐', cat: 'social' },
  { key: 'conflict', label: 'Conflict', emoji: '⚡', cat: 'social' },
  { key: 'good-sleep', label: 'Good sleep', emoji: '😴', cat: 'physical' },
  { key: 'poor-sleep', label: 'Poor sleep', emoji: '🥱', cat: 'physical' },
  { key: 'skipped-meal', label: 'Skipped meal', emoji: '🍽️', cat: 'physical' },
  { key: 'caffeine', label: 'Caffeine', emoji: '☕', cat: 'physical', minAge: 16 },
  { key: 'sick', label: 'Sick', emoji: '🤒', cat: 'physical' },
  { key: 'hydrated', label: 'Hydrated', emoji: '💧', cat: 'physical' },
];

const MAX = 5;

const MoodContextTags: React.FC<MoodContextTagsProps> = ({ selected, onChange, userAge }) => {
  const filtered = useMemo(
    () => ALL.filter(t => !t.minAge || (userAge != null && userAge >= t.minAge)),
    [userAge]
  );

  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter(k => k !== key));
    } else if (selected.length < MAX) {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          What's around this feeling?
        </p>
        <p className="text-[10px] text-muted-foreground">{selected.length}/{MAX}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 snap-x overflow-x-auto -mx-1 px-1 pb-1">
        {filtered.map(t => {
          const active = selected.includes(t.key);
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => toggle(t.key)}
              className={`shrink-0 snap-start rounded-full border px-2.5 py-1 text-xs transition-colors ${
                active
                  ? 'border-primary/60 bg-primary/15 text-primary'
                  : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="mr-1">{t.emoji}</span>{t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodContextTags;