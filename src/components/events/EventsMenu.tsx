
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Users, Target, ArrowRight } from 'lucide-react';
import TransformationChallenge from './TransformationChallenge';

interface EventsMenuProps {
  onNavigateToMindMate: (prompt?: string) => void;
}

const EventsMenu: React.FC<EventsMenuProps> = ({ onNavigateToMindMate }) => {
  const [showEvents, setShowEvents] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

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
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Users className="h-5 w-5" />
                  Men's Mental Health Month Awareness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                  <p className="font-semibold">Did you know?</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Men are 3-4 times more likely to die by suicide than women globally</li>
                    <li>Suicide is the leading cause of death for men under 35 in many countries</li>
                    <li>Men are less likely to seek help for mental health issues due to stigma</li>
                    <li>Depression in men often goes undiagnosed and untreated</li>
                  </ul>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Breaking the silence starts with taking the first step. You're not alone.
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Activities
                  </h4>
                  
                  <Card className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-purple-700 dark:text-purple-300">
                            MindMate's Transformation Challenge for all Men
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Set a personal goal and get AI-powered guidance to transform your mental wellness journey
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
                </div>
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
