import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface TreatmentGoal {
  title: string;
  rationale?: string;
  measurable?: string;
  done?: boolean;
}

export interface TreatmentPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  goals: TreatmentGoal[];
  status: string;
  cbt_summary: string | null;
  ai_context: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useTreatmentPlan = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('treatment_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setPlans((data || []) as any);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const createPlan = async (input: Partial<TreatmentPlan>) => {
    if (!user) return null;
    const { data, error } = await supabase.from('treatment_plans').insert({
      user_id: user.id,
      title: input.title || 'My Treatment Plan',
      description: input.description ?? null,
      goals: (input.goals ?? []) as any,
      status: input.status || 'active',
      cbt_summary: input.cbt_summary ?? null,
      ai_context: input.ai_context ?? null,
      start_date: input.start_date ?? new Date().toISOString().split('T')[0],
      end_date: input.end_date ?? null,
    }).select().single();
    if (error) { toast.error('Could not save plan'); return null; }
    toast.success('Treatment plan created ✨');
    await load();
    return data as any;
  };

  const updatePlan = async (id: string, updates: Partial<TreatmentPlan>) => {
    const { error } = await supabase.from('treatment_plans').update(updates as any).eq('id', id);
    if (error) { toast.error('Could not update plan'); return false; }
    await load();
    return true;
  };

  const deletePlan = async (id: string) => {
    const { error } = await supabase.from('treatment_plans').delete().eq('id', id);
    if (error) { toast.error('Could not delete plan'); return false; }
    toast.success('Plan removed');
    await load();
    return true;
  };

  const activePlan = plans.find(p => p.status === 'active') || null;

  return { plans, activePlan, loading, createPlan, updatePlan, deletePlan, refresh: load };
};