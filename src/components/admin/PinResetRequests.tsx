import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, KeyRound, Check, X, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResetRow {
  id: string;
  user_id: string;
  user_email: string | null;
  user_display_name: string | null;
  reason: string;
  confirmation_phrase: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const PinResetRequests: React.FC = () => {
  const [rows, setRows] = useState<ResetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from('pin_reset_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (filter === 'pending') q = q.eq('status', 'pending');
    const { data, error } = await q;
    if (error) toast({ title: 'Failed to load requests', description: error.message, variant: 'destructive' });
    else setRows((data as any) ?? []);
    setLoading(false);
  }, [filter, toast]);

  useEffect(() => { load(); }, [load]);

  const approve = async (row: ResetRow) => {
    if (!confirm(`Clear PIN for ${row.user_email ?? row.user_id}?\n\nThis cannot be undone. The user will need to set a new PIN.`)) return;
    setBusyId(row.id);
    const { error } = await supabase.rpc('admin_clear_journal_pin', {
      _target_user: row.user_id,
      _request_id: row.id,
    });
    if (error) toast({ title: 'Approve failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'PIN cleared and request approved' }); load(); }
    setBusyId(null);
  };

  const deny = async (row: ResetRow) => {
    setBusyId(row.id);
    const { error } = await supabase
      .from('pin_reset_requests')
      .update({
        status: 'denied',
        admin_notes: notes[row.id] ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', row.id);
    if (error) toast({ title: 'Deny failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Request denied' }); load(); }
    setBusyId(null);
  };

  const pendingCount = rows.filter(r => r.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> Private Journal PIN Reset Requests
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-1">{pendingCount} pending</Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>Pending</Button>
            <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No requests {filter === 'pending' ? 'pending' : 'yet'}.</p>
        ) : rows.map(r => (
          <div key={r.id} className="border rounded-lg p-3 space-y-2 text-sm">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="font-semibold">{r.user_display_name || r.user_email || r.user_id.slice(0, 8)}</div>
                <div className="text-xs text-muted-foreground">{r.user_email}</div>
                <div className="text-[10px] text-muted-foreground font-mono">uid: {r.user_id}</div>
              </div>
              <div className="text-right">
                <Badge variant={r.status === 'pending' ? 'default' : r.status === 'approved' ? 'secondary' : 'outline'}>
                  {r.status}
                </Badge>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded p-2 text-xs whitespace-pre-wrap">
              <strong>Reason:</strong> {r.reason}
            </div>
            <div className="text-[10px] text-muted-foreground italic">
              Typed phrase: "{r.confirmation_phrase}"
            </div>

            {r.status === 'pending' && (
              <>
                <Textarea
                  placeholder="Optional admin notes (visible to admins only)"
                  rows={2}
                  value={notes[r.id] ?? ''}
                  onChange={(e) => setNotes(n => ({ ...n, [r.id]: e.target.value }))}
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => deny(r)}>
                    <X className="h-3 w-3 mr-1" /> Deny
                  </Button>
                  <Button size="sm" variant="destructive" disabled={busyId === r.id} onClick={() => approve(r)}>
                    {busyId === r.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                    Approve & clear PIN
                  </Button>
                </div>
              </>
            )}

            {r.admin_notes && (
              <div className="text-xs text-muted-foreground border-l-2 pl-2">
                <ShieldAlert className="inline h-3 w-3 mr-1" /> {r.admin_notes}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PinResetRequests;