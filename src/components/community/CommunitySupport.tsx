import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, MessageCircle } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useAuth } from '@/hooks/useAuth';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const CommunitySupport: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { posts, loading, fetchPosts } = useCommunityPosts();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="bg-background/80 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">Community Support</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Share experiences, ask for advice, and support each other anonymously
                  </p>
                </div>
              </div>
              {user && (
                <Button
                  onClick={() => setShowCreatePost(!showCreatePost)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Search */}
        <Card className="bg-background/80 backdrop-blur-sm border-border/50 mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
              {searchTerm && (
                <Button type="button" variant="ghost" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Create Post Form */}
        {showCreatePost && (
          <div className="mb-6">
            <CreatePost onCancel={() => setShowCreatePost(false)} />
          </div>
        )}

        {/* Auth Warning */}
        {!user && (
          <Card className="bg-muted/50 border-border/50 mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Please log in to create posts and comment
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <Card className="bg-background/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchTerm ? 'No posts found' : 'No posts yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Be the first to start a conversation in the community'
                    }
                  </p>
                  {!searchTerm && user && (
                    <Button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySupport;