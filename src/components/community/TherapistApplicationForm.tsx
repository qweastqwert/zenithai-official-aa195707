import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTherapistApplications } from '@/hooks/useTherapistApplications';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Stethoscope, Brain, GraduationCap, Briefcase } from 'lucide-react';

interface TherapistApplicationFormProps {
  onCancel: () => void;
}

const ROLE_OPTIONS = [
  { value: 'therapist', label: 'Therapist', icon: Stethoscope, description: 'Licensed mental health therapist (LMFT, LCSW, LPC, etc.)' },
  { value: 'psychologist', label: 'Psychologist', icon: Brain, description: 'Licensed psychologist (PhD, PsyD, EdD in Psychology)' },
];

const SPECIALIZATIONS = [
  'Anxiety & Stress', 'Depression', 'PTSD & Trauma', 'Relationship Issues',
  'Grief & Loss', 'Addiction & Recovery', 'Eating Disorders', 'OCD',
  'ADHD', 'Child & Adolescent', 'Family Therapy', 'Cognitive Behavioral Therapy',
  'Mindfulness-Based Therapy', 'Art / Music Therapy', 'Other',
];

const TherapistApplicationForm: React.FC<TherapistApplicationFormProps> = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role_type: '',
    full_name: '',
    license_number: '',
    specialization: '',
    experience_years: '',
    education: '',
    approach: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createApplication } = useTherapistApplications();

  const totalSteps = 3;

  const isStepValid = (s: number) => {
    if (s === 1) return !!formData.role_type && !!formData.full_name;
    if (s === 2) return !!formData.license_number && !!formData.specialization && !!formData.experience_years;
    if (s === 3) return !!formData.education;
    return false;
  };

  const handleSubmit = async () => {
    if (!isStepValid(3)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await createApplication({
        full_name: formData.full_name,
        license_number: formData.license_number,
        specialization: `[${formData.role_type.toUpperCase()}] ${formData.specialization}`,
        experience_years: parseInt(formData.experience_years),
        education: formData.education + (formData.approach ? `\n\nTherapeutic Approach: ${formData.approach}` : ''),
      });

      toast.success('Application submitted successfully! You will be notified once reviewed.');
      onCancel();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step === s
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : step > s
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
            animate={{ scale: step === s ? 1.1 : 1 }}
          >
            {step > s ? <CheckCircle className="h-4 w-4" /> : s}
          </motion.div>
          {s < totalSteps && <div className={`w-10 h-0.5 ${step > s ? 'bg-green-500' : 'bg-muted'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Card className="bg-background/95 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Apply as a Verified Professional</CardTitle>
          <p className="text-muted-foreground text-sm">
            Help the community with your expertise. All applications are reviewed by our admin team.
          </p>
          {stepIndicator}
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {/* Step 1: Role & Identity */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" /> Select your professional role *
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROLE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const selected = formData.role_type === opt.value;
                      return (
                        <motion.div
                          key={opt.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, role_type: opt.value })}
                          className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                            selected ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' : 'border-border hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className={`h-6 w-6 ${selected ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-semibold">{opt.label}</span>
                            {selected && <Badge className="ml-auto bg-primary/20 text-primary text-xs">Selected</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{opt.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Professional Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Dr. Jane Doe"
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Credentials */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="license_number" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" /> License / Registration Number *
                  </Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    placeholder="e.g., PSY-12345 or LCSW-67890"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Primary Specialization *</Label>
                  <Select value={formData.specialization} onValueChange={(v) => setFormData({ ...formData, specialization: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose your specialization" /></SelectTrigger>
                    <SelectContent>
                      {SPECIALIZATIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience *</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    max="60"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    placeholder="e.g., 5"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Education & Approach */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="education">Education & Credentials *</Label>
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Degree(s), certifications, university, and relevant training..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approach">Therapeutic Approach (optional)</Label>
                  <Textarea
                    id="approach"
                    value={formData.approach}
                    onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                    placeholder="Briefly describe your therapeutic philosophy and methods..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Review summary */}
                <Card className="bg-muted/50 border-primary/20">
                  <CardContent className="pt-4 space-y-1 text-sm">
                    <p className="font-semibold text-primary mb-2">Application Summary</p>
                    <p><span className="text-muted-foreground">Role:</span> {formData.role_type === 'psychologist' ? 'Psychologist' : 'Therapist'}</p>
                    <p><span className="text-muted-foreground">Name:</span> {formData.full_name}</p>
                    <p><span className="text-muted-foreground">License:</span> {formData.license_number}</p>
                    <p><span className="text-muted-foreground">Specialization:</span> {formData.specialization}</p>
                    <p><span className="text-muted-foreground">Experience:</span> {formData.experience_years} years</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 pt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
            )}

            {step < totalSteps ? (
              <Button disabled={!isStepValid(step)} onClick={() => setStep(step + 1)} className="flex-1 bg-primary hover:bg-primary/90">
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button disabled={isSubmitting || !isStepValid(step)} onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TherapistApplicationForm;
