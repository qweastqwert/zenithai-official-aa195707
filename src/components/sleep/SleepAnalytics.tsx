import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { useSleepProfile } from '@/hooks/useSleepProfile';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SleepAnalytics = () => {
  const { logs } = useSleepLogs();
  const { profile } = useSleepProfile();

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

    // Chart data for last 7 days
    const chartData = logs.slice(0, 7).reverse().map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
      sleep: log.sleep_confirmed_at ? 1 : 0,
      quality: log.sleep_quality ? getQualityScore(log.sleep_quality) : 0
    }));

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
      qualityCounts
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
          <CardTitle>Last 7 Days</CardTitle>
          <CardDescription>Sleep tracking and quality over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sleep' ? (value ? 'Yes' : 'No') : value,
                  name === 'sleep' ? 'Sleep Tracked' : 'Quality Score'
                ]}
              />
              <Bar dataKey="sleep" fill="hsl(var(--primary))" name="sleep" />
              <Bar dataKey="quality" fill="hsl(var(--primary) / 0.6)" name="quality" />
            </BarChart>
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