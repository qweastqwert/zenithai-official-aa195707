import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { useSleepProfile } from '@/hooks/useSleepProfile';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Moon, Sun, TrendingUp, Clock, CheckCircle2, Award } from 'lucide-react';

export const SleepAnalytics = () => {
  const { logs } = useSleepLogs();
  const { profile } = useSleepProfile();

  // Compute scheduled sleep duration (hours) from profile sleep_time/wake_time
  const scheduledDuration = useMemo(() => {
    if (!profile?.sleep_time || !profile?.wake_time) return null;
    const [sh, sm] = profile.sleep_time.split(':').map(Number);
    const [wh, wm] = profile.wake_time.split(':').map(Number);
    let mins = (wh * 60 + wm) - (sh * 60 + sm);
    if (mins <= 0) mins += 24 * 60; // wrap past midnight
    return mins / 60;
  }, [profile]);

  const analytics = useMemo(() => {
    if (!logs.length) return null;

    const last30Days = logs.slice(0, 30);
    const totalDays = last30Days.length;
    const sleepConfirmedDays = last30Days.filter(log => log.sleep_confirmed_at).length;
    const qualityLoggedDays = last30Days.filter(log => log.sleep_quality).length;
    
    const qualityCounts = last30Days.reduce((acc, log) => {
      if (log.sleep_quality) {
        acc[log.sleep_quality] = (acc[log.sleep_quality] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostCommonQuality = Object.entries(qualityCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    // Calculate current streak
    let currentStreak = 0;
    for (const log of logs) {
      if (log.sleep_confirmed_at) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (const log of logs.slice().reverse()) {
      if (log.sleep_confirmed_at) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Chart data for last 7 days — quality score over time
    const chartData = logs.slice(0, 7).reverse().map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
      quality: log.sleep_quality ? getQualityScore(log.sleep_quality) : 0,
      tracked: log.sleep_confirmed_at ? 1 : 0,
    }));

    // Average quality score (only counting days that have a quality log)
    const qualityScores = last30Days
      .filter(l => l.sleep_quality)
      .map(l => getQualityScore(l.sleep_quality!));
    const avgQualityScore = qualityScores.length
      ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
      : 0;

    // Best & worst day
    const bestDay = [...last30Days]
      .filter(l => l.sleep_quality)
      .sort((a, b) => getQualityScore(b.sleep_quality!) - getQualityScore(a.sleep_quality!))[0];
    const worstDay = [...last30Days]
      .filter(l => l.sleep_quality)
      .sort((a, b) => getQualityScore(a.sleep_quality!) - getQualityScore(b.sleep_quality!))[0];

    // Consistency: % of days where user confirmed sleep within their schedule window
    const consistency = totalDays > 0 ? Math.round((sleepConfirmedDays / Math.max(totalDays, 7)) * 100) : 0;

    return {
      totalDays,
      sleepConfirmedDays,
      qualityLoggedDays,
      sleepTrackingRate: Math.round((sleepConfirmedDays / totalDays) * 100),
      qualityLoggingRate: Math.round((qualityLoggedDays / totalDays) * 100),
      mostCommonQuality,
      currentStreak,
      longestStreak,
      chartData,
      qualityCounts,
      avgQualityScore,
      bestDay,
      worstDay,
      consistency,
    };
  }, [logs]);

  if (!analytics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Analytics</CardTitle>
            <CardDescription>No sleep data available yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Start tracking your sleep to see insights and analytics here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Clock className="h-3.5 w-3.5" /> Avg Quality
            </div>
            <div className="text-2xl font-bold text-primary">
              {analytics.avgQualityScore ? analytics.avgQualityScore.toFixed(1) : '—'}<span className="text-sm text-muted-foreground">/5</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Moon className="h-3.5 w-3.5" /> Scheduled
            </div>
            <div className="text-2xl font-bold">
              {scheduledDuration ? `${scheduledDuration.toFixed(1)}h` : '—'}
            </div>
            <div className="text-xs text-muted-foreground">per night</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Consistency
            </div>
            <div className="text-2xl font-bold">{analytics.consistency}%</div>
            <Progress value={analytics.consistency} className="mt-1.5 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Award className="h-3.5 w-3.5" /> Best Streak
            </div>
            <div className="text-2xl font-bold">{analytics.longestStreak}<span className="text-sm text-muted-foreground"> days</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sleep Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics.sleepTrackingRate}%</div>
            <div className="text-sm text-muted-foreground">
              {analytics.sleepConfirmedDays} of {analytics.totalDays} days
            </div>
            <Progress value={analytics.sleepTrackingRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quality Logging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics.qualityLoggingRate}%</div>
            <div className="text-sm text-muted-foreground">
              {analytics.qualityLoggedDays} of {analytics.totalDays} days
            </div>
            <Progress value={analytics.qualityLoggingRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{analytics.currentStreak}</div>
            <div className="text-sm text-muted-foreground">consecutive days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{analytics.longestStreak}</div>
            <div className="text-sm text-muted-foreground">days achieved</div>
          </CardContent>
        </Card>
      </div>

      {/* Best / Worst night */}
      {(analytics.bestDay || analytics.worstDay) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.bestDay && (
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" /> Best Night
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm capitalize font-medium">{analytics.bestDay.sleep_quality}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(analytics.bestDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </CardContent>
            </Card>
          )}
          {analytics.worstDay && analytics.worstDay !== analytics.bestDay && (
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sun className="h-4 w-4 text-orange-500" /> Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm capitalize font-medium">{analytics.worstDay.sleep_quality}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(analytics.worstDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Sleep Quality Distribution */}
      {Object.keys(analytics.qualityCounts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sleep Quality Distribution</CardTitle>
            <CardDescription>Your most common sleep quality over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.qualityCounts)
                .sort(([,a], [,b]) => b - a)
                .map(([quality, count]) => (
                  <div key={quality} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={quality === analytics.mostCommonQuality ? "default" : "secondary"}>
                        {quality}
                      </Badge>
                      {quality === analytics.mostCommonQuality && (
                        <span className="text-xs text-muted-foreground">Most common</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">{count} days</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last 7 Days Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Trend (7 days)</CardTitle>
          <CardDescription>Your sleep quality score over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="quality" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} name="Quality" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sleep Schedule */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Your Sleep Schedule</CardTitle>
            <CardDescription>Current sleep and wake times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{profile.sleep_time}</div>
                <div className="text-sm text-muted-foreground">Sleep Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{profile.wake_time}</div>
                <div className="text-sm text-muted-foreground">Wake Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

function getQualityScore(quality: string): number {
  const scores = {
    excellent: 5,
    good: 4,
    fair: 3,
    poor: 2,
    terrible: 1
  };
  return scores[quality as keyof typeof scores] || 0;
}