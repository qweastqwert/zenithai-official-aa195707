
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, ChevronDown, ChevronUp } from 'lucide-react';
import { useMusicPlayer, Song } from '@/contexts/MusicContext';

const songData: Song[] = [
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
    mood: ["stress", "anxiety"],
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Lavender Lullaby",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Lavender%20Lullaby.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9MYXZlbmRlciBMdWxsYWJ5Lm1wMyIsImlhdCI6MTc2ODM4MDMwNCwiZXhwIjo0ODkwNDQ0MzA0fQ.K15d3pCQZtMk4ax03zyeZWiWURcCRiRlVXMNLIIO1JU",
    category: "Sleep",
    mood: ["insomnia", "restless"],
    cover: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Sunlit Meadow Dance",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Sunlit%20Meadow%20Dance.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9TdW5saXQgTWVhZG93IERhbmNlLm1wMyIsImlhdCI6MTc2ODM4MDM1MSwiZXhwIjo0ODkwNDQ0MzUxfQ.mGgky273-hqXyW3-BLUObfSs-Ci1-MeoQ7yP2z5wdUA",
    category: "Energizing",
    mood: ["lethargic", "unmotivated"],
    cover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Silent Snowfall",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Silent%20Snowfall.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9TaWxlbnQgU25vd2ZhbGwubXAzIiwiaWF0IjoxNzY4MzgwMzI2LCJleHAiOjQ4OTA0NDQzMjZ9.WlBrCg-GkGmfB69DT5S6p40b_SmdvkptsO7GiszRMAg",
    category: "Meditation",
    mood: ["scattered", "unfocused"],
    cover: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Emerald Canopy",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Emerald%20Canopy.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9FbWVyYWxkIENhbm9weS5tcDMiLCJpYXQiOjE3NjgzODAyNDUsImV4cCI6NDg5MDQ0NDI0NX0.2KPmA5kgvAE74g2DP3zFMVJqy55VQ6ESvsCTeDZdIdo",
    category: "Nature",
    mood: ["disconnected"],
    cover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Coastal Breeze Dreams",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Coastal%20Breeze%20Dreams.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9Db2FzdGFsIEJyZWV6ZSBEcmVhbXMubXAzIiwiaWF0IjoxNzY4MzgwMjgwLCJleHAiOjQ4OTA0NDQyODB9.Y2dQHnxlSqIV-vOopD2RoRV26TJvntCfmsvXeQZejnw",
    category: "Relaxation",
    mood: ["tension", "stress"],
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Floating Lanterns",
    url: "https://tipqgwdgplxlbwuvxyxa.supabase.co/storage/v1/object/sign/Songs/Floating%20Lanterns.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2UzZGI3MC02NzcyLTQyMDktOWViZS02NTFjNjY4MDgzZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTb25ncy9GbG9hdGluZyBMYW50ZXJucy5tcDMiLCJpYXQiOjE3NjgzODAyMTcsImV4cCI6NDg5MDQ0NDIxN30.PphBXpA33tsp_E0TFA77tFkLp8--qEgySN5u3tR57OE",
    category: "Spiritual",
    mood: ["lost", "purposeless"],
    cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop"
  }
];

const SongMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentSong, isPlaying, playSong, togglePlayPause, setPlaylist } = useMusicPlayer();

  const handleSongClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      setPlaylist(songData);
      playSong(song);
    }
  };

  return (
    <Card className="bg-background border-border shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
          variant="outline"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Soothing Music</div>
              <div className="text-sm text-muted-foreground">Choose a song to relax</div>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
        
        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {songData.map((song) => {
                const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;
                return (
                  <div 
                    key={song.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isCurrentlyPlaying ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => handleSongClick(song)}
                  >
                    <img 
                      src={song.cover} 
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{song.title}</h3>
                      <p className="text-xs text-muted-foreground">{song.category}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isCurrentlyPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SongMenu;
