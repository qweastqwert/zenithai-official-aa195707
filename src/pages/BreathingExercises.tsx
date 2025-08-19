
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreathingExerciseRevamped from '@/components/breathing/BreathingExerciseRevamped';

const BreathingStudioPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Breathing Studio
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Elevate your mindfulness with our premium breathing techniques, crafted for modern wellness
            </p>
          </div>
          <BreathingExerciseRevamped />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BreathingStudioPage;
