import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Moon, Sun, BarChart3, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSleepProfile } from '@/hooks/useSleepProfile';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { SleepSetupForm } from './SleepSetupForm';
import { SleepQualityPrompt } from './SleepQualityPrompt';
import { SleepAnalytics } from './SleepAnalytics';
import { NotificationService } from '@/services/notificationService';
import { toast } from 'sonner';

export const SleepTracker = () => {
  const { profile, loading: profileLoading } = useSleepProfile();
  const { logs, confirmSleep, getTodaysLog, loading: logsLoading } = useSleepLogs();
  const [showSetup, setShowSetup] = useState(false);
  const [showQualityPrompt, setShowQualityPrompt] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const todaysLog = getTodaysLog();

  const handleConfirmSleep = async () => {
    const result = await confirmSleep();
    if (result?.success) {
      toast.success('Sleep confirmed! Sweet dreams 🌙');
    } else {
      toast.error('Failed to confirm sleep');
    }
  };

  if (profileLoading || logsLoading) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <div className="p-4 flex items-center text-white" style={{ backgroundColor: 'var(--zenith-primary)' }}>
          <Link to="/" className="mr-4">
            <Button variant="ghost" className="text-white hover:bg-black/20 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Sleep Tracker</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile || showSetup) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <div className="p-4 flex items-center text-white" style={{ backgroundColor: 'var(--zenith-primary)' }}>
          <Link to="/" className="mr-4">
            <Button variant="ghost" className="text-white hover:bg-black/20 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Sleep Tracker</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <SleepSetupForm 
            onComplete={() => setShowSetup(false)} 
            isOnboarding={!profile}
          />
        </div>
      </div>
    );
  }

  if (showQualityPrompt) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <div className="p-4 flex items-center text-white" style={{ backgroundColor: 'var(--zenith-primary)' }}>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-black/20 p-2 mr-4"
            onClick={() => setShowQualityPrompt(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Sleep Quality</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <SleepQualityPrompt onComplete={() => setShowQualityPrompt(false)} />
        </div>
      </div>
    );
  }

  if (showAnalytics) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <div className="p-4 flex items-center text-white" style={{ backgroundColor: 'var(--zenith-primary)' }}>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-black/20 p-2 mr-4"
            onClick={() => setShowAnalytics(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Sleep Analytics</h1>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <SleepAnalytics />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <div className="p-4 flex items-center text-white" style={{ backgroundColor: 'var(--zenith-primary)' }}>
        <Link to="/" className="mr-4">
          <Button variant="ghost" className="text-white hover:bg-black/20 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Sleep Tracker</h1>
        
        <div className="ml-auto">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-black/20 p-2"
            onClick={() => setShowSetup(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Current Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Your Sleep Schedule
            </CardTitle>
            <CardDescription>
              Current sleep and wake times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{profile.sleep_time}</div>
                <div className="text-sm text-muted-foreground">Sleep Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{profile.wake_time}</div>
                <div className="text-sm text-muted-foreground">Wake Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Sleep Status */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Sleep</CardTitle>
            <CardDescription>
              Track your sleep for {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Sleep Confirmed:</span>
              <Badge variant={todaysLog?.sleep_confirmed_at ? "default" : "secondary"}>
                {todaysLog?.sleep_confirmed_at ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            {todaysLog?.sleep_confirmed_at && (
              <div className="flex items-center justify-between">
                <span>Sleep Quality:</span>
                <Badge variant={todaysLog.sleep_quality ? "default" : "secondary"}>
                  {todaysLog.sleep_quality || 'Not logged'}
                </Badge>
              </div>
            )}
            
            <Separator />
            
            <div className="flex flex-col gap-2">
              {!todaysLog?.sleep_confirmed_at && (
                <Button onClick={handleConfirmSleep} className="w-full">
                  <Moon className="h-4 w-4 mr-2" />
                  Confirm Sleep
                </Button>
              )}
              
              {todaysLog?.sleep_confirmed_at && !todaysLog?.sleep_quality && (
                <Button onClick={() => setShowQualityPrompt(true)} className="w-full">
                  <Sun className="h-4 w-4 mr-2" />
                  Log Sleep Quality
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Sleep Insights</CardTitle>
            <CardDescription>
              View your sleep patterns and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowAnalytics(true)} className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Sleep Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sleep History */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sleep History</CardTitle>
              <CardDescription>
                Your last 7 sleep entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.slice(0, 7).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{new Date(log.date).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Badge variant={log.sleep_confirmed_at ? "default" : "secondary"} className="text-xs">
                        {log.sleep_confirmed_at ? 'Slept' : 'No data'}
                      </Badge>
                      {log.sleep_quality && (
                        <Badge variant="outline" className="text-xs">
                          {log.sleep_quality}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};