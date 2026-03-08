import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, ArrowRight, Sparkles, Sun, Heart, Moon, Shield, Globe, Smile, Gift, MessageCircle, HeartHandshake, Crown, Ribbon, UserCheck, HeartPulse } from 'lucide-react';
import TransformationChallenge from './TransformationChallenge';
import { getActiveEvents, type WellnessEvent } from '@/data/eventsData';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Sun, Heart, Moon, Shield, Globe, Smile, Gift, MessageCircle,
  HeartHandshake, Crown, Ribbon, UserCheck, HeartPulse,
};

interface EventsMenuProps {
  onNavigateToMindMate: (prompt?: string) => void;
}

const EventCard: React.FC<{ event: WellnessEvent; onActivity: (prompt: string) => void }> = ({ event, onActivity }) => {
  const Icon = iconMap[event.icon] || Sparkles;
  return (
    <Card className={`${event.borderColor} bg-gradient-to-r ${event.gradient}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {event.title}
          {event.day && <Badge variant="outline" className="ml-auto text-xs">{event.day}/{event.month + 1}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {event.facts.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
        <p className="text-sm font-medium text-primary">{event.message}</p>
        <div className="border-t pt-3 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2"><Target className="h-4 w-4" /> Activities & Challenges</h4>
          {event.activities.map((activity, i) => (
            <Card key={i} className="bg-background/80">
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h5 className="font-medium text-sm">{activity.title}</h5>
                  <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                </div>
                <Button size="sm" onClick={() => onActivity(activity.prompt)} className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const EventsMenu: React.FC<EventsMenuProps> = ({ onNavigateToMindMate }) => {
  const [showEvents, setShowEvents] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

  const activeEvents = useMemo(() => getActiveEvents(new Date()), []);

  const handleActivityStart = (prompt: string) => {
    setShowEvents(false);
    onNavigateToMindMate(prompt);
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
        {activeEvents.length > 0 && (
          <Badge className="ml-1 bg-white/20 text-white text-xs px-1.5">{activeEvents.length}</Badge>
        )}
      </Button>

      <Dialog open={showEvents} onOpenChange={setShowEvents}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Events & Awareness Days
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {activeEvents.length > 0 ? (
              activeEvents.map((event) => (
                <EventCard key={event.id} event={event} onActivity={handleActivityStart} />
              ))
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No specific awareness events today, but your wellness journey never stops!</p>
                </CardContent>
              </Card>
            )}

            {/* Transformation Challenge - Always */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Transformation Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Card className="bg-background/80">
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div>
                      <h5 className="font-medium text-sm">Personal Growth Journey</h5>
                      <p className="text-xs text-muted-foreground">Set a goal and get AI-powered guidance</p>
                    </div>
                    <Button size="sm" onClick={() => { setShowEvents(false); setShowChallenge(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <TransformationChallenge isOpen={showChallenge} onClose={() => setShowChallenge(false)} onStartChallenge={onNavigateToMindMate} />
    </>
  );
};

export default EventsMenu;
