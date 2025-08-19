
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreathingExerciseRevamped from '@/components/breathing/BreathingExerciseRevamped';

const BreathingExercisesPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="container mx-auto">
          <BreathingExerciseRevamped />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BreathingExercisesPage;
