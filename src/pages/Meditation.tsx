
import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import MeditationTimer from '@/components/MeditationTimer';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const guidedMeditations = [
  {
    id: '1',
    title: 'Breath Awareness',
    duration: '5 min',
    description: 'A simple meditation focusing on the breath to calm the mind.',
  },
  {
    id: '2',
    title: 'Body Scan',
    duration: '10 min',
    description: 'Systematically release tension throughout your body with this guided practice.',
  },
  {
    id: '3',
    title: 'Loving-Kindness',
    duration: '15 min',
    description: 'Cultivate compassion for yourself and others through this gentle meditation.',
  },
];

const AFFIRMATIONS = [
  "You're allowed to slow down. 🌿",
  "Every breath is a fresh start. 🌅",
  "Be gentle with yourself today. 💛",
  "Stillness is a kind of strength. ✨",
  "You don't have to fix anything right now. 🤍",
];

const PRESETS = [
  { label: 'Calm', minutes: 5, emoji: '🌿', tint: 'from-emerald-200/60 to-teal-100/40' },
  { label: 'Focus', minutes: 10, emoji: '🎯', tint: 'from-amber-200/60 to-orange-100/40' },
  { label: 'Sleep', minutes: 15, emoji: '🌙', tint: 'from-indigo-200/60 to-purple-100/40' },
  { label: 'Gratitude', minutes: 3, emoji: '💛', tint: 'from-pink-200/60 to-rose-100/40' },
];

const MeditationPage = () => {
  const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0]);
  useEffect(() => {
    setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  }, []);

  const handlePreset = (minutes: number) => {
    window.dispatchEvent(new CustomEvent('zenith:set-meditation-duration', { detail: { minutes } }));
    document.getElementById('meditation-timer-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <SEO
        title="Meditation — Zenith AI"
        description="Guided meditation timer with breath awareness, body scan, and loving-kindness practices to calm the mind."
        path="/meditation"
      />
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-sunrise-warm">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur text-xs text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5 animate-soft-breathe" />
              {affirmation}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Meditation Center</h1>
            <p className="text-base md:text-xl text-muted-foreground">
              Pick a vibe, take a breath, and meet yourself where you are.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {PRESETS.map(p => (
                <motion.button
                  key={p.label}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePreset(p.minutes)}
                  className={`rounded-2xl p-4 text-left bg-gradient-to-br ${p.tint} backdrop-blur border border-white/40 shadow-sm`}
                >
                  <div className="text-2xl mb-1">{p.emoji}</div>
                  <div className="font-semibold text-sm text-foreground">{p.label}</div>
                  <div className="text-[11px] text-muted-foreground">{p.minutes} min</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          <Tabs defaultValue="timer" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="timer">Meditation Timer</TabsTrigger>
              <TabsTrigger value="guided">Guided Sessions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timer" className="space-y-8">
              <div id="meditation-timer-anchor" />
              <MeditationTimer />
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Tips for Effective Meditation</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>Find a quiet space where you won't be disturbed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>Sit in a comfortable position with your back straight</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>Focus on your breath, noticing the sensation of inhaling and exhaling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>When your mind wanders, gently bring your attention back to your breath</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>Start with short sessions and gradually increase the duration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guided" className="space-y-4">
              {guidedMeditations.map((meditation) => (
                <Card key={meditation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-zenith-softpurple flex items-center justify-center flex-shrink-0">
                      <span className="text-zenith-darkpurple">▶️</span>
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-xl font-medium">{meditation.title}</h3>
                        <span className="text-sm text-gray-500">{meditation.duration}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{meditation.description}</p>
                      <button className="zenith-button-secondary py-2 px-4 inline-block">
                        Start Session
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  More guided meditations coming soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MeditationPage;
