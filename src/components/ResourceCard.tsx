import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ThumbsUp, BookOpen, ArrowRight } from 'lucide-react';
import { Resource } from '@/data/resources';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <Card className="bg-card border-border hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={resource.image}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground capitalize text-xs">
          {resource.category}
        </Badge>
      </div>
      
      <CardContent className="p-3 sm:p-4">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{resource.readTime}</span>
          </div>
          <span className="text-border">•</span>
          <span className="truncate">{resource.author}</span>
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-foreground mb-1.5 line-clamp-2 text-sm sm:text-base leading-snug">
          {resource.title}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">
          {resource.description}
        </p>
        
        {/* Tags - Only on larger screens */}
        <div className="hidden sm:flex flex-wrap gap-1 mb-3">
          {resource.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-border/50">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs sm:text-sm gap-1 text-primary hover:text-primary"
          >
            <Link to={`/article/${resource.id}`}>
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Read</span>
              <ArrowRight className="h-3 w-3 sm:hidden" />
            </Link>
          </Button>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
            <span>{resource.helpful}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
