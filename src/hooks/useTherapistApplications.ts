import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TherapistApplication {
  id: string;
  user_id: string;
  full_name: string;
  license_number: string;
  specialization: string;
  experience_years: number;
  education: string;
  status: string;
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

export const useTherapistApplications = () => {
  const [applications, setApplications] = useState<TherapistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('therapist_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (applicationData: Omit<TherapistApplication, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('therapist_applications')
        .insert({
          user_id: user.id,
          ...applicationData,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchApplications();
      return data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected', notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('therapist_applications')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          notes,
        })
        .eq('id', applicationId);

      if (error) throw error;
      
      // If approved, add therapist role
      if (status === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          await supabase
            .from('user_roles')
            .insert({
              user_id: application.user_id,
              role: 'therapist',
            });
        }
      }
      
      await fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  return {
    applications,
    loading,
    fetchApplications,
    createApplication,
    updateApplicationStatus,
  };
};