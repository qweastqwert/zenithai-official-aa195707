import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Trophy, Flame } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { rows, loading, error } = useLeaderboard(25);

  if (loading) return <div className="p-6 text-center text-sm text-muted-foreground">Loading leaderboard…</div>;
  if (error) return <div className="p-6 text-center text-sm text-destructive">Couldn't load leaderboard.</div>;

  return (
    <div className="space-y-2">
      <Card><CardContent className="p-3 text-xs text-muted-foreground">
        Ranked by achievements unlocked, then longest streak, then days active. Names are masked unless a public username is set.
      </CardContent></Card>
      {rows.map((r, i) => (
        <div
          key={r.user_id}
          className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 border ${
            r.isMe ? 'bg-primary/10 border-primary/40' : 'bg-muted/30 border-transparent'
          }`}
        >
          <div className="w-7 text-center font-bold text-sm">
            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">
              {r.display_name} {r.isMe && <span className="text-[10px] text-primary">(you)</span>}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5"><Trophy className="h-3 w-3" />{r.achievements_count}</span>
              <span className="inline-flex items-center gap-0.5"><Flame className="h-3 w-3" />{r.longest_streak}d</span>
              <span>·</span>
              <span>{r.total_days_used}d active</span>
            </div>
          </div>
        </div>
      ))}
      {rows.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No entries yet — be the first!</div>}
    </div>
  );
};

export default Leaderboard;