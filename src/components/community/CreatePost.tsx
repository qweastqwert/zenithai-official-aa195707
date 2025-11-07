import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { validateContentWithToast } from '@/utils/validateContent';
import { motion } from 'framer-motion';

interface CreatePostProps {
  onCancel: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = useCommunityPosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return;
    }

    // Validate title
    const validatedTitle = validateContentWithToast(title.trim(), {
      maxLength: 200,
      fieldName: 'Title',
    });
    if (!validatedTitle) return;

    // Validate description
    const validatedDescription = validateContentWithToast(description.trim(), {
      maxLength: 2000,
      fieldName: 'Description',
    });
    if (!validatedDescription) return;

    setIsSubmitting(true);
    const success = await createPost(validatedTitle, validatedDescription);
    setIsSubmitting(false);

    if (success) {
      setTitle('');
      setDescription('');
      onCancel();
    }
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="bg-background/50 border-border/50"
            />
          </div>
          <div>
            <Textarea
              placeholder="Share your thoughts, ask for advice, or start a discussion..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="bg-background/50 border-border/50 resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !description.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Anonymously'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;