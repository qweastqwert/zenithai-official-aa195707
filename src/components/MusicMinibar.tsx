
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, ChevronDown, Music } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicContext';

const MusicMinibar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlayPause,
    setVolume,
    seekTo,
    nextSong,
    previousSong,
    playlist,
    playSong,
    stopAndClose
  } = useMusicPlayer();

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleNext = () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex]);
  };

  const handlePrevious = () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    playSong(playlist[prevIndex]);
  };

  const handleClose = () => {
    // Fully stop playback and clear the current song so audio cannot keep playing
    // invisibly in the background.
    stopAndClose();
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  // Minimized state - corner squircle
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleExpand}
          className="h-14 w-14 rounded-2xl bg-background/95 backdrop-blur-sm border shadow-lg hover:scale-105 transition-all duration-300"
          variant="outline"
        >
          <Music className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  // Full minibar - now with proper spacing and layout
  return (
    <>
      <Card className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t shadow-lg animate-fade-in">
        <div className="flex items-center gap-4 p-4 pb-safe">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-medium truncate">{currentSong.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{currentSong.category}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="h-8 w-8"
              disabled={playlist.length <= 1}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="h-10 w-10"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8"
              disabled={playlist.length <= 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex-1 max-w-md hidden md:flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[progress]}
              onValueChange={([value]) => seekTo((value / 100) * duration)}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2 w-24">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVolume(volume > 0 ? 0 : 70)}
              className="h-8 w-8"
            >
              {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[volume]}
              onValueChange={([value]) => setVolume(value)}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMinimize}
              className="h-8 w-8"
              title="Minimize to corner"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
              title="Close player"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MusicMinibar;
