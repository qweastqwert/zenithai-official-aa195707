import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const MeditationTimer = () => {
  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const meditationMusicUrl = "https://drive.google.com/uc?export=download&id=13VLpbq5GYkGCpNHKNNbjyuEoZRBGk5qG";
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) audioRef.current.pause();
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = meditationMusicUrl;
      audioRef.current.loop = true;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isActive && musicEnabled) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isActive, musicEnabled]);
  
  const handleToggleTimer = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    
    // Auto-enable music when starting meditation
    if (newActiveState && !isActive) {
      setMusicEnabled(true);
    }
  };
  
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setIsCompleted(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) audioRef.current.pause();
  };
  
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0] * 60; // Convert minutes to seconds
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsCompleted(false);
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto">
            <div
              className="absolute inset-0 rounded-full bg-zenith-softpurple"
              style={{
                background: `conic-gradient(
                  ${isCompleted ? '#9b87f5' : '#9b87f5'} ${(timeLeft / duration) * 100}%, 
                  #E5DEFF ${(timeLeft / duration) * 100}% 100%
                )`,
                transform: 'rotate(-90deg)',
              }}
            />
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
            </div>
          </div>
          
          <div className="mt-8">
            {isCompleted ? (
              <div className="text-center mb-4">
                <h3 className="text-xl font-medium text-zenith-darkpurple">Meditation Complete</h3>
                <p className="text-gray-600 mt-2">Great job taking time for yourself today</p>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleToggleTimer}
                  className="zenith-button-primary"
                >
                  {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-zenith-purple text-zenith-purple hover:bg-zenith-softpurple"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            )}
          </div>

          {/* Music Controls */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Background Music</span>
              <Switch
                checked={musicEnabled}
                onCheckedChange={setMusicEnabled}
              />
            </div>
            {musicEnabled && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMute}
                  className="text-gray-600"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h4 className="text-sm font-medium mb-2 text-left">Duration (minutes)</h4>
            <Slider
              defaultValue={[duration / 60]}
              min={1}
              max={30}
              step={1}
              disabled={isActive}
              onValueChange={handleDurationChange}
              className="mt-4"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 min</span>
              <span>15 min</span>
              <span>30 min</span>
            </div>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          preload="none"
        />
      </CardContent>
    </Card>
  );
};

export default MeditationTimer;
