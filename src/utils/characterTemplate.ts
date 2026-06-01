/**
 * Substitute personalization placeholders that creators sometimes drop
 * into character system prompts (e.g. "$name", "{{name}}", "[name]", "<name>").
 *
 * Without this pass the AI parrots the literal placeholders back to the user,
 * breaking immersion ("Tell me, $name, what is hate?").
 */
export interface UserCtx {
  name?: string | null;
  age?: string | number | null;
  gender?: string | null;
  hobbies?: string | null;
  problems?: string | null;
}

const KEYS: Array<keyof UserCtx> = ['name', 'age', 'gender', 'hobbies', 'problems'];

export function substitutePlaceholders(text: string, ctx: UserCtx): string {
  if (!text) return text;
  let out = text;
  for (const key of KEYS) {
    const value = ctx[key];
    const replacement =
      value == null || value === '' ? '' : String(value);
    // matches $name, ${name}, {{name}}, {name}, [name], <name>, %name%
    const patterns = [
      new RegExp(`\\$\\{?${key}\\}?`, 'gi'),
      new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi'),
      new RegExp(`\\{\\s*${key}\\s*\\}`, 'gi'),
      new RegExp(`\\[\\s*${key}\\s*\\]`, 'gi'),
      new RegExp(`<\\s*${key}\\s*>`, 'gi'),
      new RegExp(`%\\s*${key}\\s*%`, 'gi'),
    ];
    for (const p of patterns) out = out.replace(p, replacement);
  }
  // Clean leftover empty parens/brackets from removed unknown placeholders
  out = out.replace(/\(\s*\)|\[\s*\]|\{\s*\}|"\s*"/g, '').replace(/\s{2,}/g, ' ');
  return out.trim();
}