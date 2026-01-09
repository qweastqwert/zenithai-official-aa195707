
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<boolean>(false);

  const steps = [
    {
      text: "Welcome to Zenith AI",
      colors: "from-white via-purple-50 to-yellow-50",
      textColor: "text-gray-800",
      bgColor: "bg-gradient-to-br from-white via-purple-50 to-yellow-50",
      typingSpeed: 80,
      pauseTime: 3000,
      deleteSpeed: 0
    }
  ];

  useEffect(() => {
    if (animationRef.current || isComplete) return;
    
    animationRef.current = true;
    let isMounted = true;
    
    const runAnimation = async () => {
      for (let stepIndex = 0; stepIndex < steps.length && isMounted; stepIndex++) {
        const step = steps[stepIndex];
        
        // Update step first
        setCurrentStep(stepIndex);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!isMounted) return;
        
        // Clear text and start typing
        setCurrentText('');
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Type the text
        for (let i = 0; i <= step.text.length && isMounted; i++) {
          setCurrentText(step.text.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, step.typingSpeed));
        }
        
        if (!isMounted) return;
        
        setIsTyping(false);
        
        // Pause to let user read
        await new Promise(resolve => setTimeout(resolve, step.pauseTime));
        
        if (!isMounted) return;
        
        // Delete the text (except for the last step)
        if (stepIndex < steps.length - 1 && step.deleteSpeed > 0) {
          for (let i = step.text.length; i >= 0 && isMounted; i--) {
            setCurrentText(step.text.slice(0, i));
            await new Promise(resolve => setTimeout(resolve, step.deleteSpeed));
          }
        }
      }
      
      // Complete the animation
      if (isMounted) {
        setIsComplete(true);
        setTimeout(() => {
          if (isMounted) {
            onComplete();
          }
        }, 1000);
      }
    };

    runAnimation();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-1000 ease-in-out ${currentStepData.bgColor}`}>
      <div className="text-center px-4 sm:px-8 max-w-4xl w-full">
        <motion.div
          key={`step-${currentStep}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h1 className={`text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ease-in-out ${currentStepData.textColor} px-4`}>
            {currentText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block ml-2"
              >
                |
              </motion.span>
            )}
          </h1>
          
          {/* Atmospheric effects */}
          <div className="absolute inset-0 pointer-events-none">
            {currentStep === 0 && (
              <>
                <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-200/30 rounded-full blur-3xl animate-pulse transition-all duration-1000"></div>
                <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-purple-200/25 rounded-full blur-3xl animate-pulse transition-all duration-1000" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-3/4 left-3/4 w-48 sm:w-64 h-48 sm:h-64 bg-white/20 rounded-full blur-2xl animate-pulse transition-all duration-1000" style={{ animationDelay: '1s' }}></div>
              </>
            )}
          </div>
          
          {/* Zenith AI logo appears in final step */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8 sm:mt-12"
            >
              <img 
                src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png"
                alt="Zenith AI Logo"
                className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 drop-shadow-2xl"
              />
              <p className="text-lg sm:text-xl text-gray-600 font-light px-4">
                Your journey to mental wellness begins now
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default IntroAnimation;
