// Content filtering system for community posts and comments
// Balances safety with emotional expression needs

const MILD_PROFANITY = [
  'damn', 'hell', 'crap', 'suck', 'stupid', 'idiot', 'moron', 'dumb'
];

const MODERATE_PROFANITY = [
  'shit', 'piss', 'bitch', 'bastard', 'asshole', 'jackass'
];

const SEVERE_PROFANITY = [
  'fuck', 'fucking', 'motherfucker', 'cocksucker', 'cunt', 'whore', 'slut'
];

const HATE_SPEECH = [
  // Racial slurs and discriminatory language
  'nigger', 'faggot', 'retard', 'spic', 'chink', 'kike', 'towelhead',
  // Other hate speech patterns
  'kill yourself', 'kys', 'commit suicide', 'end your life'
];

const SPAM_PATTERNS = [
  /(.)\1{4,}/gi, // Repeated characters (aaaaa)
  /^[A-Z\s!]{20,}$/g, // ALL CAPS SPAM
  /\b(buy|sell|click|visit|download|free|win|cash|money)\b.*(now|here|today)/gi
];

export interface FilterResult {
  isAllowed: boolean;
  filteredContent: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'blocked';
  warnings: string[];
}

export const filterContent = (content: string, userAge: number = 18): FilterResult => {
  const warnings: string[] = [];
  let filteredContent = content;
  let severity: FilterResult['severity'] = 'none';

  // Always block hate speech and harmful content
  for (const hate of HATE_SPEECH) {
    if (content.toLowerCase().includes(hate.toLowerCase())) {
      return {
        isAllowed: false,
        filteredContent: '',
        severity: 'blocked',
        warnings: ['Content contains harmful language and cannot be posted.']
      };
    }
  }

  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(content)) {
      warnings.push('Content appears to be spam.');
      severity = 'moderate';
    }
  }

  // Age-based profanity filtering
  if (userAge < 13) {
    // Very strict filtering for young users
    const allProfanity = [...MILD_PROFANITY, ...MODERATE_PROFANITY, ...SEVERE_PROFANITY];
    for (const word of allProfanity) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(filteredContent)) {
        filteredContent = filteredContent.replace(regex, '*'.repeat(word.length));
        severity = 'mild';
        warnings.push('Some words have been filtered.');
      }
    }
  } else if (userAge < 16) {
    // Moderate filtering for teens
    const restrictedWords = [...MODERATE_PROFANITY, ...SEVERE_PROFANITY];
    for (const word of restrictedWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(filteredContent)) {
        filteredContent = filteredContent.replace(regex, '*'.repeat(word.length));
        severity = severity === 'none' ? 'mild' : severity;
        warnings.push('Some words have been filtered.');
      }
    }
  } else if (userAge < 18) {
    // Light filtering for older teens
    for (const word of SEVERE_PROFANITY) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(filteredContent)) {
        filteredContent = filteredContent.replace(regex, '*'.repeat(word.length));
        severity = severity === 'none' ? 'mild' : severity;
        warnings.push('Some strong language has been filtered.');
      }
    }
  }
  // Adults (18+) see most content unfiltered, except hate speech

  // Check content length and quality
  if (content.length < 5) {
    warnings.push('Message is very short.');
  }

  if (content.length > 2000) {
    warnings.push('Message is very long and may be difficult to read.');
    severity = 'mild';
  }

  return {
    isAllowed: true,
    filteredContent,
    severity,
    warnings
  };
};

export const getContentWarningMessage = (severity: FilterResult['severity']): string => {
  switch (severity) {
    case 'mild':
      return 'This content has been lightly filtered.';
    case 'moderate':
      return 'This content has been moderately filtered for appropriateness.';
    case 'severe':
      return 'This content has been heavily filtered.';
    case 'blocked':
      return 'This content cannot be displayed due to policy violations.';
    default:
      return '';
  }
};
