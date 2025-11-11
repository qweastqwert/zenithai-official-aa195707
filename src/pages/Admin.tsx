import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Shield, Users, FileCheck, BarChart3, MessageSquare, Activity, Settings as SettingsIcon, Flag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import AdminStats from '@/components/admin/AdminStats';
import ContentModeration from '@/components/admin/ContentModeration';
import ActivityLogs from '@/components/admin/ActivityLogs';
import SystemSettings from '@/components/admin/SystemSettings';
import SecurityTips from '@/components/admin/SecurityTips';
import ReportsManagement from '@/components/admin/ReportsManagement';
import { motion } from 'framer-motion';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { role, loading, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      navigate('/');
      return;
    }

    // Verify admin status from database
    if (!loading) {
      if (!isAdmin) {
        // Not an admin, redirect away
        navigate('/');
      } else {
        setVerifying(false);
      }
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Control Panel</h1>
            <p className="text-muted-foreground">Manage users, therapists, and system settings</p>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="therapists" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Therapists</span>
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <AdminStats />
            <ActivityLogs />
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="therapists" className="space-y-4 mt-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4 mt-6">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 mt-6">
            <ReportsManagement />
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-6">
            <SecurityTips />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 mt-6">
            <ActivityLogs />
          </TabsContent>

          <TabsContent value="system" className="space-y-4 mt-6">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Admin;
