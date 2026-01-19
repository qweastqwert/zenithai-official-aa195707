import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, X, Headphones, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMusicPlayer, Song } from '@/contexts/MusicContext';

interface MusicSuggestionWidgetProps {
  mood: 'relaxation' | 'focus' | 'calm' | 'energy' | 'sleep';
  customMessage?: string;
  suggestedSongs?: string[];
  onDismiss?: () => void;
}

// Full song data matching SoothingMusic.tsx
const allSongs: Song[] = [
  {
    id: 1,
    title: "Golden Horizon",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Golden%20Horizon.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9Hb2xkZW4gSG9yaXpvbi5tcDMiLCJpYXQiOjE3NjgzODAxOTYsImV4cCI6NDg5MDQ0NDE5Nn0.09oThBeU355oAs8SFvHddtqm2D4DFaY8ethzKP7yZ5A",
    category: "Uplifting",
    mood: ["sad", "depressed", "low energy"],
    cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Whispers of the Tide",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Whispers%20of%20the%20Tide.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9XaGlzcGVycyBvZiB0aGUgVGlkZS5tcDMiLCJpYXQiOjE3NjgzODAzODMsImV4cCI6NDg5MDQ0NDM4M30.bQftywgLjIyIr1cvmQ10kT1b_2ZLh9tzChyxKIIUkaA",
    category: "Calming",
    mood: ["stress", "anxiety", "overwhelmed"],
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Lavender Lullaby",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Lavender%20Lullaby.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9MYXZlbmRlciBMdWxsYWJ5Lm1wMyIsImlhdCI6MTc2ODM4MDMwNCwiZXhwIjo0ODkwNDQ0MzA0fQ.K15d3pCQZtMk4ax03zyeZWiWURcCRiRlVXMNLIIO1JU",
    category: "Sleep",
    mood: ["insomnia", "restless", "tired"],
    cover: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Sunlit Meadow Dance",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Sunlit%20Meadow%20Dance.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9TdW5saXQgTWVhZG93IERhbmNlLm1wMyIsImlhdCI6MTc2ODM4MDM1MSwiZXhwIjo0ODkwNDQ0MzUxfQ.mGgky273-hqXyW3-BLUObfSs-Ci1-MeoQ7yP2z5wdUA",
    category: "Energizing",
    mood: ["lethargic", "unmotivated", "dull"],
    cover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Silent Snowfall",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Silent%20Snowfall.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9TaWxlbnQgU25vd2ZhbGwubXAzIiwiaWF0IjoxNzY4MzgwMzI2LCJleHAiOjQ4OTA0NDQzMjZ9.WlBrCg-GkGmfB69DT5S6p40b_SmdvkptsO7GiszRMAg",
    category: "Meditation",
    mood: ["scattered", "unfocused", "chaotic"],
    cover: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Emerald Canopy",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Emerald%20Canopy.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9FbWVyYWxkIENhbm9weS5tcDMiLCJpYXQiOjE3NjgzODAyNDUsImV4cCI6NDg5MDQ0NDI0NX0.2KPmA5kgvAE74g2DP3zFMVJqy55VQ6ESvsCTeDZdIdo",
    category: "Nature",
    mood: ["disconnected", "indoor blues", "nature craving"],
    cover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Coastal Breeze Dreams",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Coastal%20Breeze%20Dreams.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9Db2FzdGFsIEJyZWV6ZSBEcmVhbXMubXAzIiwiaWF0IjoxNzY4MzgwMjgwLCJleHAiOjQ4OTA0NDQyODB9.Y2dQHnxlSqIV-vOopD2RoRV26TJvntCfmsvXeQZejnw",
    category: "Relaxation",
    mood: ["tension", "muscle pain", "physical stress"],
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Floating Lanterns",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Floating%20Lanterns.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9GbG9hdGluZyBMYW50ZXJucy5tcDMiLCJpYXQiOjE3NjgzODAyMTcsImV4cCI6NDg5MDQ0NDIxN30.PphBXpA33tsp_E0TFA77tFkLp8--qEgySN5u3tR57OE",
    category: "Spiritual",
    mood: ["lost", "purposeless", "spiritual void"],
    cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop"
  }
];

const moodSongTitles: Record<string, string[]> = {
  relaxation: ['Golden Horizon', 'Coastal Breeze Dreams', 'Whispers of the Tide'],
  focus: ['Emerald Canopy', 'Sunlit Meadow Dance', 'Silent Snowfall'],
  calm: ['Lavender Lullaby', 'Silent Snowfall', 'Floating Lanterns'],
  energy: ['Sunlit Meadow Dance', 'Emerald Canopy', 'Golden Horizon'],
  sleep: ['Lavender Lullaby', 'Silent Snowfall', 'Floating Lanterns'],
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
  const { playlist, setPlaylist, playSong, togglePlayPause, isPlaying, currentSong } = useMusicPlayer();

  // Ensure playlist is set when widget mounts
  useEffect(() => {
    if (playlist.length === 0) {
      setPlaylist(allSongs);
    }
  }, [playlist.length, setPlaylist]);

  // Get songs for this mood
  const moodTitles = moodSongTitles[mood] || moodSongTitles.calm;
  const displaySongs = allSongs.filter(s => moodTitles.includes(s.title)).slice(0, 3);

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id && isPlaying) {
      togglePlayPause();
      setPlayingSong(null);
    } else {
      setPlayingSong(song.title);
      playSong(song);
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
              {displaySongs.map((song, index) => {
                const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;
                return (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <button
                      onClick={() => handlePlaySong(song)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isCurrentlyPlaying
                          ? 'bg-primary/20 border-primary/30'
                          : 'bg-background/60 hover:bg-background/80'
                      } border border-border/50`}
                    >
                      <img 
                        src={song.cover} 
                        alt={song.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground text-sm">{song.title}</p>
                        <p className="text-xs text-muted-foreground">{song.category}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrentlyPlaying 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {isCurrentlyPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </div>
                      {isCurrentlyPlaying && (
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
                );
              })}
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
