
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
          
          {/* Ad Space Below Breathing Exercise */}
          <div className="mt-12 px-4">
            <div className="w-full max-w-4xl mx-auto h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600">
              Ad Space
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BreathingExercisesPage;
