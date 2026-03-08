import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const AudioSection = () => {
  const { volume, setVolume, isMuted, setIsMuted } = useMusic();
  const [localVolume, setLocalVolume] = useState([volume * 100]);

  useEffect(() => {
    setLocalVolume([volume * 100]);
  }, [volume]);

  const handleVolumeChange = (values: number[]) => {
    setLocalVolume(values);
    setVolume(values[0] / 100);
    if (values[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = (checked: boolean) => {
    setIsMuted(!checked);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Volume2 className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sound</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-primary" />
            )}
            <Label className="text-sm">Music Volume</Label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-8 text-right">
              {Math.round(localVolume[0])}%
            </span>
            <div className="w-28">
              <Slider
                value={localVolume}
                onValueChange={handleVolumeChange}
                max={100}
                step={5}
                disabled={isMuted}
                className={isMuted ? 'opacity-50' : ''}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Enable Sound</Label>
            <p className="text-xs text-muted-foreground">Play music and sound effects</p>
          </div>
          <Switch 
            checked={!isMuted} 
            onCheckedChange={handleMuteToggle} 
          />
        </div>
      </div>
    </div>
  );
};

export default AudioSection;
