import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, MessageSquare, FileText, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActivityLog {
  type: string;
  count: number;
  date: string;
}

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');

  useEffect(() => {
    fetchActivityLogs();
  }, [timeRange]);

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

      const [postsResult, commentsResult, moodResult, journalResult] = await Promise.all([
        supabase
          .from('community_posts')
          .select('created_at')
          .gte('created_at', daysAgo.toISOString()),
        supabase
          .from('community_comments')
          .select('created_at')
          .gte('created_at', daysAgo.toISOString()),
        supabase
          .from('mood_entries')
          .select('created_at')
          .gte('created_at', daysAgo.toISOString()),
        supabase
          .from('journal_entries')
          .select('created_at')
          .gte('created_at', daysAgo.toISOString())
      ]);

      const activities: ActivityLog[] = [
        { type: 'Posts Created', count: postsResult.data?.length || 0, date: 'Recent' },
        { type: 'Comments Posted', count: commentsResult.data?.length || 0, date: 'Recent' },
        { type: 'Mood Entries', count: moodResult.data?.length || 0, date: 'Recent' },
        { type: 'Journal Entries', count: journalResult.data?.length || 0, date: 'Recent' }
      ];

      setLogs(activities);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Posts Created': return <FileText className="h-5 w-5" />;
      case 'Comments Posted': return <MessageSquare className="h-5 w-5" />;
      case 'Mood Entries': return <Activity className="h-5 w-5" />;
      case 'Journal Entries': return <Calendar className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'Posts Created': return 'text-blue-500';
      case 'Comments Posted': return 'text-green-500';
      case 'Mood Entries': return 'text-purple-500';
      case 'Journal Entries': return 'text-orange-500';
      default: return 'text-primary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Logs
            </CardTitle>
            <CardDescription>Monitor user activity across the platform</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(value: '7' | '30' | '90') => setTimeRange(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <motion.div
                key={log.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-background ${getColor(log.type)}`}>
                    {getIcon(log.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{log.type}</p>
                    <p className="text-xs text-muted-foreground">Last {timeRange} days</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {log.count}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
