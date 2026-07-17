import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Loader2, MessageCircleHeart, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTreatmentPlan, TreatmentGoal } from '@/hooks/useTreatmentPlan';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CBTResult {
  clinical_overview?: string;
  cognitive_patterns?: string[];
  behavioral_patterns?: string[];
  cognitive_distortions?: string[];
  strengths?: string[];
  risk_indicators?: string[];
  recommendations?: string[];
  suggested_goals?: TreatmentGoal[];
}

export const CBTAnalysis: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activePlan, createPlan, deletePlan } = useTreatmentPlan();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CBTResult | null>(null);

  const generate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cbt-analysis');
      if (error) throw error;
      if (data?.analysis) setResult(data.analysis);
      else throw new Error('No analysis returned');
    } catch (e: any) {
      toast.error(e?.message || 'Could not generate analysis');
    } finally {
      setLoading(false);
    }
  };

  const openMindMateWithPlan = () => {
    const context = result
      ? `I just reviewed my CBT analysis. Overview: ${result.clinical_overview}. Suggested goals: ${(result.suggested_goals || []).map(g => g.title).join(', ')}. Please help me collaborate on a clear treatment plan I can follow daily.`
      : `Please help me build a CBT-informed treatment plan and add it to my schedule.`;
    sessionStorage.setItem('mindmate_seed_prompt', context);
    navigate('/chat?mode=mindmate&seed=treatment_plan');
  };

  const savePlanFromAnalysis = async () => {
    if (!result) return;
    await createPlan({
      title: 'CBT-Informed Treatment Plan',
      description: result.clinical_overview || '',
      goals: result.suggested_goals || [],
      cbt_summary: JSON.stringify(result),
      ai_context: result.clinical_overview || '',
      status: 'active',
    });
  };

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          CBT-Based Clinical Analysis
        </CardTitle>
        <CardDescription>
          A CBT-informed reflection on your last 30 days of moods, journals, and sleep. Not a diagnosis — a starting point for growth.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && (
          <div className="text-center py-6">
            <Button onClick={generate} disabled={loading} size="lg" className="bg-gradient-to-r from-primary to-[hsl(290_70%_55%)]">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing…</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate my clinical analysis</>}
            </Button>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {result.clinical_overview && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm leading-relaxed">{result.clinical_overview}</p>
              </div>
            )}

            <Section title="Cognitive patterns" items={result.cognitive_patterns} tone="primary" />
            <Section title="Behavioral patterns" items={result.behavioral_patterns} tone="secondary" />
            <Section title="Possible cognitive distortions" items={result.cognitive_distortions} tone="warning" />
            <Section title="Strengths" items={result.strengths} tone="success" />
            {(result.risk_indicators?.length || 0) > 0 && (
              <Section title="Signals worth watching" items={result.risk_indicators} tone="destructive" />
            )}
            <Section title="Recommended next steps" items={result.recommendations} tone="primary" />

            {(result.suggested_goals?.length || 0) > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-1"><Target className="h-4 w-4 text-primary" /> Suggested goals</p>
                {result.suggested_goals!.map((g, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-card">
                    <p className="font-medium text-sm">{g.title}</p>
                    {g.rationale && <p className="text-xs text-muted-foreground mt-1">{g.rationale}</p>}
                    {g.measurable && <p className="text-xs text-primary mt-1">📏 {g.measurable}</p>}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button onClick={openMindMateWithPlan} className="flex-1 bg-gradient-to-r from-primary to-[hsl(290_70%_55%)]">
                <MessageCircleHeart className="h-4 w-4 mr-2" /> Collaborate with MindMate
              </Button>
              {!activePlan && (
                <Button variant="outline" onClick={savePlanFromAnalysis} className="flex-1">
                  <Target className="h-4 w-4 mr-2" /> Save as treatment plan
                </Button>
              )}
              <Button variant="ghost" onClick={generate} disabled={loading} size="sm">
                Regenerate
              </Button>
            </div>
          </motion.div>
        )}

        {activePlan && (
          <div className="mt-6 p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary font-semibold">Active treatment plan</p>
                <p className="font-semibold">{activePlan.title}</p>
                {activePlan.description && <p className="text-xs text-muted-foreground mt-1">{activePlan.description}</p>}
              </div>
              <Badge variant="secondary">{activePlan.goals.length} goals</Badge>
            </div>
            {activePlan.goals.length > 0 && (
              <ul className="text-xs space-y-1 list-disc pl-4">
                {activePlan.goals.slice(0, 5).map((g, i) => (<li key={i}>{g.title}</li>))}
              </ul>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={openMindMateWithPlan}>
                <MessageCircleHeart className="h-3.5 w-3.5 mr-1" /> Adjust with MindMate
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deletePlan(activePlan.id)}>
                Delete plan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Section: React.FC<{ title: string; items?: string[]; tone: 'primary' | 'secondary' | 'warning' | 'success' | 'destructive' }> = ({ title, items, tone }) => {
  if (!items || items.length === 0) return null;
  const colors: Record<string, string> = {
    primary: 'border-primary/20 bg-primary/5',
    secondary: 'border-blue-500/20 bg-blue-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    success: 'border-emerald-500/20 bg-emerald-500/5',
    destructive: 'border-destructive/30 bg-destructive/5',
  };
  return (
    <div className={`p-3 rounded-xl border ${colors[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 opacity-80">{title}</p>
      <ul className="text-sm space-y-1 list-disc pl-4">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
};

export default CBTAnalysis;