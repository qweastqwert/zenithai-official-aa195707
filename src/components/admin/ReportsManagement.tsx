import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCommunityReports } from '@/hooks/useCommunityReports';
import { useCommunityBans } from '@/hooks/useCommunityBans';
import { Flag, Ban, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const ReportsManagement: React.FC = () => {
  const { reports, loading: reportsLoading, updateReportStatus } = useCommunityReports();
  const { bans, loading: bansLoading, createBan, removeBan } = useCommunityBans();
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDays, setBanDays] = useState(7);
  const [isPermanent, setIsPermanent] = useState(false);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const reviewedReports = reports.filter(r => r.status !== 'pending');

  const handleBanUser = (userId: string | null) => {
    if (!userId) return;
    setSelectedUserId(userId);
    setBanDialogOpen(true);
  };

  const submitBan = async () => {
    if (!selectedUserId || !banReason.trim()) return;
    const success = await createBan(selectedUserId, banReason, banDays, isPermanent);
    if (success) {
      setBanDialogOpen(false);
      setSelectedUserId(null);
      setBanReason('');
      setBanDays(7);
      setIsPermanent(false);
    }
  };

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      spam: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      harassment: 'bg-red-500/10 text-red-500 border-red-500/20',
      inappropriate_content: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      misinformation: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return colors[reason] || colors.other;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      pending: { color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
      reviewed: { color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle },
      dismissed: { color: 'bg-gray-500/10 text-gray-500', icon: XCircle },
      actioned: { color: 'bg-green-500/10 text-green-500', icon: Shield },
    };
    const { color, icon: Icon } = config[status] || config.pending;
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  if (reportsLoading || bansLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="reports" className="w-full">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Reports ({pendingReports.length})
          </TabsTrigger>
          <TabsTrigger value="bans" className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Bans ({bans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Community Reports
              </CardTitle>
              <CardDescription>
                Review and take action on reported posts and comments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reports yet
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Pending Reports</h3>
                    {pendingReports.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No pending reports</div>
                    ) : (
                      pendingReports.map((report) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border border-border rounded-lg space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{report.report_type}</Badge>
                                <Badge className={getReasonBadge(report.reason)}>
                                  {report.reason.replace('_', ' ')}
                                </Badge>
                                {getStatusBadge(report.status)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Reported {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          
                          {report.details && (
                            <p className="text-sm text-muted-foreground">{report.details}</p>
                          )}

                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateReportStatus(report.id, 'dismissed')}
                            >
                              Dismiss
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateReportStatus(report.id, 'reviewed')}
                            >
                              Mark Reviewed
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                handleBanUser(report.reported_user_id);
                                updateReportStatus(report.id, 'actioned');
                              }}
                              disabled={!report.reported_user_id}
                            >
                              Ban User
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {reviewedReports.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <h3 className="text-sm font-semibold">Reviewed Reports</h3>
                      {reviewedReports.map((report) => (
                        <div
                          key={report.id}
                          className="p-3 border border-border rounded-lg space-y-2 opacity-60"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{report.report_type}</Badge>
                              <Badge className={`text-xs ${getReasonBadge(report.reason)}`}>
                                {report.reason.replace('_', ' ')}
                              </Badge>
                              {getStatusBadge(report.status)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bans" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Community Bans
              </CardTitle>
              <CardDescription>
                Manage banned users and their restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active bans
                </div>
              ) : (
                bans.map((ban) => (
                  <motion.div
                    key={ban.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-destructive/20 rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">
                            {ban.is_permanent ? 'Permanent Ban' : `${ban.ban_days} days`}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Until: {new Date(ban.banned_until).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm font-medium">User ID: {ban.user_id.slice(0, 8)}...</p>
                        <p className="text-sm text-muted-foreground">{ban.reason}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeBan(ban.id)}
                      >
                        Unban
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User from Community</DialogTitle>
            <DialogDescription>
              Restrict this user's access to community features
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason for ban</Label>
              <Textarea
                id="ban-reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Explain why this user is being banned..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ban-days">Ban duration (days)</Label>
              <Input
                id="ban-days"
                type="number"
                min="1"
                max="365"
                value={banDays}
                onChange={(e) => setBanDays(parseInt(e.target.value) || 1)}
                disabled={isPermanent}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="permanent"
                checked={isPermanent}
                onChange={(e) => setIsPermanent(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="permanent" className="cursor-pointer">
                Permanent ban
              </Label>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setBanDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={submitBan}
                disabled={!banReason.trim()}
              >
                Ban User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsManagement;
