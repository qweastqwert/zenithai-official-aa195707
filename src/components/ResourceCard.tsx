
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ThumbsUp, ThumbsDown, BookOpen, User, Calendar } from 'lucide-react';
import { Resource } from '@/data/resources';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={resource.image}
          alt={resource.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className="absolute top-3 left-3 bg-zenith-purple text-white capitalize">
          {resource.category}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Clock className="h-4 w-4" />
          <span>{resource.readTime}</span>
          <User className="h-4 w-4 ml-2" />
          <span>{resource.author}</span>
          <Calendar className="h-4 w-4 ml-2" />
          <span>{new Date(resource.publishedAt).toLocaleDateString()}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {resource.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {resource.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Link to={`/article/${resource.id}`}>
              <BookOpen className="h-4 w-4" />
              Read Article
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span>{resource.helpful}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4 text-red-500" />
              <span>{resource.notHelpful}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
