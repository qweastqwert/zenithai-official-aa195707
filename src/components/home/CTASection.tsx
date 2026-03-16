import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import SplineScene from './SplineScene';

const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-primary/95 via-purple-700 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <SplineScene variant="cta" className="w-full h-full" />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center mb-6 premium-glow"
            >
              <img 
                src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png"
                alt="Zenith AI Logo"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
            </motion.div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white font-playfair leading-tight">
            The best time to start
            <br />
            was yesterday.
            <br />
            <span className="text-white/70 text-2xl sm:text-3xl">The second best is now.</span>
          </h2>
          
          <p className="text-base sm:text-lg mb-10 text-white/60 leading-relaxed font-light max-w-lg mx-auto">
            Your mind doesn't need fixing — it needs understanding.
            Let Zenith be your mirror, your guide, your quiet companion.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button 
              asChild 
              className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg font-semibold px-10 sm:px-14 py-5 sm:py-6 shadow-2xl w-full sm:w-auto min-h-[52px] transition-all duration-300"
            >
              <Link to="/chat">
                <Crown className="mr-2 h-5 w-5" />
                Start for Free
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
