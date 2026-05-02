import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Download, TrendingUp, Heart, Flame, BookOpen, Brain, Activity, Calendar, Moon } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useSleepLogs } from '@/hooks/useSleepLogs';
import { useSleepProfile } from '@/hooks/useSleepProfile';
import { generateWellnessReport, generateSleepReport } from '@/utils/pdfReport';
import { toast } from 'sonner';

const MOOD_SCORES: Record<string, number> = {
  'very-happy': 5, happy: 4, excited: 5, grateful: 5, peaceful: 5, confident: 5,
  calm: 4, content: 4, energetic: 4, hopeful: 4,
  neutral: 3,
  sad: 2, anxious: 2, tired: 2, lonely: 2, worried: 2,
  'very-sad': 1, stressed: 1, overwhelmed: 1, frustrated: 1,
};

const QUALITY_SCORES: Record<string, number> = {
  excellent: 5, good: 4, fair: 3, poor: 2, terrible: 1,
};

const COLORS = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { entries: moodEntries } = useMoodDataSupabase();
  const { entries: journalEntries } = useJournalSupabase();
  const activityTracker = useActivityTracker();
  const { logs: sleepLogs } = useSleepLogs();
  const { profile: sleepProfile } = useSleepProfile();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const userName = profile?.name || user?.email?.split('@')[0] || 'Friend';

  const range = useMemo(() => {
    const now = new Date();
    const start = new Date();
    if (timeframe === 'weekly') start.setDate(now.getDate() - 7);
    else start.setMonth(now.getMonth() - 1);
    return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0], days: timeframe === 'weekly' ? 7 : 30 };
  }, [timeframe]);

  const data = useMemo(() => {
    const periodMoods = moodEntries.filter(e => e.date >= range.start && e.date <= range.end);
    const periodJournals = journalEntries.filter(j => j.date >= range.start && j.date <= range.end);

    const moodCounts = periodMoods.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {} as Record<string, number>);
    const scored = periodMoods.map(e => MOOD_SCORES[e.mood] ?? 3);
    const avgScore = scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : 0;
    const positivePct = scored.length ? Math.round((scored.filter(s => s >= 4).length / scored.length) * 100) : 0;
    const lowPct = scored.length ? Math.round((scored.filter(s => s <= 2).length / scored.length) * 100) : 0;

    // Daily trend: avg mood per day
    const dailyMap: Record<string, number[]> = {};
    periodMoods.forEach(e => { (dailyMap[e.date] ||= []).push(MOOD_SCORES[e.mood] ?? 3); });
    const dailyJournals: Record<string, number> = {};
    periodJournals.forEach(j => { dailyJournals[j.date] = (dailyJournals[j.date] || 0) + 1; });

    const trend: Array<{ date: string; mood: number; journals: number; label: string }> = [];
    for (let i = range.days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const arr = dailyMap[key] || [];
      const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      trend.push({
        date: key,
        mood: Number(avg.toFixed(2)),
        journals: dailyJournals[key] || 0,
        label: d.toLocaleDateString('en-US', timeframe === 'weekly' ? { weekday: 'short' } : { month: 'short', day: 'numeric' }),
      });
    }

    // Hour-of-day pattern
    const hourBuckets = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, count: 0, avg: 0, _scores: [] as number[] }));
    periodMoods.forEach(e => {
      const h = new Date(e.timestamp).getHours();
      hourBuckets[h].count++;
      hourBuckets[h]._scores.push(MOOD_SCORES[e.mood] ?? 3);
    });
    hourBuckets.forEach(b => { b.avg = b._scores.length ? Number((b._scores.reduce((a, b) => a + b, 0) / b._scores.length).toFixed(2)) : 0; });

    // Day-of-week pattern
    const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dowBuckets = dows.map(d => ({ day: d, count: 0, _scores: [] as number[], avg: 0 }));
    periodMoods.forEach(e => {
      const d = new Date(e.timestamp).getDay();
      dowBuckets[d].count++;
      dowBuckets[d]._scores.push(MOOD_SCORES[e.mood] ?? 3);
    });
    dowBuckets.forEach(b => { b.avg = b._scores.length ? Number((b._scores.reduce((a, b) => a + b, 0) / b._scores.length).toFixed(2)) : 0; });

    const moodPie = Object.entries(moodCounts).sort(([, a], [, b]) => b - a).map(([name, value]) => ({ name, value }));

    const uniqueDays = new Set([...periodMoods.map(e => e.date), ...periodJournals.map(j => j.date)]).size;
    const mostCommonMood = moodPie[0]?.name ?? null;

    return {
      periodMoods, periodJournals, moodCounts, avgScore, positivePct, lowPct,
      trend, hourBuckets, dowBuckets, moodPie, uniqueDays, mostCommonMood,
    };
  }, [moodEntries, journalEntries, range, timeframe]);

  const sleepData = useMemo(() => {
    if (!sleepLogs.length) return null;
    const last30 = sleepLogs.slice(0, 30);
    const qualityCounts = last30.reduce((acc, l) => { if (l.sleep_quality) acc[l.sleep_quality] = (acc[l.sleep_quality] || 0) + 1; return acc; }, {} as Record<string, number>);
    const qScores = last30.filter(l => l.sleep_quality).map(l => QUALITY_SCORES[l.sleep_quality!] ?? 0);
    const avgQuality = qScores.length ? qScores.reduce((a, b) => a + b, 0) / qScores.length : 0;
    const confirmed = last30.filter(l => l.sleep_confirmed_at).length;
    const consistency = last30.length ? Math.round((confirmed / Math.max(last30.length, 7)) * 100) : 0;

    let currentStreak = 0;
    for (const l of sleepLogs) { if (l.sleep_confirmed_at) currentStreak++; else break; }
    let longest = 0, temp = 0;
    for (const l of [...sleepLogs].reverse()) { if (l.sleep_confirmed_at) { temp++; longest = Math.max(longest, temp); } else temp = 0; }

    const trend = [...last30].reverse().map(l => ({
      date: l.date,
      label: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      quality: l.sleep_quality ? QUALITY_SCORES[l.sleep_quality] : 0,
    }));

    let scheduledDuration: number | null = null;
    if (sleepProfile?.sleep_time && sleepProfile?.wake_time) {
      const [sh, sm] = sleepProfile.sleep_time.split(':').map(Number);
      const [wh, wm] = sleepProfile.wake_time.split(':').map(Number);
      let mins = (wh * 60 + wm) - (sh * 60 + sm);
      if (mins <= 0) mins += 24 * 60;
      scheduledDuration = mins / 60;
    }

    return {
      last30, qualityCounts, avgQuality, consistency, currentStreak, longest, trend,
      scheduledDuration, confirmed,
      trackingRate: last30.length ? Math.round((confirmed / last30.length) * 100) : 0,
      qualityLoggingRate: last30.length ? Math.round((qScores.length / last30.length) * 100) : 0,
    };
  }, [sleepLogs, sleepProfile]);

  const usage = activityTracker.getStats();

  const exportWellness = () => {
    try {
      generateWellnessReport({
        userName,
        timeframe,
        avgMoodScore: data.avgScore,
        positivePct: data.positivePct,
        lowPct: data.lowPct,
        totalMoodEntries: data.periodMoods.length,
        uniqueActiveDays: data.uniqueDays,
        periodDays: range.days,
        journalCount: data.periodJournals.length,
        mindMateUsage: usage.mindMateUsage,
        totalDaysUsed: usage.totalDaysUsed || 0,
        mostCommonMood: data.mostCommonMood,
        moodCounts: data.moodCounts,
        recentMoods: data.periodMoods.slice(0, 20).map(m => ({ date: m.date, mood: m.mood, reason: m.reason })),
        recentJournals: data.periodJournals.slice(0, 15).map(j => ({ date: j.date, preview: (j.content || '').substring(0, 120) })),
      });
      toast.success('Wellness report downloaded');
    } catch (e) {
      console.error(e); toast.error('Failed to export report');
    }
  };

  const exportSleep = () => {
    if (!sleepData) { toast.error('No sleep data to export yet'); return; }
    try {
      generateSleepReport({
        userName,
        scheduledDuration: sleepData.scheduledDuration,
        sleepTime: sleepProfile?.sleep_time,
        wakeTime: sleepProfile?.wake_time,
        avgQualityScore: sleepData.avgQuality,
        consistency: sleepData.consistency,
        currentStreak: sleepData.currentStreak,
        longestStreak: sleepData.longest,
        trackingRate: sleepData.trackingRate,
        qualityLoggingRate: sleepData.qualityLoggingRate,
        totalDays: sleepData.last30.length,
        qualityCounts: sleepData.qualityCounts,
        recentLogs: sleepData.last30.map(l => ({ date: l.date, confirmed: !!l.sleep_confirmed_at, quality: l.sleep_quality })),
      });
      toast.success('Sleep report downloaded');
    } catch (e) {
      console.error(e); toast.error('Failed to export report');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/chat">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Wellness Analytics</h1>
              <p className="text-sm text-muted-foreground">Deep insights from your wellness journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-md border p-0.5">
              <Button size="sm" variant={timeframe === 'weekly' ? 'default' : 'ghost'} onClick={() => setTimeframe('weekly')} className="h-7 text-xs">Week</Button>
              <Button size="sm" variant={timeframe === 'monthly' ? 'default' : 'ghost'} onClick={() => setTimeframe('monthly')} className="h-7 text-xs">Month</Button>
            </div>
            <Button onClick={exportWellness} size="sm"><Download className="h-4 w-4 mr-1" /> Export PDF</Button>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard icon={<Heart className="h-4 w-4 text-pink-500" />} label="Avg mood" value={data.avgScore ? `${data.avgScore.toFixed(1)}/5` : '—'} sub={`${data.positivePct}% positive`} />
          <StatCard icon={<Flame className="h-4 w-4 text-orange-500" />} label="Active days" value={`${data.uniqueDays}/${range.days}`} sub={`Total ${usage.totalDaysUsed || 0}d`} />
          <StatCard icon={<Calendar className="h-4 w-4 text-blue-500" />} label="Mood logs" value={String(data.periodMoods.length)} sub={data.mostCommonMood ?? '—'} />
          <StatCard icon={<BookOpen className="h-4 w-4 text-indigo-500" />} label="Journals" value={String(data.periodJournals.length)} sub={`${usage.journalUsage} sessions`} />
          <StatCard icon={<Brain className="h-4 w-4 text-purple-500" />} label="AI chats" value={String(usage.mindMateUsage)} sub="MindMate sessions" />
        </div>

        {/* Mood trend */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Mood Trend</CardTitle>
            <CardDescription>Average mood score per day {timeframe === 'weekly' ? '(last 7 days)' : '(last 30 days)'}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Area type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#moodGrad)" name="Mood" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Mood distribution pie */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>How your moods break down</CardDescription>
            </CardHeader>
            <CardContent>
              {data.moodPie.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.moodPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.name} (${e.value})`}>
                      {data.moodPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground">No mood data yet.</p>}
            </CardContent>
          </Card>

          {/* Day of week */}
          <Card>
            <CardHeader>
              <CardTitle>Mood by Day of Week</CardTitle>
              <CardDescription>When you tend to feel best</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.dowBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 5]} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Avg mood" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Hour of day */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mood by Hour</CardTitle>
            <CardDescription>Your emotional rhythm across the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.hourBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" fontSize={10} stroke="hsl(var(--muted-foreground))" interval={1} />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Logs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Journaling activity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-indigo-500" /> Journaling Activity</CardTitle>
            <CardDescription>Daily journal entries</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="journals" fill="#6366f1" radius={[4, 4, 0, 0]} name="Entries" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sleep section */}
        <div className="flex items-center justify-between mb-3 mt-10">
          <h2 className="text-xl font-bold flex items-center gap-2"><Moon className="h-5 w-5 text-primary" /> Sleep Analytics</h2>
          <Button onClick={exportSleep} size="sm" variant="outline" disabled={!sleepData}>
            <Download className="h-4 w-4 mr-1" /> Export Sleep PDF
          </Button>
        </div>

        {sleepData ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard icon={<Moon className="h-4 w-4 text-primary" />} label="Avg Quality" value={`${sleepData.avgQuality.toFixed(1)}/5`} sub={`${sleepData.qualityLoggingRate}% logged`} />
              <StatCard icon={<Activity className="h-4 w-4 text-emerald-500" />} label="Consistency" value={`${sleepData.consistency}%`} sub={`${sleepData.confirmed} of ${sleepData.last30.length} days`} />
              <StatCard icon={<Flame className="h-4 w-4 text-orange-500" />} label="Current Streak" value={`${sleepData.currentStreak}d`} sub={`Best ${sleepData.longest}d`} />
              <StatCard icon={<Calendar className="h-4 w-4 text-blue-500" />} label="Scheduled" value={sleepData.scheduledDuration ? `${sleepData.scheduledDuration.toFixed(1)}h` : '—'} sub={`${sleepProfile?.sleep_time || '—'} → ${sleepProfile?.wake_time || '—'}`} />
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sleep Quality Trend</CardTitle>
                <CardDescription>Quality score over the last {sleepData.last30.length} nights</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={sleepData.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 5]} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="quality" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} name="Quality" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {Object.keys(sleepData.qualityCounts).length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Quality Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(sleepData.qualityCounts).sort(([, a], [, b]) => b - a).map(([q, c]) => (
                      <div key={q}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize flex items-center gap-2"><Badge variant="secondary">{q}</Badge></span>
                          <span className="text-muted-foreground">{c} nights</span>
                        </div>
                        <Progress value={(c / sleepData.last30.length) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No sleep data yet. Start tracking to see analytics here.</CardContent></Card>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; sub?: string }> = ({ icon, label, value, sub }) => (
  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-1.5 mb-1 text-muted-foreground text-xs">{icon}<span>{label}</span></div>
      <div className="text-xl font-bold">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5 truncate capitalize">{sub}</div>}
    </CardContent>
  </Card>
);

export default AnalyticsPage;
