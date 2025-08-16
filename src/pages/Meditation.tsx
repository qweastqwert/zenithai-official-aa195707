
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MeditationTimer from '@/components/MeditationTimer';
import GuidedMeditations from '@/components/GuidedMeditations';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MeditationPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Meditation Center</h1>
            <p className="text-xl text-gray-600">
              Find peace and clarity through mindfulness practice
            </p>
          </div>
          
          <Tabs defaultValue="timer" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="timer">Meditation Timer</TabsTrigger>
              <TabsTrigger value="guided">Guided Sessions</TabsTrigger>
              <TabsTrigger value="tips">Tips & Benefits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timer" className="space-y-8">
              <MeditationTimer />
            </TabsContent>
            
            <TabsContent value="guided" className="space-y-4">
              <GuidedMeditations />
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Tips for Effective Meditation</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>Find a quiet space where you won't be disturbed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>Sit in a comfortable position with your back straight</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>Focus on your breath, noticing the sensation of inhaling and exhaling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>When your mind wanders, gently bring your attention back to your breath</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-zenith-purple">•</span>
                      <span>Start with short sessions and gradually increase the duration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Benefits of Regular Meditation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-green-800 dark:text-green-300">Stress Reduction</h4>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Lower cortisol levels and reduced anxiety through regular practice.
                      </p>
                    </div>
                    
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300">Improved Focus</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Enhanced concentration and mental clarity in daily activities.
                      </p>
                    </div>
                    
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-300">Better Sleep</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        Improved sleep quality and faster time to fall asleep.
                      </p>
                    </div>
                    
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-pink-800 dark:text-pink-300">Emotional Balance</h4>
                      <p className="text-sm text-pink-700 dark:text-pink-400">
                        Greater emotional stability and self-awareness.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MeditationPage;
