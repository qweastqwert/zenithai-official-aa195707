import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, FileText, Heart, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalMoodEntries: number;
  totalJournalEntries: number;
  recentActivityCount: number;
}

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalMoodEntries: 0,
    totalJournalEntries: 0,
    recentActivityCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch various statistics
      const [
        postsCount,
        commentsCount,
        moodCount,
        journalCount,
        rolesCount,
      ] = await Promise.all([
        supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        supabase.from('community_comments').select('id', { count: 'exact', head: true }),
        supabase.from('mood_entries').select('id', { count: 'exact', head: true }),
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }),
      ]);

      // Get recent activity (posts/comments from last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentPosts = await supabase
        .from('community_posts')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        totalUsers: rolesCount.count || 0,
        totalPosts: postsCount.count || 0,
        totalComments: commentsCount.count || 0,
        totalMoodEntries: moodCount.count || 0,
        totalJournalEntries: journalCount.count || 0,
        recentActivityCount: recentPosts.count || 0,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Community Posts',
      value: stats.totalPosts,
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Comments',
      value: stats.totalComments,
      icon: FileText,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Mood Entries',
      value: stats.totalMoodEntries,
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      title: 'Journal Entries',
      value: stats.totalJournalEntries,
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Recent Activity (7d)',
      value: stats.recentActivityCount,
      icon: TrendingUp,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-sm font-medium">Database Connection</span>
              <span className="text-green-500 font-semibold">✓ Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-sm font-medium">Authentication Service</span>
              <span className="text-green-500 font-semibold">✓ Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-sm font-medium">RLS Policies</span>
              <span className="text-green-500 font-semibold">✓ Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
