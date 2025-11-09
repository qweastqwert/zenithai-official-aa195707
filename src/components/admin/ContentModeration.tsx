import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, Eye, MessageSquare, FileText, Loader2, AlertTriangle, Search, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { filterContent } from '@/utils/contentFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  title: string;
  description: string;
  created_at: string;
  is_anonymous: boolean;
  user_id: string;
}

interface Comment {
  id: string;
  content: string;
  post_id: string;
  created_at: string;
  is_anonymous: boolean;
  user_id: string;
}

const ContentModeration: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'post' | 'comment', id: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'flagged'>('all');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [postsResult, commentsResult] = await Promise.all([
        supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('community_comments').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      if (postsResult.error) throw postsResult.error;
      if (commentsResult.error) throw commentsResult.error;

      setPosts(postsResult.data || []);
      setComments(commentsResult.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from('community_posts').delete().eq('id', postId);
      if (error) throw error;
      
      toast.success('Post deleted successfully');
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase.from('community_comments').delete().eq('id', commentId);
      if (error) throw error;
      
      toast.success('Comment deleted successfully');
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'post') {
      deletePost(deleteTarget.id);
    } else {
      deleteComment(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const analyzeContent = (content: string) => {
    const result = filterContent(content, 18);
    return result;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterMode === 'flagged') {
      const titleAnalysis = analyzeContent(post.title);
      const descAnalysis = analyzeContent(post.description);
      return matchesSearch && (titleAnalysis.severity !== 'none' || descAnalysis.severity !== 'none');
    }
    
    return matchesSearch;
  });

  const filteredComments = comments.filter(comment => {
    const matchesSearch = searchTerm === '' || 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterMode === 'flagged') {
      const analysis = analyzeContent(comment.content);
      return matchesSearch && analysis.severity !== 'none';
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts and comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as 'all' | 'flagged')}>
              <TabsList>
                <TabsTrigger value="all">All Content</TabsTrigger>
                <TabsTrigger value="flagged" className="gap-2">
                  <Flag className="h-4 w-4" />
                  Flagged Only
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Posts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Community Posts
              </CardTitle>
              <CardDescription>Moderate and manage community posts</CardDescription>
            </div>
            <Badge variant="secondary">{filteredPosts.length} / {posts.length} posts</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No posts found</p>
            ) : (
              filteredPosts.map((post) => {
                const titleAnalysis = analyzeContent(post.title);
                const descAnalysis = analyzeContent(post.description);
                const hasIssues = titleAnalysis.severity !== 'none' || descAnalysis.severity !== 'none';
                
                return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    hasIssues ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted/50 hover:bg-muted/70'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">{post.title}</h4>
                      {hasIssues && <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.description}</p>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.is_anonymous && <Badge variant="outline" className="text-xs">Anonymous</Badge>}
                      {titleAnalysis.severity !== 'none' && (
                        <Badge variant="destructive" className="text-xs">Title: {titleAnalysis.severity}</Badge>
                      )}
                      {descAnalysis.severity !== 'none' && (
                        <Badge variant="destructive" className="text-xs">Content: {descAnalysis.severity}</Badge>
                      )}
                      {titleAnalysis.warnings.length > 0 && (
                        <span className="text-destructive">{titleAnalysis.warnings[0]}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget({ type: 'post', id: post.id })}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Community Comments
              </CardTitle>
              <CardDescription>Moderate and manage user comments</CardDescription>
            </div>
            <Badge variant="secondary">{filteredComments.length} / {comments.length} comments</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredComments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No comments found</p>
            ) : (
              filteredComments.map((comment) => {
                const analysis = analyzeContent(comment.content);
                const hasIssues = analysis.severity !== 'none';
                
                return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    hasIssues ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted/50 hover:bg-muted/70'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {hasIssues && <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />}
                      <p className="text-sm line-clamp-3 flex-1">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                      <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                      {comment.is_anonymous && <Badge variant="outline" className="text-xs">Anonymous</Badge>}
                      {analysis.severity !== 'none' && (
                        <Badge variant="destructive" className="text-xs">{analysis.severity}</Badge>
                      )}
                      {analysis.warnings.length > 0 && (
                        <span className="text-destructive">{analysis.warnings[0]}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget({ type: 'comment', id: comment.id })}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentModeration;
