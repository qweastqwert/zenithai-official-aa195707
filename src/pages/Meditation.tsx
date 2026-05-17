
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import MeditationTimer from '@/components/MeditationTimer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const guidedMeditations = [
  {
    id: '1',
    title: 'Breath Awareness',
    duration: '5 min',
    description: 'A simple meditation focusing on the breath to calm the mind.',
  },
  {
    id: '2',
    title: 'Body Scan',
    duration: '10 min',
    description: 'Systematically release tension throughout your body with this guided practice.',
  },
  {
    id: '3',
    title: 'Loving-Kindness',
    duration: '15 min',
    description: 'Cultivate compassion for yourself and others through this gentle meditation.',
  },
];

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
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="timer">Meditation Timer</TabsTrigger>
              <TabsTrigger value="guided">Guided Sessions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timer" className="space-y-8">
              <MeditationTimer />
              
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
            
            <TabsContent value="guided" className="space-y-4">
              {guidedMeditations.map((meditation) => (
                <Card key={meditation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-zenith-softpurple flex items-center justify-center flex-shrink-0">
                      <span className="text-zenith-darkpurple">▶️</span>
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-xl font-medium">{meditation.title}</h3>
                        <span className="text-sm text-gray-500">{meditation.duration}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{meditation.description}</p>
                      <button className="zenith-button-secondary py-2 px-4 inline-block">
                        Start Session
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  More guided meditations coming soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MeditationPage;
