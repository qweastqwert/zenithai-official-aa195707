
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Song {
  id: number;
  title: string;
  category: string;
  cover: string;
}

const songs: Song[] = [
  {
    id: 1,
    title: "Golden Horizon",
    category: "Uplifting",
    cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Whispers of the Tide",
    category: "Calming",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Lavender Lullaby",
    category: "Sleep",
    cover: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Sunlit Meadow Dance",
    category: "Energizing",
    cover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Silent Snowfall",
    category: "Meditation",
    cover: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Emerald Canopy",
    category: "Nature",
    cover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Coastal Breeze Dreams",
    category: "Relaxation",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Floating Lanterns",
    category: "Spiritual",
    cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=300&fit=crop"
  }
];

const SongMenu = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSongClick = (songId: number) => {
    navigate(`/soothing-music?song=${songId}`);
  };

  return (
    <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
          variant="outline"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mr-3">
              <Music className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Soothing Music</div>
              <div className="text-sm text-gray-600">Choose a song to relax</div>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
        
        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {songs.map((song) => (
                <div 
                  key={song.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSongClick(song.id)}
                >
                  <img 
                    src={song.cover} 
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{song.title}</h3>
                    <p className="text-xs text-gray-500">{song.category}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => navigate('/soothing-music')} 
              className="w-full mt-3"
              variant="outline"
            >
              View All Songs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SongMenu;
