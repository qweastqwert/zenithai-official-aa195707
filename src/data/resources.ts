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
  }
];

