
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
          
          <Tabs defaultValue="guided" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="guided">Guided Sessions</TabsTrigger>
              <TabsTrigger value="timer">Meditation Timer</TabsTrigger>
              <TabsTrigger value="tips">Tips & Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guided" className="space-y-8">
              <GuidedMeditations />
            </TabsContent>
            
            <TabsContent value="timer" className="space-y-8">
              <MeditationTimer />
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-4">
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MeditationPage;
