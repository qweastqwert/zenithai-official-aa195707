
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target, Sparkles, ArrowRight } from 'lucide-react';

interface TransformationChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: (prompt: string) => void;
}

const TransformationChallenge: React.FC<TransformationChallengeProps> = ({
  isOpen,
  onClose,
  onStartChallenge
}) => {
  const [goal, setGoal] = useState('');

  const handleTransform = () => {
    if (!goal.trim()) return;
    
    const transformationPrompt = `Hello MindMate! I'm participating in the Men's Mental Health Month Transformation Challenge. Here's my personal goal: "${goal}"

I would like you to help me create a comprehensive, actionable plan to achieve this goal while focusing on my mental wellness. Please provide:

1. A structured roadmap with specific, measurable steps
2. Mental health strategies that support this goal
3. Ways to overcome common obstacles men face when pursuing personal growth
4. Daily practices I can implement immediately
5. How to track my progress and maintain motivation
6. Resources for continued support

Please make this plan practical, encouraging, and specifically tailored to help me break through any mental barriers that might be holding me back. Remember, seeking help and working on self-improvement is a sign of strength, not weakness.`;

    onStartChallenge(transformationPrompt);
    onClose();
    setGoal('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            MindMate's Transformation Challenge
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Your Personal Transformation Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Every journey of growth begins with a single step. Share your goal with MindMate and receive a personalized roadmap designed specifically to support your mental wellness journey.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-sm font-medium">
                What would you like to achieve or improve in your life?
              </Label>
              <Textarea
                id="goal"
                placeholder="E.g., 'I want to build better confidence in social situations', 'I want to develop a healthier work-life balance', 'I want to manage my stress better'..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Remember:</strong> This is a safe space. Your goal can be anything that matters to your mental wellness - from building confidence to managing emotions, improving relationships, or pursuing personal growth.
              </p>
            </div>
            
            <Button
              onClick={handleTransform}
              disabled={!goal.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Transform Me!
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default TransformationChallenge;
