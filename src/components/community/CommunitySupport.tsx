import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, MessageCircle, UserPlus, Shield, Sparkles } from 'lucide-react';
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
      postElement.classList.add('ring-2', 'ring-[#7950f2]', 'ring-offset-2');
      setTimeout(() => {
        postElement.classList.remove('ring-2', 'ring-[#7950f2]', 'ring-offset-2');
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
      className="min-h-screen bg-gradient-to-br from-[hsl(var(--zenith-purple))/5] via-background to-[hsl(var(--zenith-primary))/10] p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-[#7950f2]/10 to-[#b197fc]/10 backdrop-blur-sm border-[#7950f2]/30 mb-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7950f2]/5 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-[#7950f2] to-[#b197fc] rounded-xl shadow-lg shadow-[#7950f2]/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Users className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                      Community Support
                      <Sparkles className="h-5 w-5 text-[#7950f2]" />
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Share experiences, ask for advice, and support each other
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {isAdmin && (
                    <Button
                      onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                      variant="outline"
                      className="border-[#7950f2]/30 hover:border-[#7950f2] hover:bg-[#7950f2]/10 transition-all duration-200 hover:scale-105"
                    >
                      <Shield className="h-4 w-4 mr-2 text-[#7950f2]" />
                      Admin
                    </Button>
                  )}
                  {user && !isTherapist && role === 'user' && (
                    <Button
                      onClick={() => setShowTherapistApplication(!showTherapistApplication)}
                      variant="outline"
                      className="border-[#7950f2]/30 hover:border-[#7950f2] hover:bg-[#7950f2]/10 transition-all duration-200 hover:scale-105"
                    >
                      <UserPlus className="h-4 w-4 mr-2 text-[#7950f2]" />
                      Apply as Therapist
                    </Button>
                  )}
                  {user && (
                    <Button
                      onClick={() => setShowCreatePost(!showCreatePost)}
                      className="bg-gradient-to-r from-[#7950f2] to-[#b197fc] hover:from-[#6741d9] hover:to-[#9775fa] text-white shadow-lg shadow-[#7950f2]/30 transition-all duration-200 hover:scale-105"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Trending Posts */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <TrendingPosts onPostClick={scrollToPost} />
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border-[#7950f2]/20 mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7950f2]/60 h-4 w-4" />
                  <Input
                    placeholder="Search posts by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-[#7950f2]/20 focus:border-[#7950f2]/50 transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="outline" 
                  className="border-[#7950f2]/30 hover:border-[#7950f2] hover:bg-[#7950f2]/10 transition-all duration-200 hover:scale-105"
                >
                  Search
                </Button>
                {searchTerm && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={clearSearch} 
                    className="hover:bg-[#7950f2]/10 transition-all duration-200 hover:scale-105"
                  >
                    Clear
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Dashboard */}
        <AnimatePresence>
          {showAdminDashboard && isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
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
              className="mb-6"
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
              className="mb-6"
            >
              <CreatePost onCancel={() => setShowCreatePost(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Warning */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-[#7950f2]/5 border-[#7950f2]/20 mb-6">
              <CardContent className="pt-6">
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 text-[#7950f2]/60 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Please log in to create posts, comment, and vote
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Posts */}
        <motion.div
          ref={postsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-6"
        >
          {loading ? (
            <div className="text-center py-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block w-8 h-8 border-4 border-[#7950f2] border-t-transparent rounded-full mb-4"
              />
              <div className="text-muted-foreground">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-[#7950f2]/20">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Users className="h-12 w-12 text-[#7950f2]/40 mx-auto mb-4" />
                    </motion.div>
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
                        className="bg-gradient-to-r from-[#7950f2] to-[#b197fc] hover:from-[#6741d9] hover:to-[#9775fa] text-white shadow-lg shadow-[#7950f2]/30 transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  id={`post-${post.id}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="transition-all duration-300"
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommunitySupport;
