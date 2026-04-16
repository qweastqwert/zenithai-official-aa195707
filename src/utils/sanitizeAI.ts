/**
 * Strips model chain-of-thought / instruction leaks from AI responses.
 */

const SCAFFOLDING_LINE = [
  /^•\s*(User|Emotional state|Goal|Identify|Draw from|Use Therapeutic|Formatting|Empathy|Immediate Tool|Guidance|Knowledge Base|Heading \d|Bullet|Tool|Call)\b/i,
  /^[-•]\s*(User \(|Emotional state|Goal:|Identify |Draw from|Use |Formatting:|Empathy:|Immediate|Guidance:|Knowledge|Heading \d|Bullet|Numbered|Call |show_|suggest_)/i,
  /^\s*(Role|Input|Constraint|Formatting|Tone|Emojis|Emotional Intelligence|IMPORTANT)\s*:/i,
  /^\s*Option\s+\d+\s*:/i,
  /^\s*Heading\s+\d+\s*:/i,
  /^\s*(Bullet list|Numbered list)\s*:/i,
  /^(Since it's|I can use\b|The user has\b|Let me |I need to |I should |I'll |My response|Checking|Analyzing)/i,
  /^\*\s*\*?(Option|Heading|Role|Constraint|Tone|Emojis)\b/i,
  /^(Positive\/Encouraging\?|Actionable\?|Mental wellness focus\?|Supportive, not prescriptive\?|Formatting followed\?|Max\s+\d+\s+words\?)/i,
  /\$\\rightarrow\$/,
  /\\rightarrow/,
];

export function sanitizeAssistantMessage(text: string): string {
  // Strip <thinking>...</thinking> and <think>...</think> blocks
  let cleaned = text
    .replace(/<thinking[\s\S]*?<\/thinking>/gi, '')
    .replace(/<think[\s\S]*?<\/think>/gi, '')
    .trim();

  // Always filter scaffolding lines (don't require a threshold)
  const lines = cleaned.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    return !SCAFFOLDING_LINE.some(p => p.test(trimmed));
  });

  const result = filteredLines.join('\n').trim();
  return result || cleaned;
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
