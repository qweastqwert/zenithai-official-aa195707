
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Play, Pause } from 'lucide-react';
import { useMusicPlayer, Song } from '@/contexts/MusicContext';

const songs: Song[] = [
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

interface SoothingMusicProps {
  suggestedSong?: number;
}

const SoothingMusic: React.FC<SoothingMusicProps> = ({ suggestedSong }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { toast } = useToast();
  const { currentSong, isPlaying, playSong, togglePlayPause, setPlaylist } = useMusicPlayer();

  const categories = ['All', 'Uplifting', 'Calming', 'Sleep', 'Energizing', 'Meditation', 'Nature', 'Relaxation', 'Spiritual'];

  useEffect(() => {
    // Set the playlist when component mounts
    setPlaylist(songs);
  }, [setPlaylist]);

  useEffect(() => {
    if (suggestedSong) {
      const song = songs.find(s => s.id === suggestedSong);
      if (song) {
        playSong(song);
        toast({
          title: "Suggested Music",
          description: `Playing "${song.title}" based on your mood.`,
        });
      }
    }
  }, [suggestedSong, toast, playSong]);

  const filteredSongs = selectedCategory === 'All' 
    ? songs 
    : songs.filter(song => song.category === selectedCategory);

  const { togglePlayPause } = useMusicPlayer();

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Soothing Music</h2>
        <p className="text-gray-600">Find peace and tranquility with our curated collection of calming melodies</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="text-sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Current Playing */}
      {currentSong && (
        <Card className="bg-gradient-to-r from-zenith-softpurple to-zenith-softblue">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <img 
                src={currentSong.cover} 
                alt={currentSong.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{currentSong.title}</h3>
                <p className="text-gray-600">{currentSong.category}</p>
                <p className="text-sm text-gray-500">
                  {isPlaying ? "Now Playing" : "Paused"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Song Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.map((song) => (
          <Card key={song.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img 
                src={song.cover} 
                alt={song.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{song.title}</CardTitle>
              <p className="text-sm text-gray-600 mb-3">{song.category}</p>
              <Button
                onClick={() => handlePlayPause(song)}
                className="w-full"
                variant={currentSong?.id === song.id && isPlaying ? "secondary" : "default"}
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Playing
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default SoothingMusic;
