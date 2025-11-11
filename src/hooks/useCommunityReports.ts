import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CommunityReport {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  report_type: 'post' | 'comment';
  content_id: string;
  reason: 'spam' | 'harassment' | 'inappropriate_content' | 'misinformation' | 'other';
  details: string | null;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useCommunityReports = () => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (
    reportType: 'post' | 'comment',
    contentId: string,
    reportedUserId: string | null,
    reason: 'spam' | 'harassment' | 'inappropriate_content' | 'misinformation' | 'other',
    details?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to report content');
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_reports')
        .insert({
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          report_type: reportType,
          content_id: contentId,
          reason,
          details: details || null
        });

      if (error) throw error;

      toast.success('Report submitted successfully');
      await fetchReports();
      return true;
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to submit report');
      return false;
    }
  };

  const updateReportStatus = async (
    reportId: string,
    status: 'reviewed' | 'dismissed' | 'actioned'
  ) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_reports')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      toast.success('Report status updated');
      await fetchReports();
      return true;
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  return {
    reports,
    loading,
    fetchReports,
    createReport,
    updateReportStatus
  };
};
