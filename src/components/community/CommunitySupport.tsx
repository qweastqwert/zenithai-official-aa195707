import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, MessageCircle, UserPlus, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import TherapistApplicationForm from './TherapistApplicationForm';
import AdminDashboard from '../admin/AdminDashboard';
import TrendingPosts from './TrendingPosts';
import { motion, AnimatePresence } from 'framer-motion';

const CommunitySupport: React.FC = () => {
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showTherapistApplication, setShowTherapistApplication] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { posts, loading, fetchPosts } = useCommunityPosts();
  const { user } = useAuth();
  const { role, isAdmin, isTherapist } = useUserRole();
  const postsRef = useRef<HTMLDivElement>(null);

  const scrollToPost = (postId: string) => {
    const postElement = document.getElementById(`post-${postId}`);
    if (postElement) {
      postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      postElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      setTimeout(() => {
        postElement.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 2000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchPosts();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Mobile-optimized sticky header */}
      <div className="sticky top-0 z-20 bg-primary text-primary-foreground p-3 sm:p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/chat')}
          className="p-1.5 text-primary-foreground hover:bg-primary-foreground/10 flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">Community</h1>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isAdmin && (
            <Button
              onClick={() => setShowAdminDashboard(!showAdminDashboard)}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 p-1.5"
            >
              <Shield className="h-4 w-4" />
            </Button>
          )}
          {user && (
            <Button
              onClick={() => setShowCreatePost(!showCreatePost)}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 p-1.5"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 space-y-3">
        {/* Trending Posts */}
        <TrendingPosts onPostClick={scrollToPost} />

        {/* Search */}
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/20 focus:border-primary/50 h-9 text-sm"
                />
              </div>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-9">
                Search
              </Button>
              {searchTerm && (
                <Button type="button" variant="ghost" size="sm" onClick={clearSearch} className="h-9">
                  Clear
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Therapist Application */}
        {user && !isTherapist && role === 'user' && (
          <Button
            onClick={() => setShowTherapistApplication(!showTherapistApplication)}
            variant="outline"
            size="sm"
            className="w-full border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            <UserPlus className="h-4 w-4 mr-2 text-primary" />
            Apply as Professional
          </Button>
        )}

        {/* Admin Dashboard */}
        <AnimatePresence>
          {showAdminDashboard && isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Therapist Application Form */}
        <AnimatePresence>
          {showTherapistApplication && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TherapistApplicationForm onCancel={() => setShowTherapistApplication(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Post Form */}
        <AnimatePresence>
          {showCreatePost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CreatePost onCancel={() => setShowCreatePost(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Warning */}
        {!user && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="text-center">
                <MessageCircle className="h-6 w-6 text-primary/60 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Please log in to create posts, comment, and vote
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts */}
        <div ref={postsRef} className="space-y-3 pb-6">
          {loading ? (
            <div className="text-center py-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"
              />
              <div className="text-muted-foreground text-sm">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <Card className="bg-card/80 border-primary/20">
              <CardContent className="py-8">
                <div className="text-center">
                  <Users className="h-10 w-10 text-primary/40 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {searchTerm ? 'No posts found' : 'No posts yet'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Be the first to start a conversation'
                    }
                  </p>
                  {!searchTerm && user && (
                    <Button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                id={`post-${post.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="transition-all duration-300"
              >
                <PostCard post={post} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommunitySupport;
