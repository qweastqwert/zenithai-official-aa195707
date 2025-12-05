import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, ArrowUp, Clock } from 'lucide-react';
import { useTrendingPosts, TrendingPeriod } from '@/hooks/useTrendingPosts';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const periodLabels: Record<TrendingPeriod, string> = {
  '24h': '24 Hours',
  'week': 'This Week',
  'month': 'This Month',
  'all': 'All Time'
};

interface TrendingPostsProps {
  onPostClick?: (postId: string) => void;
}

const TrendingPosts: React.FC<TrendingPostsProps> = ({ onPostClick }) => {
  const [period, setPeriod] = useState<TrendingPeriod>('week');
  const { posts, loading } = useTrendingPosts(period);

  return (
    <Card className="bg-gradient-to-br from-[#7950f2]/10 to-[#b197fc]/5 backdrop-blur-sm border-[#7950f2]/30 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="h-5 w-5 text-orange-500" />
            </motion.div>
            Trending Posts
          </CardTitle>
          <div className="flex gap-1 flex-wrap">
            {(Object.keys(periodLabels) as TrendingPeriod[]).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'default' : 'ghost'}
                onClick={() => setPeriod(p)}
                className={
                  period === p
                    ? 'bg-[#7950f2] hover:bg-[#6741d9] text-white text-xs px-2 py-1 h-7'
                    : 'text-muted-foreground hover:text-foreground hover:bg-[#7950f2]/10 text-xs px-2 py-1 h-7'
                }
              >
                {periodLabels[p]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-[#7950f2] border-t-transparent rounded-full"
            />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-6">
            <TrendingUp className="h-8 w-8 text-[#7950f2]/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No trending posts for this period
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={period}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => onPostClick?.(post.id)}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-[#7950f2]/10 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-1 text-[#7950f2] font-semibold min-w-[40px]">
                    <ArrowUp className="h-4 w-4" />
                    <span>{post.vote_score}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm truncate group-hover:text-[#7950f2] transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500/70">
                    {index < 3 && <Flame className="h-4 w-4" />}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingPosts;
