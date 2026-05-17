
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BreathingExerciseRevamped from '@/components/breathing/BreathingExerciseRevamped';
import SEO from '@/components/SEO';

const BreathingExercisesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEO
        title="Breathing Exercises — Zenith AI"
        description="Guided box breathing, 4-7-8, and calming patterns to reduce stress and regulate your nervous system."
        path="/breathing-exercises"
      />
      <div className="p-4 flex items-center text-primary-foreground bg-primary">
        <Link to="/chat" className="mr-4">
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Breathing Exercise</h1>
      </div>
      <div className="flex-1 overflow-auto pb-6">
        <BreathingExerciseRevamped />
      </div>
    </div>
  );
};

export default BreathingExercisesPage;
