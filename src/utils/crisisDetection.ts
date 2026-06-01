/**
 * Lightweight client-side crisis phrase detector.
 *
 * This is intentionally NOT a diagnostic — it surfaces a gentle helpline card
 * when a message contains weighted distress language so the user can reach
 * professional help quickly.
 */

// Each entry: { pattern, weight }. Threshold = 2.
const SIGNALS: Array<{ pattern: RegExp; weight: number }> = [
  // High weight: explicit self-harm / suicide
  { pattern: /\bkill (myself|me)\b/i, weight: 3 },
  { pattern: /\bsuicide\b|\bsuicidal\b/i, weight: 3 },
  { pattern: /\bend (my|this) (life|pain)\b/i, weight: 3 },
  { pattern: /\bwant to die\b|\bwanna die\b/i, weight: 3 },
  { pattern: /\b(cut|hurt|harm)(ing)? myself\b/i, weight: 3 },
  { pattern: /\bnot worth living\b/i, weight: 3 },
  { pattern: /\boverdose\b/i, weight: 3 },

  // Medium weight: hopelessness / ideation
  { pattern: /\bno reason to (live|go on|continue)\b/i, weight: 2 },
  { pattern: /\beveryone would be better (off )?without me\b/i, weight: 3 },
  { pattern: /\bcan't go on\b|\bcant go on\b/i, weight: 2 },
  { pattern: /\bnothing matters\b/i, weight: 1 },
  { pattern: /\bgive up on (life|everything)\b/i, weight: 2 },
  { pattern: /\bhopeless\b/i, weight: 1 },
  { pattern: /\bworthless\b/i, weight: 1 },
  { pattern: /\bnobody (cares|loves me)\b/i, weight: 1 },

  // Hinglish / Hindi common phrases
  { pattern: /\b(jeena nahi|nahi jeena|marna chahta|marna chahti)\b/i, weight: 3 },
  { pattern: /\bmar jaun(ga|gi)?\b/i, weight: 3 },
];

const THRESHOLD = 2;

export function detectCrisis(text: string): { triggered: boolean; score: number } {
  if (!text || text.length < 3) return { triggered: false, score: 0 };
  let score = 0;
  for (const { pattern, weight } of SIGNALS) {
    if (pattern.test(text)) score += weight;
    if (score >= THRESHOLD) return { triggered: true, score };
  }
  return { triggered: score >= THRESHOLD, score };
}