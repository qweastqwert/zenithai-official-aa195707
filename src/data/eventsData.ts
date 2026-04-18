export interface EventActivity {
  title: string;
  description: string;
  prompt: string;
  color: string;
}

export interface WellnessEvent {
  id: string;
  title: string;
  icon: string; // lucide icon name
  month: number; // 0-indexed
  day?: number; // specific day, undefined = whole month
  dayEnd?: number; // for ranges
  gradient: string;
  borderColor: string;
  accentColor: string;
  description: string;
  facts: string[];
  message: string;
  activities: EventActivity[];
}

export const wellnessEvents: WellnessEvent[] = [
  // JANUARY
  {
    id: 'mental-wellness-month',
    title: 'January – Mental Wellness Month',
    icon: 'Sparkles',
    month: 0,
    gradient: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
    borderColor: 'border-teal-200',
    accentColor: 'teal',
    description: 'A whole month dedicated to resetting your mental health after the holidays.',
    facts: [
      'Post-holiday blues affect many as routines resume',
      'Winter months can trigger Seasonal Affective Disorder (SAD)',
      'New Year resolutions create pressure and stress',
      'Perfect time to establish healthy mental wellness habits',
    ],
    message: 'Start the year with intention. Your mental wellness journey begins with small, consistent steps.',
    activities: [
      { title: 'Mindful Intentions Setting', description: 'Set meaningful goals with AI guidance', prompt: 'Help me set mindful intentions for mental wellness this January. Guide me through creating sustainable goals that focus on emotional well-being rather than just achievements.', color: 'teal' },
      { title: 'Winter Wellness Check-in', description: 'AI-guided self-assessment for your current state', prompt: "I'd like to do a comprehensive winter wellness check-in. Help me assess my current mental state, identify seasonal challenges, and create a personalized plan for maintaining good mental health during winter.", color: 'cyan' },
    ],
  },
  {
    id: 'blue-monday',
    title: 'Blue Monday – Beat the Blues',
    icon: 'Sun',
    month: 0,
    day: 19,
    gradient: 'from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
    borderColor: 'border-blue-300',
    accentColor: 'blue',
    description: 'Known as one of the most challenging days of the year – let\'s flip the script.',
    facts: [
      'Post-holiday blues combined with cold weather and short days',
      'Failed New Year resolutions add feelings of disappointment',
      'Financial stress from holiday spending often peaks',
      'But remember: You have the power to make today bright! 💙',
    ],
    message: "Let's turn Blue Monday into a day of self-compassion and positive action!",
    activities: [
      { title: 'Mood Boost Session', description: 'Personalized activities to lift your spirits', prompt: "It's Blue Monday and I could use some support. Help me with activities and exercises to boost my mood today. I want to turn this day into something positive.", color: 'blue' },
      { title: 'Gratitude & Joy Finder', description: 'Discover sources of joy and practice gratitude', prompt: "Guide me through a gratitude and joy-finding exercise to combat the Blue Monday blues. Help me identify positive things in my life.", color: 'indigo' },
    ],
  },
  {
    id: 'parent-mental-health',
    title: 'Parent Mental Health Day',
    icon: 'Heart',
    month: 0,
    day: 30,
    gradient: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20',
    borderColor: 'border-rose-200',
    accentColor: 'rose',
    description: 'Recognizing the mental health challenges parents face every day.',
    facts: [
      'Parenting stress affects 1 in 3 parents significantly',
      'Many parents struggle silently with anxiety and depression',
      'Taking care of your mental health makes you a better parent',
      'You deserve support and understanding too! 💕',
    ],
    message: "Whether you're a parent or supporting one, mental health matters for everyone in the family.",
    activities: [
      { title: 'Parent Stress Relief', description: 'Quick strategies for busy parents', prompt: "I'm a parent and today is Parent Mental Health Day. Help me with stress relief techniques specifically designed for parents. I need quick, practical strategies I can use even with a busy family schedule.", color: 'rose' },
      { title: 'Family Mental Wellness', description: "Support the whole family's health", prompt: "Help me understand how to support my family's mental health better. I want to create a positive environment for everyone while also taking care of my own mental wellness as a parent.", color: 'pink' },
    ],
  },

  // FEBRUARY
  {
    id: 'time-to-talk',
    title: 'Time to Talk Day',
    icon: 'MessageCircle',
    month: 1,
    day: 6,
    gradient: 'from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20',
    borderColor: 'border-sky-200',
    accentColor: 'sky',
    description: 'Break the silence around mental health – one conversation at a time.',
    facts: [
      '1 in 4 people experience a mental health problem each year',
      'Talking about feelings is the first step toward recovery',
      'Listening without judgment can save lives',
      'A 5-minute conversation can change someone\'s day',
    ],
    message: 'Open up. Speak out. The power of conversation is immeasurable.',
    activities: [
      { title: 'Practice Opening Up', description: 'Safe space to practice expressing feelings', prompt: "Today is Time to Talk Day. Help me practice how to open up about my feelings. Guide me through expressing what I've been keeping inside in a safe, judgment-free space.", color: 'sky' },
      { title: 'Active Listening Skills', description: 'Learn to be a better listener', prompt: "Teach me active listening skills so I can better support friends and family who are struggling with their mental health. Give me practical techniques I can use today.", color: 'blue' },
    ],
  },
  {
    id: 'self-love-valentines',
    title: "Valentine's – Self-Love Day",
    icon: 'HeartHandshake',
    month: 1,
    day: 14,
    gradient: 'from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20',
    borderColor: 'border-pink-300',
    accentColor: 'pink',
    description: "Before loving others, learn to love yourself – you deserve it.",
    facts: [
      'Self-love is the foundation of all healthy relationships',
      "Valentine's Day can feel isolating – self-love combats that",
      'Practicing self-compassion reduces anxiety and depression',
      'You are worthy of love exactly as you are ❤️',
    ],
    message: 'This Valentine\'s, the most important relationship to nurture is the one with yourself.',
    activities: [
      { title: 'Self-Compassion Letter', description: 'Write yourself a love letter guided by AI', prompt: "It's Valentine's Day and I want to practice self-love. Guide me through writing a self-compassion letter. Help me recognize my worth, forgive my mistakes, and celebrate who I am.", color: 'pink' },
      { title: 'Boundaries & Self-Worth', description: 'Learn to set healthy boundaries', prompt: "Help me explore the connection between self-love and healthy boundaries. I want to learn how to say no without guilt and prioritize my own well-being.", color: 'red' },
    ],
  },

  // MARCH
  {
    id: 'womens-day',
    title: "International Women's Day",
    icon: 'Crown',
    month: 2,
    day: 8,
    gradient: 'from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20',
    borderColor: 'border-purple-300',
    accentColor: 'purple',
    description: "Celebrating women's strength, resilience, and mental wellness.",
    facts: [
      'Women are twice as likely to be diagnosed with anxiety',
      'Societal pressure on women contributes to burnout and stress',
      'Women\'s empowerment starts with mental and emotional well-being',
      'Supporting women\'s mental health uplifts entire communities 💜',
    ],
    message: "To every woman: your strength is extraordinary. Today and every day, your mental health matters.",
    activities: [
      { title: 'Inner Strength Discovery', description: 'Uncover the resilience within you', prompt: "Today is International Women's Day. Help me explore and celebrate my inner strength as a woman. Guide me through an exercise that acknowledges the unique pressures women face and helps me build resilience and confidence.", color: 'purple' },
      { title: 'Break the Bias Reflection', description: 'Reflect on overcoming societal expectations', prompt: "Guide me through a reflective exercise about societal expectations and biases that affect women's mental health. Help me identify internalized pressures and develop strategies to live more authentically.", color: 'fuchsia' },
      { title: 'Empowerment Affirmations', description: 'Build a personalized affirmation practice', prompt: "Create a powerful set of personalized empowerment affirmations for me as a woman. Help me address imposter syndrome, self-doubt, and help me embrace my unique power.", color: 'violet' },
    ],
  },
  {
    id: 'world-sleep-day',
    title: 'World Sleep Day',
    icon: 'Moon',
    month: 2,
    day: 14,
    gradient: 'from-indigo-50 to-slate-50 dark:from-indigo-900/20 dark:to-slate-900/20',
    borderColor: 'border-indigo-200',
    accentColor: 'indigo',
    description: 'Quality sleep is the cornerstone of mental and physical health.',
    facts: [
      'Sleep deprivation increases risk of depression by 10x',
      'Adults need 7-9 hours of quality sleep per night',
      'Poor sleep directly impacts emotional regulation',
      'Good sleep hygiene can be learned and practiced 🌙',
    ],
    message: 'Tonight, give yourself the gift of rest. Your mind will thank you tomorrow.',
    activities: [
      { title: 'Sleep Hygiene Audit', description: 'Optimize your bedtime routine', prompt: "It's World Sleep Day. Help me audit my sleep hygiene and create the perfect bedtime routine. I want practical, science-backed tips to improve my sleep quality.", color: 'indigo' },
      { title: 'Wind-Down Meditation', description: 'Guided relaxation for better sleep', prompt: "Guide me through a calming wind-down meditation I can use tonight. Include progressive muscle relaxation and visualization techniques to help me fall asleep peacefully.", color: 'slate' },
    ],
  },

  // APRIL
  {
    id: 'stress-awareness-month',
    title: 'April – Stress Awareness Month',
    icon: 'Shield',
    month: 3,
    gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    borderColor: 'border-amber-200',
    accentColor: 'amber',
    description: 'Understand, manage, and conquer your stress this month.',
    facts: [
      '75% of adults report moderate to high stress levels',
      'Chronic stress shrinks the prefrontal cortex',
      'Stress management is a learnable skill',
      'Even 10 minutes of relaxation daily makes a difference',
    ],
    message: 'Stress is not your identity. This month, learn to respond rather than react.',
    activities: [
      { title: 'Stress Mapping', description: 'Identify and categorize your stressors', prompt: "It's Stress Awareness Month. Help me map out all my current stressors. Categorize them into things I can control vs. things I can't, and help me create an actionable stress management plan.", color: 'amber' },
      { title: '5-Minute Stress Reset', description: 'Quick techniques for instant relief', prompt: "Teach me a powerful 5-minute stress reset technique I can use anywhere. Include breathing, grounding, and reframing exercises I can do at work, school, or home.", color: 'orange' },
    ],
  },

  // MAY
  {
    id: 'mental-health-awareness-month',
    title: 'May – Mental Health Awareness Month',
    icon: 'Ribbon',
    month: 4,
    gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    borderColor: 'border-green-200',
    accentColor: 'green',
    description: 'The biggest mental health awareness campaign of the year.',
    facts: [
      'Nearly 1 billion people worldwide live with a mental disorder',
      'Less than half receive adequate treatment',
      'Early intervention can prevent 70% of mental health crises',
      'Awareness saves lives – speak up, reach out 💚',
    ],
    message: 'Mental health is not a destination, but a journey. Every step counts.',
    activities: [
      { title: '30-Day Wellness Challenge', description: 'Start a month-long wellness journey', prompt: "It's Mental Health Awareness Month! Create a personalized 30-day mental wellness challenge for me. Include daily micro-activities covering mindfulness, gratitude, exercise, social connection, and self-care.", color: 'green' },
      { title: 'Mental Health First Aid', description: 'Learn to help yourself and others', prompt: "Teach me mental health first aid basics. How can I recognize when I or someone I know is struggling? What are the right things to say, and what should I avoid?", color: 'emerald' },
    ],
  },

  // JUNE
  {
    id: 'mens-mental-health-month',
    title: "June – Men's Mental Health Month",
    icon: 'UserCheck',
    month: 5,
    gradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    borderColor: 'border-blue-200',
    accentColor: 'blue',
    description: "Breaking the stigma around men's mental health.",
    facts: [
      'Men are 3.5x more likely to die by suicide than women',
      "Only 1 in 4 men with mental health issues seek help",
      'Toxic masculinity discourages emotional expression',
      'Vulnerability is strength, not weakness 💙',
    ],
    message: "Real strength is asking for help. Men's mental health deserves attention every day.",
    activities: [
      { title: 'Breaking the Armor', description: 'Safely explore emotions beyond the surface', prompt: "It's Men's Mental Health Month. Help me explore emotions I've been suppressing. I want to break through the 'tough guy' exterior and process what I'm really feeling in a safe, non-judgmental way.", color: 'blue' },
      { title: 'Redefining Strength', description: 'Build healthy emotional habits', prompt: "Help me redefine what strength means for my mental health. Guide me in building healthy emotional habits that include vulnerability, connection, and self-care without feeling weak.", color: 'cyan' },
    ],
  },

  // SEPTEMBER
  {
    id: 'suicide-prevention-day',
    title: 'World Suicide Prevention Day',
    icon: 'HeartPulse',
    month: 8,
    day: 10,
    gradient: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
    borderColor: 'border-yellow-300',
    accentColor: 'yellow',
    description: 'Every life matters. One conversation can save a life.',
    facts: [
      'Over 700,000 people die by suicide globally every year',
      'For every death, there are 20+ attempts',
      'Asking someone if they\'re okay does NOT increase risk',
      'Hope is real. Help is real. Recovery is real 💛',
    ],
    message: "If you're struggling, please reach out. You are not alone, and this moment will pass.",
    activities: [
      { title: 'Hope Building Exercise', description: 'Reconnect with reasons to keep going', prompt: "Today is World Suicide Prevention Day. I want to do a hope-building exercise. Help me identify reasons to keep going, reconnect with my purpose, and build a personal safety plan for difficult moments.", color: 'yellow' },
      { title: 'How to Help Others', description: 'Learn to spot warning signs', prompt: "Teach me how to recognize warning signs of suicidal ideation in others and how to have a supportive conversation. What resources can I share? How do I help without overstepping?", color: 'amber' },
    ],
  },

  // OCTOBER
  {
    id: 'world-mental-health-day',
    title: 'World Mental Health Day',
    icon: 'Globe',
    month: 9,
    day: 10,
    gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    borderColor: 'border-emerald-300',
    accentColor: 'emerald',
    description: 'The global day to raise awareness and mobilize support for mental health.',
    facts: [
      'Theme varies each year but the message is universal',
      'Mental health is a fundamental human right',
      'Investment in mental health returns $4 for every $1 spent',
      'Together, we can create a world where mental health is prioritized 🌍',
    ],
    message: 'Today the whole world stands together for mental health. You are part of something bigger.',
    activities: [
      { title: 'Global Wellness Pledge', description: 'Make a personal commitment', prompt: "It's World Mental Health Day. Help me create a personal wellness pledge – specific commitments I can make to prioritize my mental health this year. Make it meaningful and actionable.", color: 'emerald' },
      { title: 'Stigma-Breaking Reflection', description: 'Challenge your own mental health biases', prompt: "Guide me through a reflection exercise to identify and challenge my own biases and stigma around mental health. Help me become a better advocate for myself and others.", color: 'teal' },
    ],
  },

  // NOVEMBER
  {
    id: 'movember',
    title: "Movember – Men's Health Awareness",
    icon: 'Smile',
    month: 10,
    gradient: 'from-stone-50 to-amber-50 dark:from-stone-900/20 dark:to-amber-900/20',
    borderColor: 'border-stone-300',
    accentColor: 'stone',
    description: "A global movement tackling men's mental health, suicide prevention, and prostate/testicular cancer.",
    facts: [
      'Movember has funded 1,250+ men\'s health projects globally',
      'Men die on average 4.5 years earlier than women',
      'Social isolation is a major risk factor for men',
      'Connection and conversation are powerful medicine 🧔',
    ],
    message: "Grow a mo, start a conversation, save a life. Men's health is everyone's business.",
    activities: [
      { title: 'Check-In With a Mate', description: 'Practice the art of meaningful check-ins', prompt: "It's Movember. Help me practice checking in on a friend or family member's mental health. Give me conversation starters, what to listen for, and how to follow up meaningfully.", color: 'stone' },
      { title: 'Physical-Mental Connection', description: 'Explore how body and mind are linked', prompt: "Help me understand and leverage the connection between physical health and mental health. Create a practical plan that uses exercise, nutrition, and sleep as tools for better mental wellness.", color: 'amber' },
    ],
  },

  // JULY
  {
    id: 'self-care-day',
    title: 'International Self-Care Day',
    icon: 'Heart',
    month: 6,
    day: 24,
    gradient: 'from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20',
    borderColor: 'border-rose-200',
    accentColor: 'rose',
    description: 'A reminder that self-care is not selfish — it is essential.',
    facts: [
      'July 24 (7/24) symbolizes self-care 24 hours a day, 7 days a week',
      'Regular self-care reduces burnout by up to 60%',
      'Even 10 minutes daily can shift your nervous system',
      'You cannot pour from an empty cup ☕',
    ],
    message: 'Today, do one small thing that says: "I matter."',
    activities: [
      { title: 'Build Your Self-Care Menu', description: 'Curate go-to rituals for any mood', prompt: "It's International Self-Care Day. Help me build a personalized self-care menu with quick (5 min), medium (30 min), and deep (2+ hr) options for different moods and energy levels.", color: 'rose' },
      { title: 'Permission Slip Ritual', description: 'Release guilt around resting', prompt: 'Guide me through a "permission slip" ritual where I write myself permission to rest, say no, or take a break without guilt. Help me unpack why self-care feels selfish.', color: 'orange' },
    ],
  },

  // AUGUST
  {
    id: 'friendship-day',
    title: 'International Friendship Day',
    icon: 'HeartHandshake',
    month: 7,
    day: 30,
    gradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
    borderColor: 'border-yellow-200',
    accentColor: 'yellow',
    description: 'Friendships are a powerful protective factor for mental health.',
    facts: [
      'Strong friendships reduce risk of depression by 24%',
      'Loneliness has the same health impact as smoking 15 cigarettes daily',
      'Quality matters more than quantity in friendships',
      'A simple "thinking of you" text can change someone\'s day 🤝',
    ],
    message: 'Reach out today. The friend you miss might miss you too.',
    activities: [
      { title: 'Reconnection Ritual', description: 'Reach out to a friend you miss', prompt: "It's International Friendship Day. Help me draft a heartfelt message to a friend I've drifted from. I want it to feel genuine, not awkward, and open the door to reconnection.", color: 'yellow' },
      { title: 'Friendship Audit', description: 'Reflect on your circle with kindness', prompt: 'Guide me through a gentle friendship audit — which relationships energize me, which drain me, and how I can invest more intentionally in the ones that matter.', color: 'orange' },
    ],
  },

  // SEPTEMBER (additional)
  {
    id: 'self-awareness-month',
    title: 'September – Self-Awareness Month',
    icon: 'Sparkles',
    month: 8,
    gradient: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
    borderColor: 'border-violet-200',
    accentColor: 'violet',
    description: 'Knowing yourself is the beginning of all wisdom.',
    facts: [
      'Only 10-15% of people are truly self-aware',
      'Self-awareness improves decision-making by 32%',
      'Journaling boosts self-awareness within 2 weeks',
      'It is the #1 trait of effective leaders 🪞',
    ],
    message: 'Turn inward this month. The answers you seek are already within you.',
    activities: [
      { title: 'Values Discovery', description: 'Identify what truly matters to you', prompt: "It's Self-Awareness Month. Walk me through a values discovery exercise — help me identify my top 5 core values and how aligned my current life is with them.", color: 'violet' },
      { title: 'Shadow Work Intro', description: 'Gently meet the parts you avoid', prompt: 'Introduce me gently to shadow work. Help me identify a pattern or trait I dislike in others and explore what it might be teaching me about myself.', color: 'purple' },
    ],
  },

  // OCTOBER (additional)
  {
    id: 'anxiety-screening-day',
    title: 'National Anxiety Screening Day',
    icon: 'Shield',
    month: 9,
    day: 11,
    gradient: 'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
    borderColor: 'border-cyan-200',
    accentColor: 'cyan',
    description: 'Anxiety is the most common mental health condition — and highly treatable.',
    facts: [
      '40 million adults in the US alone live with anxiety',
      'Only 36.9% of those suffering receive treatment',
      'Anxiety often hides as anger, perfectionism, or exhaustion',
      'Naming it is the first step to taming it 🌊',
    ],
    message: 'You are not your anxiety. Today, get curious about what your nervous system is telling you.',
    activities: [
      { title: 'Anxiety Decoder', description: 'Translate symptoms into messages', prompt: "It's Anxiety Screening Day. Help me decode my anxiety — what physical sensations am I noticing, what triggers them, and what might my body be trying to tell me?", color: 'cyan' },
      { title: 'Window of Tolerance', description: 'Map your nervous system zones', prompt: 'Teach me about the "window of tolerance" and help me map when I feel hyper-aroused, hypo-aroused, or regulated. Give me grounding techniques for each zone.', color: 'blue' },
    ],
  },

  // DECEMBER
  {
    id: 'holiday-stress',
    title: 'Holiday Season Wellness',
    icon: 'Gift',
    month: 11,
    gradient: 'from-red-50 to-green-50 dark:from-red-900/20 dark:to-green-900/20',
    borderColor: 'border-red-200',
    accentColor: 'red',
    description: "The holidays aren't joyful for everyone. Take care of yourself this season.",
    facts: [
      '64% of people report increased stress during the holidays',
      'Loneliness peaks in December for many people',
      'Financial pressure and family dynamics can trigger anxiety',
      "It's okay to set limits and protect your peace 🎄",
    ],
    message: "Give yourself the gift of grace this holiday season. You don't have to be perfect.",
    activities: [
      { title: 'Holiday Boundaries Workshop', description: 'Learn to protect your peace', prompt: "The holiday season is stressful. Help me set healthy boundaries with family, friends, and social obligations. I want to enjoy the holidays without burning out or losing myself.", color: 'red' },
      { title: 'Loneliness First Aid', description: 'Combat holiday isolation', prompt: "I'm feeling lonely this holiday season. Help me process these feelings and create a plan to feel more connected. Give me both immediate coping strategies and longer-term solutions.", color: 'green' },
    ],
  },
];

export const getActiveEvents = (date: Date): WellnessEvent[] => {
  const month = date.getMonth();
  const day = date.getDate();

  return wellnessEvents.filter((event) => {
    if (event.month !== month) return false;
    if (event.day !== undefined) return event.day === day;
    return true; // month-long event
  });
};
