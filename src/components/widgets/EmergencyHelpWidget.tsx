import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Phone, X, AlertCircle } from 'lucide-react';

interface EmergencyHelpWidgetProps {
  country?: string;
  onDismiss?: () => void;
}

const emergencyNumbers: Record<string, { number: string; name: string }> = {
  US: { number: '988', name: '988 Suicide & Crisis Lifeline' },
  UK: { number: '116123', name: 'Samaritans' },
  CA: { number: '988', name: 'Suicide Crisis Helpline' },
  AU: { number: '131114', name: 'Lifeline Australia' },
  IN: { number: '9152987821', name: 'AASRA' },
  default: { number: '911', name: 'Emergency Services' }
};

const EmergencyHelpWidget: React.FC<EmergencyHelpWidgetProps> = ({ 
  country = 'default',
  onDismiss 
}) => {
  const helpline = emergencyNumbers[country] || emergencyNumbers.default;

  const handleCall = () => {
    window.location.href = `tel:${helpline.number}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-2 border-red-300 dark:border-red-700 shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold text-red-900 dark:text-red-100">Emergency Support</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onDismiss} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              If you're in crisis or having thoughts of self-harm, please reach out to professional help immediately.
            </p>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Helpline</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{helpline.name}</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{helpline.number}</p>
            </div>

            <Button
              onClick={handleCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>

            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              You can continue chatting with me, but please consider reaching out for professional support.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmergencyHelpWidget;
