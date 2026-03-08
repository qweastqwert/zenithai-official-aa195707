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

export const categories = [
  { value: 'all', label: 'All' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'stress', label: 'Stress' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'self-care', label: 'Self-Care' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'grief', label: 'Grief' },
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: A Comprehensive Guide',
    description: 'Learn about anxiety symptoms, causes, and evidence-based coping strategies to manage your mental wellbeing.',
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

## Evidence-Based Coping Strategies

Here are scientifically proven techniques to manage anxiety:

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
    tags: ['anxiety', 'mental health', 'coping strategies', 'wellness'],
    author: 'Dr. Sarah Johnson',
    publishedAt: '2024-01-15',
    helpful: 342,
    notHelpful: 12
  },
  {
    id: '2',
    title: 'The Power of Mindfulness Meditation',
    description: 'Explore the benefits of mindfulness meditation for reducing stress and enhancing overall wellbeing.',
    category: 'meditation',
    readTime: '6 min',
    content: `Mindfulness meditation is a simple yet powerful practice that can significantly reduce stress and improve your overall wellbeing. By focusing on the present moment, you can calm your mind and gain a new perspective on life's challenges.

## What is Mindfulness Meditation?

Mindfulness meditation involves sitting quietly and paying attention to your breath, body sensations, thoughts, and emotions without judgment. The goal is not to empty your mind, but to observe your thoughts and feelings as they arise and pass away.

## Benefits of Mindfulness Meditation

- Reduces stress and anxiety
- Improves focus and concentration
- Enhances self-awareness
- Promotes emotional regulation
- Increases compassion and empathy
- Improves sleep quality

## How to Practice Mindfulness Meditation

1. **Find a quiet place:** Sit comfortably in a quiet place where you won't be disturbed.
2. **Set a timer:** Start with 5-10 minutes and gradually increase the duration as you become more comfortable.
3. **Focus on your breath:** Pay attention to the sensation of your breath entering and leaving your body.
4. **Observe your thoughts:** As thoughts arise, acknowledge them without judgment and gently redirect your attention back to your breath.
5. **Be patient:** It's normal for your mind to wander. Just gently bring your attention back to your breath each time.

## Tips for Beginners

- Start with short sessions and gradually increase the duration.
- Be patient with yourself and don't get discouraged if your mind wanders.
- Practice regularly to experience the full benefits of mindfulness meditation.
- Consider using guided meditations to help you get started.

Mindfulness meditation is a valuable tool for managing stress and improving your overall wellbeing. By incorporating this practice into your daily routine, you can cultivate a greater sense of calm, focus, and self-awareness.`,
    image: 'https://images.unsplash.com/photo-1506126618818-88ebb369818f?q=80&w=800&auto=format&fit=crop',
    tags: ['meditation', 'mindfulness', 'stress reduction', 'wellness'],
    author: 'Emily Carter',
    publishedAt: '2024-02-01',
    helpful: 287,
    notHelpful: 8
  },
  {
    id: '3',
    title: 'Creating a Relaxing Bedtime Routine for Better Sleep',
    description: 'Establish a consistent bedtime routine to improve sleep quality and wake up feeling refreshed.',
    category: 'sleep',
    readTime: '7 min',
    content: `A relaxing bedtime routine can significantly improve your sleep quality and help you wake up feeling refreshed. By creating a consistent and calming routine, you can signal to your body that it's time to sleep and prepare your mind for rest.

## Why is a Bedtime Routine Important?

- Regulates your body's natural sleep-wake cycle
- Reduces stress and anxiety
- Promotes relaxation and calmness
- Improves sleep quality and duration
- Helps you fall asleep faster

## Elements of a Relaxing Bedtime Routine

1. **Set a consistent sleep schedule:** Go to bed and wake up at the same time every day, even on weekends.
2. **Create a calming environment:** Make sure your bedroom is dark, quiet, and cool.
3. **Avoid screens before bed:** The blue light emitted from screens can interfere with sleep.
4. **Practice relaxation techniques:** Try deep breathing, meditation, or gentle stretching.
5. **Read a book:** Reading can help you relax and unwind before bed.
6. **Take a warm bath or shower:** The warm water can help relax your muscles and calm your mind.
7. **Drink herbal tea:** Chamomile or lavender tea can promote relaxation and sleep.

## Tips for Creating a Bedtime Routine

- Start small and gradually add more elements to your routine.
- Be consistent and stick to your routine as much as possible.
- Avoid caffeine and alcohol before bed.
- Make sure your mattress and pillows are comfortable.
- Consider using a white noise machine to block out distracting sounds.

A relaxing bedtime routine is a valuable tool for improving your sleep quality and overall wellbeing. By incorporating these elements into your nightly routine, you can create a peaceful and restful sleep environment.`,
    image: 'https://images.unsplash.com/photo-1487730116645-74489c90bad4?q=80&w=800&auto=format&fit=crop',
    tags: ['sleep', 'bedtime routine', 'relaxation', 'wellness'],
    author: 'David Brown',
    publishedAt: '2024-02-15',
    helpful: 256,
    notHelpful: 5
  },
  {
    id: '4',
    title: 'Effective Strategies for Managing Stress in Daily Life',
    description: 'Discover practical strategies for managing stress and improving your overall quality of life.',
    category: 'stress',
    readTime: '9 min',
    content: `Stress is a common part of modern life, but chronic stress can have negative effects on your physical and mental health. By implementing effective stress management strategies, you can improve your overall quality of life and build resilience to life's challenges.

## What is Stress?

Stress is your body's response to any demand or pressure. It can be triggered by a variety of factors, including work, relationships, finances, and health concerns.

## Symptoms of Stress

- Headaches
- Muscle tension
- Fatigue
- Irritability
- Difficulty concentrating
- Sleep problems
- Digestive issues

## Effective Stress Management Strategies

1. **Identify your stressors:** Keep a journal to track what triggers your stress.
2. **Practice relaxation techniques:** Deep breathing, meditation, and yoga can help calm your mind and body.
3. **Exercise regularly:** Physical activity can help reduce stress hormones and improve your mood.
4. **Get enough sleep:** Aim for 7-8 hours of sleep per night.
5. **Eat a healthy diet:** Avoid processed foods, caffeine, and alcohol.
6. **Connect with others:** Spend time with friends and family.
7. **Set realistic goals:** Avoid overcommitting yourself.
8. **Learn to say no:** Don't be afraid to decline requests that will add to your stress.
9. **Take breaks:** Schedule regular breaks throughout the day to relax and recharge.
10. **Seek professional help:** If stress is interfering with your daily life, consider talking to a therapist or counselor.

## Tips for Managing Stress

- Prioritize your tasks and focus on what's most important.
- Break down large tasks into smaller, more manageable steps.
- Delegate tasks when possible.
- Practice self-care activities, such as taking a bath or reading a book.
- Listen to music or spend time in nature.
- Engage in hobbies and activities you enjoy.

By implementing these stress management strategies, you can reduce the negative impact of stress on your life and improve your overall wellbeing.`,
    image: 'https://images.unsplash.com/photo-1518611012114-b63536dc5ee3?q=80&w=800&auto=format&fit=crop',
    tags: ['stress', 'stress management', 'coping strategies', 'wellness'],
    author: 'Jennifer Davis',
    publishedAt: '2024-03-01',
    helpful: 234,
    notHelpful: 10
  },
  {
    id: '5',
    title: 'The Art of Mindful Living: Finding Peace in the Present Moment',
    description: 'Learn how to cultivate mindfulness in your daily life and experience greater peace and contentment.',
    category: 'mindfulness',
    readTime: '7 min',
    content: `Mindful living is the practice of paying attention to the present moment without judgment. By cultivating mindfulness, you can experience greater peace, contentment, and appreciation for life's simple pleasures.

## What is Mindfulness?

Mindfulness is the quality of being present and fully engaged in whatever you're doing, without getting caught up in thoughts or emotions. It involves observing your thoughts and feelings as they arise and pass away, without judgment or attachment.

## Benefits of Mindful Living

- Reduces stress and anxiety
- Improves focus and concentration
- Enhances self-awareness
- Promotes emotional regulation
- Increases compassion and empathy
- Improves relationships
- Enhances overall wellbeing

## How to Practice Mindful Living

1. **Start with mindfulness meditation:** Practice mindfulness meditation for a few minutes each day.
2. **Pay attention to your senses:** Notice the sights, sounds, smells, tastes, and textures around you.
3. **Engage in mindful activities:** Practice mindfulness while doing everyday activities, such as eating, walking, or washing dishes.
4. **Observe your thoughts and emotions:** Notice your thoughts and emotions as they arise, without judgment or attachment.
5. **Be present in your relationships:** Give your full attention to the people you're with.
6. **Practice gratitude:** Take time each day to appreciate the good things in your life.
7. **Be kind to yourself:** Treat yourself with compassion and understanding.

## Tips for Cultivating Mindfulness

- Start small and gradually increase the amount of time you spend practicing mindfulness.
- Be patient with yourself and don't get discouraged if your mind wanders.
- Practice regularly to experience the full benefits of mindful living.
- Consider taking a mindfulness course or workshop.

Mindful living is a valuable tool for improving your overall wellbeing and experiencing greater peace and contentment. By incorporating mindfulness into your daily life, you can cultivate a greater sense of presence, awareness, and appreciation for the present moment.`,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    tags: ['mindfulness', 'mindful living', 'present moment', 'wellness'],
    author: 'Michael Wilson',
    publishedAt: '2024-03-15',
    helpful: 212,
    notHelpful: 7
  },
  {
    id: '6',
    title: 'The Importance of Self-Care: Nurturing Your Mind, Body, and Soul',
    description: 'Discover the importance of self-care and learn how to incorporate self-care activities into your daily routine.',
    category: 'self-care',
    readTime: '8 min',
    content: `Self-care is the practice of taking care of your physical, mental, and emotional health. It's about recognizing your own needs and taking steps to meet them. Self-care is not selfish; it's essential for your wellbeing.

## Why is Self-Care Important?

- Reduces stress and anxiety
- Improves mood
- Enhances self-esteem
- Promotes physical health
- Improves relationships
- Increases productivity
- Enhances overall wellbeing

## Types of Self-Care

- **Physical self-care:** Getting enough sleep, eating a healthy diet, exercising regularly, and taking care of your hygiene.
- **Mental self-care:** Engaging in activities that stimulate your mind, such as reading, learning new things, or doing puzzles.
- **Emotional self-care:** Expressing your feelings, setting boundaries, and practicing self-compassion.
- **Social self-care:** Spending time with friends and family, joining a club or group, and volunteering.
- **Spiritual self-care:** Connecting with your values, beliefs, and purpose in life.

## Self-Care Activities

- Taking a bath or shower
- Reading a book
- Listening to music
- Spending time in nature
- Practicing yoga or meditation
- Getting a massage
- Spending time with friends and family
- Engaging in hobbies and activities you enjoy
- Setting boundaries
- Saying no to requests that will add to your stress
- Practicing self-compassion

## Tips for Incorporating Self-Care into Your Daily Routine

- Schedule self-care activities into your calendar.
- Start small and gradually increase the amount of time you spend on self-care.
- Be consistent and make self-care a priority.
- Don't feel guilty about taking time for yourself.
- Ask for help when you need it.

Self-care is a valuable tool for improving your overall wellbeing and living a happier, healthier life. By incorporating self-care activities into your daily routine, you can nurture your mind, body, and soul.`,
    image: 'https://images.unsplash.com/photo-1490750967865-8a6944ba0c9f?q=80&w=800&auto=format&fit=crop',
    tags: ['self-care', 'wellness', 'mind', 'body', 'soul'],
    author: 'Jessica White',
    publishedAt: '2024-04-01',
    helpful: 198,
    notHelpful: 6
  },
  {
    id: '7',
    title: 'Building Strong Relationships: Communication, Trust, and Respect',
    description: 'Learn how to build strong and healthy relationships based on communication, trust, and respect.',
    category: 'relationships',
    readTime: '10 min',
    content: `Relationships are an essential part of human life. Strong and healthy relationships can provide support, companionship, and joy. However, relationships can also be challenging and require effort to maintain.

## Key Elements of Strong Relationships

- **Communication:** Open and honest communication is essential for building trust and resolving conflicts.
- **Trust:** Trust is the foundation of any strong relationship. It involves being reliable, honest, and supportive.
- **Respect:** Respect involves valuing the other person's opinions, feelings, and boundaries.
- **Empathy:** Empathy involves understanding and sharing the other person's feelings.
- **Compromise:** Compromise involves finding solutions that work for both people.
- **Forgiveness:** Forgiveness involves letting go of anger and resentment.
- **Support:** Support involves being there for the other person during difficult times.
- **Appreciation:** Appreciation involves expressing gratitude for the other person's presence in your life.

## Tips for Building Strong Relationships

- Communicate openly and honestly.
- Listen actively to the other person.
- Show empathy and understanding.
- Respect the other person's opinions, feelings, and boundaries.
- Be reliable and trustworthy.
- Forgive each other for mistakes.
- Support each other during difficult times.
- Express gratitude and appreciation.
- Spend quality time together.
- Engage in activities you both enjoy.
- Celebrate each other's successes.
- Resolve conflicts in a healthy way.
- Seek professional help if needed.

## Common Relationship Challenges

- Communication problems
- Trust issues
- Lack of respect
- Infidelity
- Financial problems
- Family conflicts
- Different values and goals

Building strong and healthy relationships requires effort, commitment, and a willingness to work through challenges. By focusing on communication, trust, and respect, you can create relationships that are supportive, fulfilling, and long-lasting.`,
    image: 'https://images.unsplash.com/photo-1505904267569-2c9e4cb42258?q=80&w=800&auto=format&fit=crop',
    tags: ['relationships', 'communication', 'trust', 'respect'],
    author: 'Robert Green',
    publishedAt: '2024-04-15',
    helpful: 185,
    notHelpful: 9
  },
  {
    id: '8',
    title: 'Boosting Productivity: Time Management, Focus, and Organization',
    description: 'Discover effective strategies for boosting productivity and achieving your goals.',
    category: 'productivity',
    readTime: '11 min',
    content: `Productivity is the ability to achieve your goals efficiently and effectively. By improving your time management, focus, and organization skills, you can boost your productivity and achieve more in less time.

## Key Elements of Productivity

- **Time management:** Planning and organizing your time to maximize efficiency.
- **Focus:** Concentrating on the task at hand without distractions.
- **Organization:** Keeping your workspace and tasks organized.
- **Goal setting:** Setting clear and achievable goals.
- **Prioritization:** Identifying and focusing on the most important tasks.
- **Delegation:** Assigning tasks to others when possible.
- **Elimination:** Eliminating unnecessary tasks and distractions.
- **Automation:** Automating repetitive tasks.
- **Breaks:** Taking regular breaks to avoid burnout.
- **Self-care:** Taking care of your physical and mental health.

## Time Management Techniques

- **The Pomodoro Technique:** Working in focused 25-minute intervals with short breaks in between.
- **Time blocking:** Scheduling specific blocks of time for different tasks.
- **The Eisenhower Matrix:** Prioritizing tasks based on urgency and importance.
- **The Pareto Principle:** Focusing on the 20% of tasks that produce 80% of the results.

## Focus Techniques

- **Eliminate distractions:** Turn off notifications, close unnecessary tabs, and find a quiet workspace.
- **Practice mindfulness:** Focus on the present moment and avoid getting caught up in thoughts or emotions.
- **Use noise-canceling headphones:** Block out distracting sounds.
- **Take breaks:** Regular breaks can help you stay focused and avoid burnout.
- **Get enough sleep:** Sleep deprivation can impair focus and concentration.

## Organization Techniques

- **Use a planner or calendar:** Keep track of your tasks, appointments, and deadlines.
- **Create a to-do list:** Write down all the tasks you need to complete.
- **Prioritize your tasks:** Focus on the most important tasks first.
- **Break down large tasks into smaller, more manageable steps.
- **Keep your workspace clean and organized.
- **Use folders and labels to organize your files.
- **Automate repetitive tasks.

Boosting productivity requires a combination of time management, focus, and organization skills. By implementing these strategies, you can achieve your goals more efficiently and effectively.`,
    image: 'https://images.unsplash.com/photo-1587560699336-eaa4149ba22e?q=80&w=800&auto=format&fit=crop',
    tags: ['productivity', 'time management', 'focus', 'organization'],
    author: 'Laura Smith',
    publishedAt: '2024-05-01',
    helpful: 172,
    notHelpful: 4
  },
  {
    id: '9',
    title: 'Understanding Depression: Signs, Symptoms, and Seeking Help',
    description: 'Learn about depression, its symptoms, and how to take the first steps toward healing.',
    category: 'depression',
    readTime: '9 min',
    content: `Depression is more than just feeling sad. It's a serious mental health condition that affects how you think, feel, and handle daily activities. Understanding depression is the first step toward getting better.

## What is Depression?

Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest. It affects how you feel, think, and behave and can lead to various emotional and physical problems.

## Common Signs and Symptoms

- Persistent sad, anxious, or "empty" mood
- Feelings of hopelessness or pessimism
- Irritability or frustration
- Loss of interest in hobbies and activities
- Decreased energy or fatigue
- Difficulty concentrating or making decisions
- Sleep problems (insomnia or oversleeping)
- Changes in appetite or weight
- Thoughts of death or suicide
- Physical aches and pains without clear cause

## Types of Depression

- **Major Depressive Disorder:** Severe symptoms that interfere with daily life
- **Persistent Depressive Disorder:** Chronic depression lasting 2+ years
- **Seasonal Affective Disorder:** Depression related to seasonal changes
- **Postpartum Depression:** Depression after giving birth
- **Bipolar Disorder:** Cycling between depression and mania

## Getting Help

1. **Talk to someone you trust** - Friends, family, or a counselor
2. **See a healthcare provider** - They can help diagnose and treat depression
3. **Consider therapy** - Cognitive behavioral therapy (CBT) is highly effective
4. **Explore medication** - Antidepressants can help balance brain chemistry
5. **Practice self-care** - Exercise, sleep, and nutrition matter

## Self-Help Strategies

- Maintain a routine
- Set small, achievable goals
- Exercise regularly (even a short walk helps)
- Connect with others
- Avoid alcohol and drugs
- Practice gratitude
- Be patient with yourself

Remember: Depression is treatable, and recovery is possible. You don't have to face it alone.`,
    image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?q=80&w=800&auto=format&fit=crop',
    tags: ['depression', 'mental health', 'therapy', 'wellness'],
    author: 'Dr. Michael Chen',
    publishedAt: '2024-05-15',
    helpful: 289,
    notHelpful: 8
  },
  {
    id: '10',
    title: 'Building Self-Esteem: Learning to Value Yourself',
    description: 'Practical strategies for developing healthy self-esteem and self-worth.',
    category: 'self-care',
    readTime: '7 min',
    content: `Self-esteem is how we value and perceive ourselves. Healthy self-esteem is essential for mental wellbeing and living a fulfilling life.

## What is Self-Esteem?

Self-esteem refers to our overall sense of worth and value. People with healthy self-esteem generally feel positive about themselves and their abilities, while those with low self-esteem often struggle with self-doubt and criticism.

## Signs of Low Self-Esteem

- Negative self-talk
- Difficulty accepting compliments
- Fear of failure or trying new things
- Comparing yourself unfavorably to others
- Feeling unworthy of love or success
- Perfectionism
- Difficulty setting boundaries

## Building Healthy Self-Esteem

### 1. Practice Self-Compassion
Treat yourself with the same kindness you would offer a good friend. Everyone makes mistakes - it's part of being human.

### 2. Challenge Negative Thoughts
When you catch yourself thinking negatively about yourself, ask: "Would I say this to a friend?" Replace harsh criticism with balanced, realistic thoughts.

### 3. Celebrate Small Wins
Acknowledge your achievements, no matter how small. Keep a "wins" journal to remind yourself of your accomplishments.

### 4. Set Boundaries
Learn to say no to things that drain your energy or compromise your values. Your needs matter.

### 5. Focus on Your Strengths
Everyone has unique talents and abilities. Identify yours and find ways to use them regularly.

### 6. Surround Yourself with Support
Spend time with people who lift you up and believe in you. Limit time with those who bring you down.

### 7. Take Care of Your Body
Physical health affects mental health. Exercise, eat well, and get enough sleep.

## Daily Affirmations

Try saying these to yourself daily:
- "I am worthy of love and respect"
- "I am doing the best I can"
- "My feelings are valid"
- "I am growing and improving every day"

Building self-esteem takes time and practice. Be patient with yourself on this journey.`,
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop',
    tags: ['self-esteem', 'self-care', 'confidence', 'mental health'],
    author: 'Sarah Martinez',
    publishedAt: '2024-06-01',
    helpful: 245,
    notHelpful: 6
  },
  {
    id: '11',
    title: 'Coping with Grief and Loss',
    description: 'Understanding the grieving process and finding ways to heal after loss.',
    category: 'grief',
    readTime: '10 min',
    content: `Grief is a natural response to loss. While incredibly painful, it's an important process that helps us adjust to life after losing someone or something we love.

## Understanding Grief

Grief isn't just about death. We grieve many kinds of losses:
- Death of a loved one
- End of a relationship
- Loss of a job or career
- Loss of health
- Moving away from home
- Loss of a friendship
- Loss of dreams or expectations

## The Stages of Grief

While everyone's grief journey is unique, many people experience these stages (not necessarily in order):

### 1. Denial
"This can't be happening." A natural defense mechanism that helps us pace our absorption of the loss.

### 2. Anger
"Why is this happening? Who's to blame?" Anger can be directed at ourselves, others, or the person we lost.

### 3. Bargaining
"If only..." We replay scenarios, wondering what we could have done differently.

### 4. Depression
Deep sadness sets in as we confront the reality of our loss.

### 5. Acceptance
Not "being okay" with the loss, but acknowledging it as our new reality.

## Healthy Ways to Cope

- **Allow yourself to feel:** Don't suppress your emotions
- **Talk about it:** Share your feelings with trusted friends or a therapist
- **Take care of yourself:** Eat, sleep, and move your body
- **Create rituals:** Honor your loss in meaningful ways
- **Be patient:** Grief has no timeline
- **Seek support:** Join a grief support group
- **Express yourself:** Write, draw, or create as an outlet

## When to Seek Professional Help

Consider reaching out to a grief counselor if you:
- Can't function in daily life after several months
- Have thoughts of self-harm
- Feel completely isolated
- Are using substances to cope
- Can't stop blaming yourself

## Remember

Grief is love with nowhere to go. It's a testament to how much you cared. In time, the pain softens, but the love remains.`,
    image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=800&auto=format&fit=crop',
    tags: ['grief', 'loss', 'healing', 'mental health'],
    author: 'Dr. Amanda Foster',
    publishedAt: '2024-06-15',
    helpful: 198,
    notHelpful: 3
  },
  {
    id: '12',
    title: 'Social Anxiety: Understanding and Overcoming Fear of Social Situations',
    description: 'Learn about social anxiety and practical techniques to feel more confident in social settings.',
    category: 'anxiety',
    readTime: '8 min',
    content: `Social anxiety is more than just shyness. It's an intense fear of being judged, embarrassed, or humiliated in social situations. The good news? It's highly treatable.

## What is Social Anxiety?

Social anxiety disorder (SAD) involves overwhelming worry and self-consciousness about everyday social situations. The fear often centers on being judged or scrutinized by others.

## Common Triggers

- Meeting new people
- Being the center of attention
- Public speaking or presentations
- Eating or drinking in front of others
- Making phone calls
- Job interviews
- Dating

## Physical Symptoms

- Blushing
- Rapid heartbeat
- Trembling or shaking
- Sweating
- Nausea or upset stomach
- Mind going blank
- Avoiding eye contact

## Overcoming Social Anxiety

### Start Small
Begin with less intimidating social situations and gradually work your way up.

### Challenge Negative Thoughts
Ask yourself:
- "What's the worst that could happen?"
- "What evidence do I have for this fear?"
- "How would I advise a friend in this situation?"

### Practice Deep Breathing
Slow, deep breaths can calm your nervous system in the moment.

### Focus Outward
Instead of focusing on yourself, try to focus on others or the environment around you.

### Prepare, Don't Over-Rehearse
Having a few conversation topics ready is helpful, but don't script every word.

### Be Kind to Yourself
Everyone feels awkward sometimes. It's okay to not be perfect.

### Consider Professional Help
Cognitive behavioral therapy (CBT) is highly effective for social anxiety.

## Building Social Confidence

- Practice small talk with low-stakes interactions
- Join groups or classes around your interests
- Volunteer for activities that require social interaction
- Celebrate small victories
- Remember: most people are focused on themselves, not judging you

Social anxiety doesn't have to control your life. With patience and practice, you can learn to feel more comfortable in social situations.`,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
    tags: ['social anxiety', 'anxiety', 'confidence', 'mental health'],
    author: 'Dr. Lisa Park',
    publishedAt: '2024-07-01',
    helpful: 267,
    notHelpful: 9
  },
  {
    id: '13',
    title: 'Digital Wellness: Managing Screen Time and Technology Use',
    description: 'Find balance in the digital age with strategies for healthy technology habits.',
    category: 'self-care',
    readTime: '6 min',
    content: `In our always-connected world, managing our relationship with technology is essential for mental wellbeing. Digital wellness is about using technology intentionally and mindfully.

## Signs You May Need a Digital Detox

- Checking your phone first thing in the morning
- Feeling anxious when separated from your phone
- Comparing yourself to others on social media
- Difficulty concentrating without checking devices
- Sleep problems related to screen use
- Neglecting in-person relationships

## Strategies for Digital Wellness

### Set Boundaries
- Designate phone-free times (meals, bedtime)
- Create phone-free zones (bedroom, dinner table)
- Turn off non-essential notifications

### Be Intentional
- Ask: "Why am I picking up my phone?"
- Use apps with purpose, not out of habit
- Schedule specific times for social media

### Protect Your Sleep
- Stop screens 1 hour before bed
- Use night mode or blue light filters
- Keep devices out of the bedroom

### Curate Your Feed
- Unfollow accounts that make you feel bad
- Follow accounts that inspire and educate
- Mute or block as needed without guilt

### Practice Mindful Consumption
- Notice how content makes you feel
- Take breaks during scrolling sessions
- Set app time limits

### Connect Offline
- Schedule regular in-person time with loved ones
- Pick up the phone to call instead of text
- Engage in hobbies that don't involve screens

## Creating Tech-Free Rituals

- Morning routine without screens for the first 30 minutes
- A weekly "digital sabbath"
- Reading physical books before bed
- Walking without earbuds

Technology is a tool, not a master. By being intentional about how we use it, we can enjoy its benefits while protecting our wellbeing.`,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    tags: ['digital wellness', 'self-care', 'screen time', 'mindfulness'],
    author: 'Tech Wellness Team',
    publishedAt: '2024-07-15',
    helpful: 184,
    notHelpful: 5
  }
];

