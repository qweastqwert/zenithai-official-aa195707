
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BreathingTechnique = {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
};

const techniques: BreathingTechnique[] = [
  {
    name: '4-7-8',
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: 'Inhale for 4, hold for 7, exhale for 8. Great for relaxation and sleep.'
  },
  {
    name: 'Box Breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: 'Inhale for 4, hold for 4, exhale for 4. Used by Navy SEALs for focus.'
  },
  {
    name: 'Triangle Breathing',
    inhale: 4,
    hold: 0,
    exhale: 4,
    description: 'Inhale for 4, exhale for 4. Simple and effective for quick calming.'
  },
  {
    name: 'Equal Breathing',
    inhale: 6,
    hold: 0,
    exhale: 6,
    description: 'Inhale for 6, exhale for 6. Balances the nervous system.'
  }
];

const BreathingExercise = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(techniques[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(selectedTechnique.inhale);
  const [cycle, setCycle] = useState(0);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  const speak = (text: string) => {
    if (isTTSEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            if (phase === 'inhale') {
              if (selectedTechnique.hold > 0) {
                setPhase('hold');
                speak('Hold');
                return selectedTechnique.hold;
              } else {
                setPhase('exhale');
                speak('Exhale');
                return selectedTechnique.exhale;
              }
            } else if (phase === 'hold') {
              setPhase('exhale');
              speak('Exhale');
              return selectedTechnique.exhale;
            } else {
              setPhase('inhale');
              setCycle(c => c + 1);
              speak('Inhale');
              return selectedTechnique.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, phase, selectedTechnique]);

  const handleStart = () => {
    setIsActive(true);
    if (phase === 'inhale' && timeLeft === selectedTechnique.inhale) {
      speak('Begin breathing. Inhale');
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(selectedTechnique.inhale);
    setCycle(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTechniqueChange = (value: string) => {
    const technique = techniques.find(t => t.name === value);
    if (technique) {
      setSelectedTechnique(technique);
      setIsActive(false);
      setPhase('inhale');
      setTimeLeft(technique.inhale);
      setCycle(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const getCircleScale = () => {
    const progress = (getPhaseTime() - timeLeft) / getPhaseTime();
    
    if (phase === 'inhale') {
      return 0.5 + (progress * 0.5); // Scale from 0.5 to 1
    } else if (phase === 'exhale') {
      return 1 - (progress * 0.5); // Scale from 1 to 0.5
    } else {
      return 1; // Hold at full size
    }
  };

  const getPhaseTime = () => {
    switch (phase) {
      case 'inhale':
        return selectedTechnique.inhale;
      case 'hold':
        return selectedTechnique.hold;
      case 'exhale':
        return selectedTechnique.exhale;
      default:
        return selectedTechnique.inhale;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-400';
      case 'hold':
        return 'bg-yellow-400';
      case 'exhale':
        return 'bg-green-400';
      default:
        return 'bg-blue-400';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Breathe In';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardContent className="pt-0">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Choose Technique:</label>
              <Select value={selectedTechnique.name} onValueChange={handleTechniqueChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {techniques.map((technique) => (
                    <SelectItem key={technique.name} value={technique.name}>
                      {technique.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-2">{selectedTechnique.description}</p>
            </div>

            <div className="flex justify-center">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div
                  className={`w-64 h-64 rounded-full ${getPhaseColor()} transition-transform duration-1000 ease-in-out flex items-center justify-center shadow-lg`}
                  style={{
                    transform: `scale(${getCircleScale()})`,
                  }}
                >
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold mb-2">{getPhaseText()}</div>
                    <div className="text-4xl font-bold">{timeLeft}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="text-lg">
                <span className="font-semibold">Cycle:</span> {cycle}
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={isActive ? handlePause : handleStart}
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
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>

                <Button
                  onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                  variant="outline"
                  className={`border-zenith-purple ${isTTSEnabled ? 'bg-zenith-softpurple text-zenith-darkpurple' : 'text-zenith-purple'} hover:bg-zenith-softpurple`}
                >
                  {isTTSEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                  Voice Guide
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="pt-0">
          <h3 className="text-xl font-semibold mb-4">Breathing Pattern</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className={`p-4 rounded-lg ${phase === 'inhale' ? 'bg-blue-100 border-blue-300' : 'bg-gray-100'} border-2`}>
              <div className="text-2xl font-bold text-blue-600">{selectedTechnique.inhale}s</div>
              <div className="text-sm">Inhale</div>
            </div>
            {selectedTechnique.hold > 0 && (
              <div className={`p-4 rounded-lg ${phase === 'hold' ? 'bg-yellow-100 border-yellow-300' : 'bg-gray-100'} border-2`}>
                <div className="text-2xl font-bold text-yellow-600">{selectedTechnique.hold}s</div>
                <div className="text-sm">Hold</div>
              </div>
            )}
            <div className={`p-4 rounded-lg ${phase === 'exhale' ? 'bg-green-100 border-green-300' : 'bg-gray-100'} border-2`}>
              <div className="text-2xl font-bold text-green-600">{selectedTechnique.exhale}s</div>
              <div className="text-sm">Exhale</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingExercise;
