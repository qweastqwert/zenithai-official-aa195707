import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, MessageCircle, UserPlus, Shield } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import TherapistApplicationForm from './TherapistApplicationForm';
import AdminDashboard from '../admin/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';

const CommunitySupport: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showTherapistApplication, setShowTherapistApplication] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { posts, loading, fetchPosts } = useCommunityPosts();
  const { user } = useAuth();
  const { role, isAdmin, isTherapist } = useUserRole();

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
      className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-border/50 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-primary/10 rounded-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Users className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Community Support</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Share experiences, ask for advice, and support each other anonymously
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Button
                      onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                      variant="outline"
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  {user && !isTherapist && role === 'user' && (
                    <Button
                      onClick={() => setShowTherapistApplication(!showTherapistApplication)}
                      variant="outline"
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Apply as Therapist
                    </Button>
                  )}
                  {user && (
                    <Button
                      onClick={() => setShowCreatePost(!showCreatePost)}
                      className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
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

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-border/50 mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
                <Button type="submit" variant="outline" className="transition-all duration-200 hover:scale-105">
                  Search
                </Button>
                {searchTerm && (
                  <Button type="button" variant="ghost" onClick={clearSearch} className="transition-all duration-200 hover:scale-105">
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
          </motion.div>
        )}

        {/* Posts */}
        <motion.div
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
                className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"
              />
              <div className="text-muted-foreground">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                        className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
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
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
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