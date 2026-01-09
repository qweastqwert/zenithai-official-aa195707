
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Target, ArrowRight, Sparkles, Sun, Heart } from 'lucide-react';
import TransformationChallenge from './TransformationChallenge';

interface EventsMenuProps {
  onNavigateToMindMate: (prompt?: string) => void;
}

const EventsMenu: React.FC<EventsMenuProps> = ({ onNavigateToMindMate }) => {
  const [showEvents, setShowEvents] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

  // Check current date for special events
  const currentDate = useMemo(() => new Date(), []);
  const currentMonth = currentDate.getMonth(); // 0-indexed (January = 0)
  const currentDay = currentDate.getDate();
  
  const isJanuary = currentMonth === 0;
  const isBlueMonday = isJanuary && currentDay === 19;
  const isParentMentalHealthDay = currentMonth === 0 && currentDay === 30;

  const handleActivityStart = (activity: string) => {
    setShowEvents(false);
    onNavigateToMindMate(activity);
  };

  return (
    <>
      <Button
        onClick={() => setShowEvents(true)}
        variant="outline"
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700"
      >
        <Calendar className="h-4 w-4" />
        Events
      </Button>

      <Dialog open={showEvents} onOpenChange={setShowEvents}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Events
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* January - Mental Wellness Month */}
            {isJanuary && (
              <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                    <Sparkles className="h-5 w-5" />
                    January - Mental Wellness Month
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                    <p className="font-semibold">Why January matters for mental health:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Post-holiday blues affect many people as routines resume</li>
                      <li>Winter months can trigger Seasonal Affective Disorder (SAD)</li>
                      <li>New Year resolutions create pressure and stress</li>
                      <li>It's the perfect time to establish healthy mental wellness habits</li>
                    </ul>
                    <p className="text-teal-600 dark:text-teal-400 font-medium">
                      Start the year with intention. Your mental wellness journey begins with small, consistent steps.
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      AI-Powered Activities
                    </h4>
                    
                    <div className="space-y-3">
                      <Card className="bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-teal-700 dark:text-teal-300">
                                Mindful Intentions Setting
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Set meaningful goals with AI guidance for sustainable mental wellness
                              </p>
                            </div>
                            <Button
                              onClick={() => handleActivityStart("Help me set mindful intentions for mental wellness this January. Guide me through creating sustainable goals that focus on emotional well-being rather than just achievements.")}
                              className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                              Start
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-gray-800 border-cyan-200 dark:border-cyan-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-cyan-700 dark:text-cyan-300">
                                Winter Wellness Check-in
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                AI-guided self-assessment to understand your current mental state
                              </p>
                            </div>
                            <Button
                              onClick={() => handleActivityStart("I'd like to do a comprehensive winter wellness check-in. Help me assess my current mental state, identify any seasonal challenges I'm facing, and create a personalized plan for maintaining good mental health during winter.")}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                              Start
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blue Monday - January 19th */}
            {isBlueMonday && (
              <Card className="border-blue-300 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Sun className="h-5 w-5" />
                    Blue Monday - Beat the Blues Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                    <p className="font-semibold">Today is "Blue Monday" - known as one of the most challenging days of the year.</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Post-holiday blues combined with cold weather and short days</li>
                      <li>Failed New Year resolutions can add to feelings of disappointment</li>
                      <li>Financial stress from holiday spending often peaks</li>
                      <li>But remember: You have the power to make today bright! 💙</li>
                    </ul>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      Let's turn Blue Monday into a day of self-compassion and positive action!
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Beat the Blues Activities
                    </h4>
                    
                    <div className="space-y-3">
                      <Card className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-blue-700 dark:text-blue-300">
                                Mood Boost Session
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Personalized activities to lift your spirits today
                              </p>
                            </div>
                            <Button
                              onClick={() => handleActivityStart("It's Blue Monday and I could use some support. Help me with activities and exercises to boost my mood today. I want to turn this day into something positive.")}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Start
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-indigo-700 dark:text-indigo-300">
                                Gratitude & Joy Finder
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Discover sources of joy and practice gratitude
                              </p>
                            </div>
                            <Button
                              onClick={() => handleActivityStart("Guide me through a gratitude and joy-finding exercise to combat the Blue Monday blues. Help me identify positive things in my life and find sources of joy even on difficult days.")}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              Start
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parent Mental Health Day - January 30th */}
            {isParentMentalHealthDay && (
              <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                    <Heart className="h-5 w-5" />
                    Parent Mental Health Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                    <p className="font-semibold">Today we recognize the mental health challenges parents face:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Parenting stress affects 1 in 3 parents significantly</li>
                      <li>Many parents struggle silently with anxiety and depression</li>
                      <li>Taking care of your mental health makes you a better parent</li>
                      <li>You deserve support and understanding too! 💕</li>
                    </ul>
                    <p className="text-rose-600 dark:text-rose-400 font-medium">
                      Whether you're a parent or supporting one, mental health matters for everyone in the family.
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Support Activities
                    </h4>
                    
                    <div className="space-y-3">
                      <Card className="bg-white dark:bg-gray-800 border-rose-200 dark:border-rose-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-rose-700 dark:text-rose-300">
                                Parent Stress Relief
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Tailored stress management for busy parents
                              </p>
                            </div>
                            <Button
                              onClick={() => handleActivityStart("I'm a parent and today is Parent Mental Health Day. Help me with stress relief techniques specifically designed for parents. I need quick, practical strategies I can use even with a busy family schedule.")}
                              className="bg-rose-600 hover:bg-rose-700 text-white"
                            >
                              Start
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-gray-800 border-pink-200 dark:border-pink-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-pink-700 dark:text-pink-300">
                                Family Mental Wellness
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Tips for supporting the whole family's mental health
                              </p>
                            </div>
                            <Button
                              onClick={() => handleActivityStart("Help me understand how to support my family's mental health better. I want to create a positive environment for everyone while also taking care of my own mental wellness as a parent.")}
                              className="bg-pink-600 hover:bg-pink-700 text-white"
                            >
                              Start
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transformation Challenge - Available always */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Target className="h-5 w-5" />
                  Transformation Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Card className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-purple-700 dark:text-purple-300">
                          Personal Growth Journey
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Set a personal goal and get AI-powered guidance to transform your mental wellness
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setShowEvents(false);
                          setShowChallenge(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Start Challenge
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <TransformationChallenge
        isOpen={showChallenge}
        onClose={() => setShowChallenge(false)}
        onStartChallenge={onNavigateToMindMate}
      />
    </>
  );
};

export default EventsMenu;
