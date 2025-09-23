import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useTherapistApplications } from '@/hooks/useTherapistApplications';
import { motion } from 'framer-motion';

interface TherapistApplicationFormProps {
  onCancel: () => void;
}

const TherapistApplicationForm: React.FC<TherapistApplicationFormProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    license_number: '',
    specialization: '',
    experience_years: '',
    education: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createApplication } = useTherapistApplications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.license_number || !formData.specialization || !formData.experience_years || !formData.education) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await createApplication({
        ...formData,
        experience_years: parseInt(formData.experience_years),
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-background/95 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Apply to be a Verified Therapist</CardTitle>
          <p className="text-muted-foreground">
            Help the community by sharing your professional expertise. All applications are reviewed by our admin team.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your professional name"
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number *</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  placeholder="Professional license number"
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Anxiety, Depression, PTSD"
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience_years">Years of Experience *</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  placeholder="Years of practice"
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education & Credentials *</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Degree(s), certifications, and relevant training"
                className="min-h-[100px] transition-all duration-200 focus:scale-[1.02]"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 transition-all duration-200 hover:scale-105"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TherapistApplicationForm;