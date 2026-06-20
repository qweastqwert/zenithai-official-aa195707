import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Cake, X } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useAchievements } from '@/hooks/useAchievements';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';

const isBirthdayToday = (birthDate?: string | null) => {
  if (!birthDate) return false;
  const bd = new Date(birthDate);
  if (isNaN(bd.getTime())) return false;
  const now = new Date();
  return bd.getUTCMonth() === now.getMonth() && bd.getUTCDate() === now.getDate();
};

const computeAge = (birthDate?: string | null) => {
  if (!birthDate) return null;
  const bd = new Date(birthDate);
  if (isNaN(bd.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - bd.getUTCFullYear();
  const m = now.getMonth() - bd.getUTCMonth();
  if (m < 0 || (m === 0 && now.getDate() < bd.getUTCDate())) age--;
  return age;
};

const BirthdayLetter: React.FC = () => {
  const { profile } = useProfile();
  const { activities } = useActivityTracker();
  const { stats } = useAchievements();
  const { entries: moods } = useMoodDataSupabase();
  const { entries: journals } = useJournalSupabase();

  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const birthdayKey = useMemo(() => {
    const now = new Date();
    return `birthday-letter-seen-${now.getFullYear()}`;
  }, []);

  const isBirthday = isBirthdayToday(profile?.birth_date);

  useEffect(() => {
    if (!isBirthday) return;
    const seen = localStorage.getItem(birthdayKey);
    if (seen) setDismissed(true);
  }, [isBirthday, birthdayKey]);

  if (!isBirthday || !profile?.name) return null;

  const age = computeAge(profile.birth_date);
  const longestStreak = Math.max(
    activities.mindMateStreak,
    activities.journalStreak,
    activities.moodStreak,
    activities.meditationStreak,
    activities.sleepStreak || 0
  );

  const handleOpen = () => {
    setOpen(true);
    localStorage.setItem(birthdayKey, '1');
    setDismissed(true);
  };

  return (
    <>
      {!dismissed && (
        <motion.button
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="w-full relative overflow-hidden rounded-2xl p-5 text-left bg-gradient-to-br from-pink-500 via-rose-400 to-amber-400 text-white shadow-xl border border-white/20"
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            {['🎂','🎉','✨','🎈','🎁'].map((e, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                style={{ left: `${10 + i * 18}%`, top: `${10 + (i % 2) * 50}%` }}
                animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {e}
              </motion.span>
            ))}
          </div>
          <div className="relative flex items-center gap-3">
            <div className="text-4xl">💌</div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider opacity-90 font-semibold">A letter for you</div>
              <div className="text-lg font-bold">Happy Birthday, {profile.name}!</div>
              <div className="text-xs opacity-90">Tap to open your envelope ✨</div>
            </div>
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
        </motion.button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-0 bg-transparent shadow-none">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="relative rounded-3xl bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50 dark:from-rose-950/60 dark:via-amber-950/40 dark:to-pink-950/60 p-6 sm:p-8 shadow-2xl border border-rose-200/50 dark:border-rose-800/40"
              >
                {/* Confetti */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-sm"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `-10px`,
                        backgroundColor: ['#f43f5e','#f59e0b','#ec4899','#8b5cf6','#10b981'][i % 5]
                      }}
                      animate={{ y: ['0vh', '90vh'], rotate: [0, 360], opacity: [1, 0.4] }}
                      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/60 hover:bg-white text-rose-600 transition"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="text-6xl mb-2"
                  >
                    🎂
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 bg-clip-text text-transparent leading-tight"
                  >
                    HAPPY BIRTHDAY!
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg font-semibold text-rose-700 dark:text-rose-300 mt-1"
                  >
                    {profile.name}{age ? ` · ${age} today` : ''} 💖
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative bg-white/70 dark:bg-gray-900/60 backdrop-blur rounded-2xl p-5 border border-rose-200/60 dark:border-rose-800/40 space-y-4"
                >
                  <p className="text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
                    Dear <span className="font-bold text-rose-600 dark:text-rose-400">{profile.name}</span>,
                  </p>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Today is your day, and we're so grateful you've chosen to spend a part of your journey with us.
                    Every check-in, every reflection, every quiet breath — it all matters. Look how far you've come:
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <StatCard label="Days with Zenith" value={activities.totalDaysUsed} emoji="🌱" />
                    <StatCard label="Longest streak" value={longestStreak} emoji="🔥" />
                    <StatCard label="Moods tracked" value={moods.length} emoji="💝" />
                    <StatCard label="Journal entries" value={journals.length} emoji="✍️" />
                    <StatCard label="Achievements" value={stats.unlockedCount} emoji="🏆" />
                    <StatCard label="Features explored" value={activities.featuresUnlocked.length} emoji="✨" />
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 pt-2">
                    Whatever this year brings, we hope it's gentle on your heart and rich with the little moments that
                    make you feel alive. Keep growing, keep resting, keep being beautifully <em>you</em>.
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-rose-600 dark:text-rose-400">
                    With love,<br />— The Zenith family 💜
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-5 flex justify-center"
                >
                  <Button
                    onClick={() => setOpen(false)}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg gap-2"
                  >
                    <Cake className="h-4 w-4" /> Thank you ✨
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

const StatCard: React.FC<{ label: string; value: number; emoji: string }> = ({ label, value, emoji }) => (
  <div className="rounded-xl bg-gradient-to-br from-white to-rose-50/60 dark:from-gray-800/80 dark:to-rose-950/40 border border-rose-100 dark:border-rose-900/40 p-3 text-center">
    <div className="text-xl">{emoji}</div>
    <div className="text-2xl font-bold text-rose-600 dark:text-rose-300">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);

export default BirthdayLetter;