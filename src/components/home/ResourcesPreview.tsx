import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { resources } from '@/data/resources';
import ResourceCard from '@/components/ResourceCard';

const ResourcesPreview: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-muted/20 dark:bg-muted/5 reveal-on-scroll">
      <div className="container mx-auto px-4">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.slice(0, 3).map((resource, index) => (
            <div key={resource.id} className="reveal-on-scroll" style={{ animationDelay: `${index * 0.15}s` }}>
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesPreview;
