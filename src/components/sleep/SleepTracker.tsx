import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Moon, Sun, BarChart3, Settings, Stars, CloudMoon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSleepProfile } from '@/hooks/useSleepProfile';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { SleepSetupForm } from './SleepSetupForm';
import { SleepQualityPrompt } from './SleepQualityPrompt';
import { SleepAnalytics } from './SleepAnalytics';
import { NotificationService } from '@/services/notificationService';
import { toast } from 'sonner';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export const SleepTracker = () => {
  const { profile, loading: profileLoading } = useSleepProfile();
  const { logs, confirmSleep, getTodaysLog, loading: logsLoading } = useSleepLogs();
  const [showSetup, setShowSetup] = useState(false);
  const [showQualityPrompt, setShowQualityPrompt] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const todaysLog = getTodaysLog();

  useEffect(() => {
    if (profile?.sleep_time && profile?.wake_time) {
      NotificationService.getInstance().updateSleepTimes(profile.sleep_time, profile.wake_time);
    }
  }, [profile?.sleep_time, profile?.wake_time]);

  const handleConfirmSleep = async () => {
    const result = await confirmSleep();
    if (result?.success) {
      toast.success('Sleep confirmed! Sweet dreams 🌙');
    } else {
      toast.error('Failed to confirm sleep');
    }
  };

  const headerBar = (title: string, backAction?: () => void) => (
    <div className="p-4 flex items-center text-primary-foreground bg-gradient-to-r from-[hsl(263_70%_55%)] via-primary to-[hsl(220_70%_55%)] shadow-lg shadow-primary/20 backdrop-blur-md">
      {backAction ? (
        <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 p-2 mr-4" onClick={backAction}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      ) : (
        <Link to="/chat" className="mr-4">
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      )}
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );

  if (profileLoading || logsLoading) {
    return (
      <div className="flex flex-col h-screen">
        {headerBar('Sleep Tracker')}
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!profile || showSetup) {
    return (
      <div className="flex flex-col h-screen">
        {headerBar('Sleep Tracker')}
        <motion.div {...fadeUp} className="flex-1 flex items-center justify-center p-4">
          <SleepSetupForm onComplete={() => setShowSetup(false)} isOnboarding={!profile} />
        </motion.div>
      </div>
    );
  }

  if (showQualityPrompt) {
    return (
      <div className="flex flex-col h-screen">
        {headerBar('Sleep Quality', () => setShowQualityPrompt(false))}
        <motion.div {...fadeUp} className="flex-1 flex items-center justify-center p-4">
          <SleepQualityPrompt onComplete={() => setShowQualityPrompt(false)} />
        </motion.div>
      </div>
    );
  }

  if (showAnalytics) {
    return (
      <div className="flex flex-col h-screen">
        {headerBar('Sleep Analytics', () => setShowAnalytics(false))}
        <motion.div {...fadeUp} className="flex-1 overflow-auto p-4">
          <SleepAnalytics />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {headerBar('Sleep Tracker')}
      
      <motion.div 
        className="flex-1 overflow-auto p-4 space-y-4 pb-6"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Current Schedule */}
        <motion.div {...fadeUp}>
          <Card className="border-primary/20 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-1" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CloudMoon className="h-5 w-5 text-primary" />
                Your Sleep Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="text-center p-3 rounded-xl bg-primary/5"
                  whileHover={{ scale: 1.02 }}
                >
                  <Moon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-bold text-primary">{profile.sleep_time}</div>
                  <div className="text-xs text-muted-foreground">Bedtime</div>
                </motion.div>
                <motion.div 
                  className="text-center p-3 rounded-xl bg-amber-500/5"
                  whileHover={{ scale: 1.02 }}
                >
                  <Sun className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{profile.wake_time}</div>
                  <div className="text-xs text-muted-foreground">Wake Up</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Sleep Status */}
        <motion.div {...fadeUp}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today's Sleep</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sleep Confirmed</span>
                <Badge variant={todaysLog?.sleep_confirmed_at ? "default" : "secondary"} className={todaysLog?.sleep_confirmed_at ? 'bg-primary' : ''}>
                  {todaysLog?.sleep_confirmed_at ? '✓ Yes' : 'Not yet'}
                </Badge>
              </div>
              
              {todaysLog?.sleep_confirmed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sleep Quality</span>
                  <Badge variant={todaysLog.sleep_quality ? "default" : "secondary"} className={todaysLog.sleep_quality ? 'bg-primary' : ''}>
                    {todaysLog.sleep_quality || 'Not logged'}
                  </Badge>
                </div>
              )}
              
              <Separator />
              
              <div className="flex flex-col gap-2">
                {!todaysLog?.sleep_confirmed_at && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleConfirmSleep} className="w-full bg-primary hover:bg-primary/90">
                      <Moon className="h-4 w-4 mr-2" />
                      Confirm Sleep
                    </Button>
                  </motion.div>
                )}
                
                {todaysLog?.sleep_confirmed_at && !todaysLog?.sleep_quality && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button onClick={() => setShowQualityPrompt(true)} className="w-full bg-primary hover:bg-primary/90">
                      <Sun className="h-4 w-4 mr-2" />
                      Log Sleep Quality
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp} className="grid grid-cols-2 gap-3">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button onClick={() => setShowAnalytics(true)} variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-1 border-primary/20">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-xs">Analytics</span>
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button onClick={() => setShowSetup(true)} variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-1 border-primary/20">
              <Settings className="h-5 w-5 text-primary" />
              <span className="text-xs">Edit Schedule</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Recent Sleep History */}
        {logs.length > 0 && (
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stars className="h-5 w-5 text-primary" />
                  Recent History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {logs.slice(0, 7).map((log, index) => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <div className="flex gap-2">
                        <Badge variant={log.sleep_confirmed_at ? "default" : "secondary"} className={`text-xs ${log.sleep_confirmed_at ? 'bg-primary' : ''}`}>
                          {log.sleep_confirmed_at ? 'Slept' : 'No data'}
                        </Badge>
                        {log.sleep_quality && (
                          <Badge variant="outline" className="text-xs border-primary/30">
                            {log.sleep_quality}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
