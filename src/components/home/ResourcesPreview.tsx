import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { resources } from '@/data/resources';
import ResourceCard from '@/components/ResourceCard';
import AnimatedSection, { staggerContainer, staggerItem } from './AnimatedSection';

const ResourcesPreview: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-muted/20 dark:bg-muted/5">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-2 block">Curated Collection</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair">Read. Reflect. Rise.</h2>
            </div>
            <Link 
              to="/resources" 
              className="text-primary hover:text-primary/80 font-medium text-sm transition-colors flex items-center gap-2 group"
            >
              Browse all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimatedSection>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resources.slice(0, 3).map((resource) => (
            <motion.div key={resource.id} variants={staggerItem}>
              <ResourceCard resource={resource} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ResourcesPreview;
