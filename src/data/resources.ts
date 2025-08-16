
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  content: string;
  image: string;
  tags: string[];
  author: string;
  publishedAt: string;
  helpful: number;
  notHelpful: number;
}

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: A Beginner\'s Guide',
    description: 'Learn about anxiety symptoms, causes, and practical coping strategies.',
    category: 'anxiety',
    readTime: '8 min',
    content: `Anxiety is a natural human emotion that everyone experiences from time to time. However, when anxiety becomes persistent and interferes with daily life, it may indicate an anxiety disorder.

## What is Anxiety?

Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. Common symptoms include:

- Racing thoughts
- Rapid heartbeat
- Sweating
- Restlessness
- Difficulty concentrating

## Common Triggers

Understanding what triggers your anxiety can help you manage it better:

1. **Work or school stress** - Deadlines, presentations, or performance pressure
2. **Social situations** - Meeting new people or public speaking
3. **Health concerns** - Worrying about illness or medical procedures
4. **Financial stress** - Money problems or job security
5. **Life changes** - Moving, relationship changes, or major decisions

## Coping Strategies

Here are some effective techniques to manage anxiety:

### Deep Breathing
Practice the 4-7-8 technique: Inhale for 4 counts, hold for 7, exhale for 8.

### Progressive Muscle Relaxation
Tense and then relax each muscle group in your body, starting from your toes.

### Grounding Techniques
Use the 5-4-3-2-1 method: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.

### Challenge Negative Thoughts
Ask yourself: Is this thought realistic? What evidence do I have? What would I tell a friend in this situation?

## When to Seek Professional Help

Consider reaching out to a mental health professional if:
- Anxiety interferes with daily activities
- You avoid situations due to anxiety
- Physical symptoms are severe
- You're using substances to cope
- Anxiety persists for weeks or months

Remember, seeking help is a sign of strength, not weakness. With proper support and techniques, anxiety can be effectively managed.`,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop',
    tags: ['anxiety', 'mental health', 'coping strategies'],
    author: 'Dr. Sarah Johnson',
    publishedAt: '2024-01-15',
    helpful: 127,
    notHelpful: 8
  },
  {
    id: '2',
    title: 'The Science of Meditation and Mental Wellbeing',
    description: 'Discover how meditation physically changes your brain and improves mental health.',
    category: 'meditation',
    readTime: '12 min',
    content: `Meditation has been practiced for thousands of years, but only recently has science begun to understand its profound effects on the brain and mental health.

## How Meditation Changes Your Brain

Research using brain imaging technology has revealed that regular meditation practice leads to measurable changes in brain structure:

### Increased Gray Matter
Studies show that meditation increases gray matter density in areas associated with:
- Learning and memory (hippocampus)
- Emotional regulation (amygdala)
- Self-awareness (posterior cingulate cortex)

### Improved Neural Connectivity
Meditation strengthens the connections between different brain regions, leading to:
- Better emotional regulation
- Enhanced focus and attention
- Improved decision-making abilities

## Mental Health Benefits

Regular meditation practice has been scientifically proven to:

### Reduce Stress and Anxiety
- Lowers cortisol levels (stress hormone)
- Decreases activity in the amygdala (fear center)
- Improves stress resilience

### Enhance Mood
- Increases serotonin and dopamine production
- Reduces symptoms of depression
- Promotes emotional stability

### Improve Sleep Quality
- Regulates circadian rhythms
- Reduces racing thoughts at bedtime
- Increases melatonin production

## Types of Meditation

### Mindfulness Meditation
Focus on the present moment without judgment. Observe thoughts and feelings as they arise.

**How to practice:**
1. Sit comfortably with eyes closed
2. Focus on your breath
3. When thoughts arise, acknowledge them and return to breath
4. Start with 5-10 minutes daily

### Loving-Kindness Meditation
Cultivate feelings of compassion and love for yourself and others.

**How to practice:**
1. Start by sending love to yourself
2. Extend to loved ones
3. Include neutral people
4. Finally, include difficult people

### Body Scan Meditation
Systematically focus on different parts of your body to promote relaxation.

**How to practice:**
1. Lie down comfortably
2. Start with your toes
3. Slowly move attention up your body
4. Notice sensations without judgment

## Getting Started

### Tips for Beginners:
- Start with just 5 minutes daily
- Use guided meditations initially
- Find a quiet, comfortable space
- Be patient with yourself
- Consistency matters more than duration

### Common Challenges:
- **Racing thoughts:** This is normal! The goal isn't to stop thoughts but to notice them
- **Physical discomfort:** Adjust your position as needed
- **Falling asleep:** Try meditating at a different time or sitting upright
- **Lack of time:** Even 2-3 minutes can be beneficial

## The Science Behind the Benefits

Research from Harvard, UCLA, and other institutions has shown:
- 8 weeks of meditation can measurably change brain structure
- Regular practice reduces inflammation markers
- Meditation can slow cellular aging
- It improves immune system function

Meditation isn't just relaxation—it's brain training that creates lasting positive changes in how we think, feel, and respond to life's challenges.`,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop',
    tags: ['meditation', 'neuroscience', 'brain health'],
    author: 'Dr. Michael Chen',
    publishedAt: '2024-01-20',
    helpful: 203,
    notHelpful: 12
  },
  {
    id: '3',
    title: 'Building Healthy Sleep Habits for Better Mental Health',
    description: 'Learn how sleep affects your mental wellbeing and discover strategies for better rest.',
    category: 'sleep',
    readTime: '10 min',
    content: `Sleep and mental health are intimately connected. Poor sleep can worsen mental health conditions, while mental health issues can disrupt sleep patterns.

## The Sleep-Mental Health Connection

### How Sleep Affects Mental Health:
- **Emotional regulation:** Sleep deprivation makes it harder to manage emotions
- **Stress response:** Poor sleep increases cortisol production
- **Cognitive function:** Lack of sleep impairs decision-making and memory
- **Mood stability:** Sleep loss is linked to increased anxiety and depression

### Mental Health Conditions and Sleep:
- **Depression:** Often involves early morning awakening or oversleeping
- **Anxiety:** Racing thoughts can make it difficult to fall asleep
- **PTSD:** Nightmares and hypervigilance disrupt sleep
- **Bipolar disorder:** Sleep patterns often change with mood episodes

## Signs of Poor Sleep Quality

You may have poor sleep quality if you experience:
- Difficulty falling asleep (taking more than 30 minutes)
- Frequent nighttime awakenings
- Waking up too early and unable to return to sleep
- Feeling unrefreshed despite adequate sleep time
- Daytime fatigue and sleepiness
- Difficulty concentrating during the day

## Sleep Hygiene: Building Better Habits

### Create an Ideal Sleep Environment:
- **Temperature:** Keep bedroom cool (65-68°F)
- **Darkness:** Use blackout curtains or eye masks
- **Quiet:** Consider earplugs or white noise machine
- **Comfort:** Invest in a quality mattress and pillows

### Establish a Consistent Sleep Schedule:
- Go to bed and wake up at the same time daily
- Maintain schedule even on weekends
- Gradually adjust bedtime by 15 minutes if needed
- Avoid "catching up" on sleep with long weekend naps

### Develop a Relaxing Bedtime Routine:
- Start winding down 1-2 hours before bed
- Dim lights in the evening
- Practice relaxation techniques
- Read, listen to calm music, or take a warm bath
- Avoid stimulating activities

## What to Avoid for Better Sleep

### Evening Habits to Eliminate:
- **Screen time:** Blue light suppresses melatonin production
- **Large meals:** Eating heavily within 3 hours of bedtime
- **Caffeine:** Avoid after 2 PM (it stays in your system 6-8 hours)
- **Alcohol:** While it may help you fall asleep, it disrupts sleep quality
- **Intense exercise:** Vigorous workouts within 3 hours of bedtime

### Daytime Factors:
- **Long naps:** Limit to 20-30 minutes before 3 PM
- **Irregular schedule:** Varying sleep times confuse your body clock
- **Bedroom activities:** Use bed only for sleep and intimacy

## Natural Sleep Aids and Techniques

### Relaxation Techniques:
1. **4-7-8 Breathing:** Inhale for 4, hold for 7, exhale for 8
2. **Progressive muscle relaxation:** Tense and release muscle groups
3. **Visualization:** Imagine peaceful, calming scenes
4. **Meditation:** Practice mindfulness or body scan techniques

### Natural Supplements (consult healthcare provider first):
- **Melatonin:** Helps regulate sleep-wake cycle
- **Magnesium:** Promotes muscle relaxation
- **Chamomile tea:** Has mild sedative effects
- **Valerian root:** Traditional herb for sleep support

## When to Seek Professional Help

Consider consulting a healthcare provider if:
- Sleep problems persist for more than 2-3 weeks
- You experience loud snoring or gasping during sleep
- Daytime sleepiness affects work or relationships
- You feel anxious or depressed about sleep
- Sleep medications aren't helping

## Sleep Disorders to Be Aware Of:
- **Sleep apnea:** Breathing interruptions during sleep
- **Insomnia:** Chronic difficulty falling or staying asleep
- **Restless leg syndrome:** Uncomfortable sensations in legs
- **Narcolepsy:** Excessive daytime sleepiness

Remember, improving sleep takes time and patience. Small, consistent changes to your sleep habits can lead to significant improvements in both sleep quality and mental health.`,
    image: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=800&auto=format&fit=crop',
    tags: ['sleep', 'mental health', 'wellness'],
    author: 'Dr. Lisa Rodriguez',
    publishedAt: '2024-01-25',
    helpful: 156,
    notHelpful: 7
  },
  {
    id: '4',
    title: 'Stress Management Techniques for Daily Life',
    description: 'Practical strategies to manage stress and build resilience in your everyday routine.',
    category: 'stress',
    readTime: '9 min',
    content: `Stress is an inevitable part of life, but how we manage it makes all the difference. Learning effective stress management techniques can improve both your mental and physical health.

## Understanding Stress

### Types of Stress:
- **Acute stress:** Short-term stress from immediate challenges
- **Chronic stress:** Long-term stress from ongoing situations
- **Eustress:** Positive stress that motivates and energizes
- **Distress:** Negative stress that overwhelms and depletes

### Physical Signs of Stress:
- Headaches or muscle tension
- Fatigue or sleep problems
- Digestive issues
- Changes in appetite
- Frequent illness

### Emotional Signs of Stress:
- Feeling overwhelmed or anxious
- Irritability or mood swings
- Low motivation or energy
- Restlessness
- Difficulty concentrating

## Quick Stress Relief Techniques

### The 5-4-3-2-1 Grounding Technique:
When feeling overwhelmed, identify:
- 5 things you can see
- 4 things you can touch
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

### Box Breathing:
1. Inhale for 4 counts
2. Hold for 4 counts
3. Exhale for 4 counts
4. Hold empty for 4 counts
5. Repeat 4-6 times

### Progressive Muscle Relaxation:
- Start with your toes
- Tense each muscle group for 5 seconds
- Release and notice the relaxation
- Move up through your entire body

## Long-Term Stress Management

### Regular Exercise:
- Releases endorphins (natural mood boosters)
- Reduces stress hormones like cortisol
- Improves sleep quality
- Aim for 30 minutes of moderate activity most days

### Healthy Eating:
- Maintain stable blood sugar with regular meals
- Limit caffeine and alcohol
- Include omega-3 fatty acids (fish, walnuts)
- Stay hydrated throughout the day

### Time Management:
- Prioritize tasks using the "important vs. urgent" matrix
- Break large projects into smaller steps
- Learn to say "no" to non-essential commitments
- Schedule breaks and downtime

### Social Support:
- Maintain connections with family and friends
- Join support groups or clubs
- Consider professional counseling
- Practice expressing your feelings

## Cognitive Strategies

### Challenge Negative Thoughts:
Ask yourself:
- Is this thought realistic?
- What evidence supports or contradicts it?
- What would I tell a friend in this situation?
- What's the worst that could realistically happen?

### Reframe Stressful Situations:
- Focus on what you can control
- Look for learning opportunities
- Consider different perspectives
- Practice gratitude for what's going well

### Mindfulness Practices:
- Regular meditation or prayer
- Mindful eating or walking
- Present-moment awareness
- Acceptance of difficult emotions

## Building Stress Resilience

### Develop Coping Skills:
- Problem-solving techniques
- Emotional regulation strategies
- Communication skills
- Conflict resolution abilities

### Create Stress-Reducing Routines:
- Morning routine for positive start
- Regular breaks during work
- Evening wind-down activities
- Weekly stress-relief activities

### Lifestyle Changes:
- Maintain work-life boundaries
- Pursue hobbies and interests
- Practice relaxation techniques daily
- Get adequate sleep (7-9 hours)

## When Stress Becomes Overwhelming

### Warning Signs:
- Persistent anxiety or depression
- Substance use to cope
- Physical symptoms without medical cause
- Relationship or work problems
- Thoughts of self-harm

### Professional Help Options:
- **Therapy:** CBT, mindfulness-based stress reduction
- **Medication:** If recommended by healthcare provider
- **Support groups:** Peer support and shared experiences
- **Employee assistance programs:** Workplace resources

## Creating Your Personal Stress Management Plan

1. **Identify your stress triggers**
2. **Choose 2-3 techniques that appeal to you**
3. **Practice them regularly, not just during stress**
4. **Monitor what works best for your situation**
5. **Adjust your plan as needed**

Remember, stress management is a skill that improves with practice. Be patient with yourself as you develop these new habits and techniques.`,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
    tags: ['stress', 'coping strategies', 'resilience'],
    author: 'Dr. James Wilson',
    publishedAt: '2024-02-01',
    helpful: 189,
    notHelpful: 15
  },
  {
    id: '5',
    title: 'Mindfulness in Daily Life: Simple Practices for Busy People',
    description: 'Incorporate mindfulness into your routine with these easy, practical exercises.',
    category: 'mindfulness',
    readTime: '7 min',
    content: `Mindfulness doesn't require hours of meditation. You can integrate mindful practices into your daily routine to reduce stress and increase awareness.

## What is Mindfulness?

Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. It involves:
- Paying attention to thoughts, feelings, and sensations
- Accepting experiences without trying to change them
- Staying grounded in the present rather than dwelling on past or future

## Benefits of Daily Mindfulness

### Mental Health Benefits:
- Reduced anxiety and depression
- Improved emotional regulation
- Enhanced focus and concentration
- Greater self-awareness

### Physical Health Benefits:
- Lower blood pressure
- Improved immune function
- Better sleep quality
- Reduced chronic pain

## Mindful Morning Practices

### Mindful Awakening (2 minutes):
Before getting out of bed:
1. Take three deep breaths
2. Notice how your body feels
3. Set a positive intention for the day
4. Express gratitude for three things

### Mindful Shower:
- Feel the water temperature and pressure
- Notice the scents of soap or shampoo
- Pay attention to physical sensations
- Let worries wash away with the water

### Mindful Coffee/Tea:
- Hold the warm cup in your hands
- Inhale the aroma deeply
- Taste each sip slowly
- Feel grateful for this moment of warmth

## Workplace Mindfulness

### The One-Minute Reset:
Between meetings or tasks:
1. Close your eyes or soften your gaze
2. Take 5 deep breaths
3. Notice your posture and adjust if needed
4. Return to work with renewed focus

### Mindful Email:
- Pause before opening your inbox
- Read each email completely before responding
- Take a breath between emails
- Notice any emotional reactions without judgment

### Walking Meditation:
- Walk slightly slower than usual
- Feel your feet contacting the ground
- Notice your surroundings
- Coordinate breathing with steps

## Mindful Eating

### Before Eating:
- Look at your food and appreciate its colors and textures
- Take a moment to feel grateful
- Notice hunger levels
- Eliminate distractions (TV, phone, reading)

### During Eating:
- Chew slowly and thoroughly
- Notice flavors, textures, and temperature
- Put utensils down between bites
- Pay attention to satiety cues

### After Eating:
- Notice how the food made you feel
- Appreciate the nourishment
- Clean up mindfully
- Express gratitude

## Evening Mindfulness

### Technology Wind-Down:
- Set a "digital sunset" 1 hour before bed
- Notice the urge to check devices
- Replace screen time with calming activities
- Practice the STOP technique when reaching for phone

### Body Scan for Sleep:
1. Lie comfortably in bed
2. Start with your toes
3. Notice sensations in each body part
4. Release tension as you go
5. End with your head and face

### Gratitude Practice:
- Write down 3 good things from your day
- Include why each thing was meaningful
- Notice positive emotions
- Fall asleep with appreciation

## Mindful Communication

### Active Listening:
- Give your full attention to the speaker
- Notice urges to interrupt or judge
- Listen to understand, not to respond
- Reflect back what you heard

### Mindful Speaking:
- Pause before responding
- Consider your words carefully
- Speak from kindness rather than reactivity
- Notice the tone and pace of your voice

### Conflict Resolution:
- Take deep breaths during disagreements
- Notice emotional reactions without acting on them
- Respond rather than react
- Look for common ground

## Micro-Mindfulness Practices

### Red Light Meditation:
Use traffic lights as mindfulness cues:
- Take three deep breaths
- Notice your surroundings
- Relax your shoulders
- Appreciate the pause

### Waiting Mindfully:
Instead of getting frustrated:
- Use waiting as a gift of time
- Practice breathing exercises
- Observe your environment
- Practice patience and acceptance

### Transitions:
Between activities:
- Pause for 10 seconds
- Take a conscious breath
- Notice your mental state
- Set intention for next activity

## Building Your Mindfulness Habit

### Start Small:
- Choose one practice to focus on
- Commit to 2-3 minutes daily
- Use reminders or apps
- Be consistent rather than perfect

### Common Challenges:
- **Forgetting to practice:** Set phone reminders
- **Mind wandering:** This is normal and expected
- **Feeling too busy:** Start with 30-second practices
- **Judging your practice:** Remember there's no "perfect" mindfulness

### Track Your Progress:
- Notice changes in stress levels
- Observe improvements in focus
- Pay attention to emotional reactions
- Celebrate small wins

Remember, mindfulness is called a "practice" because it's something we continually develop. Each moment offers a new opportunity to be present and aware.`,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=800&auto=format&fit=crop',
    tags: ['mindfulness', 'daily practice', 'stress reduction'],
    author: 'Dr. Emma Thompson',
    publishedAt: '2024-02-05',
    helpful: 234,
    notHelpful: 6
  },
  {
    id: '6',
    title: 'Understanding Depression: Signs, Symptoms, and Support',
    description: 'Comprehensive guide to recognizing depression and finding appropriate help and treatment.',
    category: 'depression',
    readTime: '11 min',
    content: `Depression is more than just feeling sad or going through a rough patch. It's a serious mental health condition that affects how you feel, think, and handle daily activities.

## What is Depression?

Depression, also known as major depressive disorder, is a mood disorder that causes persistent feelings of sadness and loss of interest. It affects how you think, feel, and behave and can lead to various emotional and physical problems.

### Key Characteristics:
- Persistent sad, anxious, or empty mood
- Loss of interest in activities once enjoyed
- Significant changes in appetite or weight
- Sleep disturbances
- Fatigue or loss of energy
- Difficulty concentrating or making decisions

## Types of Depression

### Major Depressive Disorder:
- Episodes lasting at least 2 weeks
- Significantly impacts daily functioning
- May occur once or multiple times

### Persistent Depressive Disorder (Dysthymia):
- Long-term depression lasting 2+ years
- Less severe but more chronic
- May have periods of normal mood

### Seasonal Affective Disorder (SAD):
- Depression during specific seasons (usually fall/winter)
- Related to changes in daylight
- Often improves with light therapy

### Postpartum Depression:
- Occurs after childbirth
- More severe than "baby blues"
- Can affect bonding with baby

## Recognizing the Signs

### Emotional Symptoms:
- Persistent sadness or hopelessness
- Irritability or frustration
- Feelings of worthlessness or guilt
- Loss of interest in activities
- Anxiety or restlessness

### Physical Symptoms:
- Changes in appetite or weight
- Sleep problems (insomnia or oversleeping)
- Fatigue or low energy
- Headaches or body aches
- Digestive problems

### Cognitive Symptoms:
- Difficulty concentrating
- Memory problems
- Indecisiveness
- Negative thought patterns
- Thoughts of death or suicide

### Behavioral Changes:
- Withdrawing from family and friends
- Neglecting responsibilities
- Substance use
- Reduced self-care
- Decreased productivity

## Understanding the Causes

### Biological Factors:
- **Genetics:** Family history increases risk
- **Brain chemistry:** Imbalances in neurotransmitters
- **Hormones:** Changes during pregnancy, menopause, or thyroid problems
- **Medical conditions:** Chronic illness, pain, or certain medications

### Psychological Factors:
- **Trauma:** Childhood abuse, loss, or neglect
- **Stress:** Major life changes or chronic stress
- **Personality traits:** Low self-esteem or pessimistic thinking
- **Other mental health conditions:** Anxiety, PTSD, or substance abuse

### Environmental Factors:
- **Life events:** Death of loved one, divorce, job loss
- **Social isolation:** Lack of support system
- **Financial problems:** Economic stress
- **Relationship issues:** Conflict or abuse

## Coping Strategies

### Self-Care Basics:
- **Maintain routine:** Regular sleep, meals, and activities
- **Exercise regularly:** Even 10-15 minutes can help
- **Eat nutritiously:** Balanced meals support brain health
- **Limit alcohol:** It can worsen depression symptoms
- **Stay connected:** Reach out to supportive people

### Thought Management:
- **Challenge negative thoughts:** Ask for evidence and alternative perspectives
- **Practice gratitude:** Focus on positive aspects of life
- **Mindfulness:** Stay present rather than dwelling on past or future
- **Self-compassion:** Treat yourself with kindness

### Activity Scheduling:
- **Plan pleasant activities:** Schedule things you used to enjoy
- **Start small:** Begin with manageable tasks
- **Celebrate accomplishments:** Acknowledge even small victories
- **Structure your day:** Having a plan can provide stability

## Professional Treatment Options

### Psychotherapy:
- **Cognitive Behavioral Therapy (CBT):** Changes negative thought patterns
- **Interpersonal Therapy:** Focuses on relationship issues
- **Psychodynamic Therapy:** Explores unconscious patterns
- **Dialectical Behavior Therapy (DBT):** Teaches coping skills

### Medication:
- **Antidepressants:** May take 4-6 weeks to show effects
- **Types:** SSRIs, SNRIs, tricyclics, MAOIs
- **Side effects:** Discuss with healthcare provider
- **Monitoring:** Regular follow-ups important

### Alternative Treatments:
- **Light therapy:** For seasonal depression
- **Exercise therapy:** Structured physical activity
- **Mindfulness-based therapy:** Combines meditation with therapy
- **Electroconvulsive therapy (ECT):** For severe, treatment-resistant cases

## Supporting Someone with Depression

### What to Do:
- Listen without judgment
- Offer specific help
- Encourage professional treatment
- Be patient and understanding
- Take care of yourself too

### What to Say:
- "I'm here for you"
- "This isn't your fault"
- "You matter to me"
- "Let's find help together"
- "I believe you can get through this"

### What Not to Say:
- "Just think positive"
- "Others have it worse"
- "Snap out of it"
- "It's all in your head"
- "You just need to try harder"

## When to Seek Immediate Help

### Emergency Situations:
Call 911 or go to emergency room if someone:
- Talks about suicide or death
- Has a plan to harm themselves
- Gives away possessions
- Says goodbye to people
- Shows sudden mood improvement after severe depression

### Crisis Resources:
- **National Suicide Prevention Lifeline:** 988
- **Crisis Text Line:** Text HOME to 741741
- **Emergency services:** 911
- **Local crisis centers:** Search online for local resources

## Building a Support Network

### Professional Support:
- Primary care physician
- Mental health therapist
- Psychiatrist if medication needed
- Support groups

### Personal Support:
- Family members
- Close friends
- Religious or spiritual community
- Online support communities

## Hope and Recovery

Depression is treatable, and most people see improvement with proper care. Recovery is possible, and many people go on to live fulfilling lives. Remember:

- Treatment takes time - be patient
- Setbacks are normal - don't give up
- Small improvements count
- You are not alone in this journey
- Professional help is available and effective

If you're struggling with depression, reach out for help. It's a sign of strength, not weakness, to seek support.`,
    image: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?q=80&w=800&auto=format&fit=crop',
    tags: ['depression', 'mental health', 'treatment', 'support'],
    author: 'Dr. Rachel Martinez',
    publishedAt: '2024-02-10',
    helpful: 176,
    notHelpful: 9
  }
];

export const categories = [
  { value: 'all', label: 'All Resources' },
  { value: 'anxiety', label: 'Anxiety & Worry' },
  { value: 'depression', label: 'Depression & Mood' },
  { value: 'meditation', label: 'Meditation & Practice' },
  { value: 'mindfulness', label: 'Mindfulness & Awareness' },
  { value: 'stress', label: 'Stress Management' },
  { value: 'sleep', label: 'Sleep & Rest' },
];
