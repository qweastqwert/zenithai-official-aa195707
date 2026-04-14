/**
 * Strips model chain-of-thought / instruction leaks from AI responses.
 */

const INSTRUCTION_LEAK_PATTERNS = [
  /(^|\n)\s*(Role|Input|Constraint|Formatting|Tone|Emojis|Emotional Intelligence|IMPORTANT)\s*:/i,
  /(^|\n)\s*Option\s+\d+\s*:/i,
  /(^|\n)\s*Heading\s+\d+\s*:/i,
  /(^|\n)\s*(Bullet list|Numbered list)\s*:/i,
  /Max\s+\d+\s+words\?/i,
  /Since it's a single/i,
  /I can use a Heading/i,
  /\*\s*(Positive|Actionable|Mental wellness|Supportive|Formatting followed|Max \d+ words)\??/i,
  /(^|\n)\s*\*\s*\*?Option\s+\d+/i,
  /<think[\s\S]*?<\/think>/gi,
];

const LINE_FILTER = /^(Role|Input|Constraint|Formatting|Tone|Emojis|Emotional Intelligence|IMPORTANT|Option\s+\d+|Heading\s+\d+|Bullet list|Numbered list)\s*:/i;
const LINE_META = /^(Since it's|I can use\b|The user has\b|Positive\/Encouraging\?|Actionable\?|Mental wellness focus\?|Supportive, not prescriptive\?|Formatting followed\?|Max\s+\d+\s+words\?|Let me |I need to |I'll |I should |My response|Checking|Analyzing)/i;

export function sanitizeAssistantMessage(text: string): string {
  // Strip <thinking>...</thinking> and <think>...</think> blocks
  let cleaned = text
    .replace(/<thinking[\s\S]*?<\/thinking>/gi, '')
    .replace(/<think[\s\S]*?<\/think>/gi, '')
    .trim();

  const leakCount = INSTRUCTION_LEAK_PATTERNS.reduce(
    (count, pattern) => count + (pattern.test(cleaned) ? 1 : 0),
    0
  );

  if (leakCount < 2) return cleaned;

  const filtered = cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter(
      (line) =>
        !LINE_FILTER.test(line) &&
        !LINE_META.test(line) &&
        !/^\*\s*\*?(Option|Heading|Role|Constraint|Tone|Emojis)\b/i.test(line)
    )
    .join('\n')
    .trim();

  return filtered || cleaned;
}

/**
 * Extracts just the final tip from a potentially reasoning-heavy response.
 */
export function extractTip(text: string): string {
  let tip = sanitizeAssistantMessage(text);

  // If still long, grab the last non-empty meaningful line
  if (tip.length > 150) {
    const lines = tip
      .split('\n')
      .map((l) => l.trim())
      .filter(
        (l) =>
          l &&
          !l.startsWith('*') &&
          !l.startsWith('-') &&
          !l.startsWith('#') &&
          !l.startsWith('>')
      );
    tip =
      lines[lines.length - 1] ||
      lines[0] ||
      'Take a moment to breathe deeply and reset your mind today. ✨';
  }

  // Remove leading ** heading ** wrapper
  tip = tip.replace(/^\*{1,3}[^*]+\*{1,3}\s*/, '').trim();

  return tip;
}
