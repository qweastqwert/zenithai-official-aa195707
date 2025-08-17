
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BreathingFAB: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/breathing-exercises');
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        onClick={handleClick}
        size="lg"
        className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wind className="h-6 w-6 text-white" />
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default BreathingFAB;
