
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
    url: "https://www.dropbox.com/scl/fi/q1zes3i9srzsfhppm3yap/Golden-Horizon.mp3?rlkey=ton12h5q3eism4t5ke9xggnbu&st=rwx1g6en&raw=1",
    category: "Uplifting",
    mood: ["sad", "depressed", "low energy"],
    cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Whispers of the Tide",
    url: "https://www.dropbox.com/scl/fi/ihz7exkbhqkd26dkohd9o/Whispers-of-the-Tide.mp3?rlkey=0zvef2tsxktm87oon4do7r1l3&st=peem597y&raw=1",
    category: "Calming",
    mood: ["stress", "anxiety", "overwhelmed"],
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Lavender Lullaby",
    url: "https://www.dropbox.com/scl/fi/na6biu47ywx3g6ewj0zf7/Lavender-Lullaby.mp3?rlkey=da46ix31u2a3jq14jiyuo5jc1&st=5rtyucur&raw=1",
    category: "Sleep",
    mood: ["insomnia", "restless", "tired"],
    cover: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Sunlit Meadow Dance",
    url: "https://www.dropbox.com/scl/fi/9wlhnmr81j8kj3krvm17t/Sunlit-Meadow-Dance.mp3?rlkey=preyyoxcucr3oe5u9obd0a6nw&st=8r3nmtq6&raw=1",
    category: "Energizing",
    mood: ["lethargic", "unmotivated", "dull"],
    cover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Silent Snowfall",
    url: "https://www.dropbox.com/scl/fi/b4ksuq7hosbit5fwirctq/Silent-Snowfall.mp3?rlkey=ds890du77vtlz0x2hk6hitbqr&st=imo4koxd&raw=1",
    category: "Meditation",
    mood: ["scattered", "unfocused", "chaotic"],
    cover: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Emerald Canopy",
    url: "https://www.dropbox.com/scl/fi/3x8c7l7vjnj9ddy8j0pcl/Emerald-Canopy.mp3?rlkey=t3rx2zkv0nwg93b2yf0ykwpla&st=mjowape5&raw=1",
    category: "Nature",
    mood: ["disconnected", "indoor blues", "nature craving"],
    cover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Coastal Breeze Dreams",
    url: "https://www.dropbox.com/scl/fi/pdkt7nipa0cuxsvguo06r/Coastal-Breeze-Dreams.mp3?rlkey=whl7j5afxsnhf6189swsrik05&st=lii1rz8h&raw=1",
    category: "Relaxation",
    mood: ["tension", "muscle pain", "physical stress"],
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Floating Lanterns",
    url: "https://www.dropbox.com/scl/fi/aamhq061o8o2xe6tyfr8u/Floating-Lanterns.mp3?rlkey=od7w4pyo5vzfp94odwcit43tt&st=pkby52jy&raw=1",
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
  const { currentSong, isPlaying, playSong, setPlaylist } = useMusicPlayer();

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

  const handlePlayPause = (song: Song) => {
    playSong(song);
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
