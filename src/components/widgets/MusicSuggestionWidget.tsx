import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, X, Headphones, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMusicPlayer } from '@/contexts/MusicContext';

interface MusicSuggestionWidgetProps {
  mood: 'relaxation' | 'focus' | 'calm' | 'energy' | 'sleep';
  customMessage?: string;
  suggestedSongs?: string[];
  onDismiss?: () => void;
}

const moodSongs: Record<string, { title: string; category: string }[]> = {
  relaxation: [
    { title: 'Golden Horizon', category: 'Nature' },
    { title: 'Coastal Breeze Dreams', category: 'Ocean' },
    { title: 'Whispers of the Tide', category: 'Ocean' },
  ],
  focus: [
    { title: 'Emerald Canopy', category: 'Nature' },
    { title: 'Sunlit Meadow Dance', category: 'Ambient' },
    { title: 'Golden Horizon', category: 'Nature' },
  ],
  calm: [
    { title: 'Lavender Lullaby', category: 'Sleep' },
    { title: 'Silent Snowfall', category: 'Ambient' },
    { title: 'Floating Lanterns', category: 'Ambient' },
  ],
  energy: [
    { title: 'Sunlit Meadow Dance', category: 'Ambient' },
    { title: 'Emerald Canopy', category: 'Nature' },
    { title: 'Golden Horizon', category: 'Nature' },
  ],
  sleep: [
    { title: 'Lavender Lullaby', category: 'Sleep' },
    { title: 'Silent Snowfall', category: 'Ambient' },
    { title: 'Floating Lanterns', category: 'Ambient' },
  ],
};

const moodIcons: Record<string, string> = {
  relaxation: '🌊',
  focus: '🎯',
  calm: '🧘',
  energy: '⚡',
  sleep: '🌙',
};

const moodColors: Record<string, string> = {
  relaxation: 'from-blue-500/20 to-cyan-500/20',
  focus: 'from-amber-500/20 to-orange-500/20',
  calm: 'from-purple-500/20 to-pink-500/20',
  energy: 'from-green-500/20 to-emerald-500/20',
  sleep: 'from-indigo-500/20 to-violet-500/20',
};

const MusicSuggestionWidget: React.FC<MusicSuggestionWidgetProps> = ({
  mood = 'calm',
  customMessage,
  suggestedSongs,
  onDismiss,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [playingSong, setPlayingSong] = useState<string | null>(null);
  const musicContext = useMusicPlayer();

  const songs = moodSongs[mood] || moodSongs.calm;
  const displaySongs = suggestedSongs?.length 
    ? songs.filter(s => suggestedSongs.includes(s.title))
    : songs.slice(0, 3);

  const handlePlaySong = (songTitle: string) => {
    if (playingSong === songTitle) {
      setPlayingSong(null);
      musicContext?.togglePlayPause();
    } else {
      setPlayingSong(songTitle);
      // Find the song in the playlist
      const song = musicContext?.playlist?.find(s => s.title === songTitle);
      if (song) {
        musicContext?.playSong(song);
      }
    }
  };

  const getMoodTitle = () => {
    switch (mood) {
      case 'relaxation': return 'Time to Relax';
      case 'focus': return 'Focus Mode';
      case 'calm': return 'Find Your Calm';
      case 'energy': return 'Boost Your Energy';
      case 'sleep': return 'Drift to Sleep';
      default: return 'Music for You';
    }
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-sm"
        >
          <Card className={`overflow-hidden border-2 border-primary/20 bg-gradient-to-br ${moodColors[mood]}`}>
            {/* Header */}
            <div className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                    className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl"
                  >
                    {moodIcons[mood]}
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-foreground">{getMoodTitle()}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Headphones className="w-3 h-3" />
                      Curated for you
                    </p>
                  </div>
                </div>
                {onDismiss && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={onDismiss}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {customMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 text-sm text-foreground/80 italic"
                >
                  "{customMessage}"
                </motion.p>
              )}
            </div>

            {/* Song List */}
            <div className="p-4 pt-2 space-y-2">
              {displaySongs.map((song, index) => (
                <motion.div
                  key={song.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <button
                    onClick={() => handlePlaySong(song.title)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      playingSong === song.title
                        ? 'bg-primary/20 border-primary/30'
                        : 'bg-background/60 hover:bg-background/80'
                    } border border-border/50`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      playingSong === song.title 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {playingSong === song.title ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Volume2 className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground text-sm">{song.title}</p>
                      <p className="text-xs text-muted-foreground">{song.category}</p>
                    </div>
                    {playingSong === song.title && (
                      <motion.div
                        className="flex gap-0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-primary rounded-full"
                            animate={{
                              height: ['8px', '16px', '8px'],
                            }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-4 pb-4"
            >
              <p className="text-xs text-center text-muted-foreground">
                🎵 Music helps regulate emotions and improve focus
              </p>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicSuggestionWidget;
