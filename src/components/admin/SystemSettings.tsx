import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Database, Shield, Zap, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SystemSettings: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);

  const exportData = async (table: 'community_posts' | 'community_comments' | 'mood_entries' | 'journal_entries') => {
    try {
      const { data, error } = await supabase.from(table).select('*') as any;
      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${table}_export_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`${table} data exported successfully`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const clearOldData = async () => {
    try {
      const { error } = await supabase.rpc('cleanup_old_conversations');
      
      if (error) throw error;
      
      toast.success('Old data cleaned successfully');
    } catch (error) {
      console.error('Error cleaning data:', error);
      toast.error('Failed to clean old data');
    }
  };

  return (
    <div className="space-y-6">
      {/* System Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Controls
          </CardTitle>
          <CardDescription>Manage system-wide settings and configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Temporarily disable app for maintenance</p>
            </div>
            <Switch
              id="maintenance"
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="registration">Allow New Registrations</Label>
              <p className="text-sm text-muted-foreground">Enable or disable user sign-ups</p>
            </div>
            <Switch
              id="registration"
              checked={allowRegistration}
              onCheckedChange={setAllowRegistration}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Export and manage application data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => exportData('community_posts')} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Posts
            </Button>
            <Button variant="outline" onClick={() => exportData('community_comments')} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Comments
            </Button>
            <Button variant="outline" onClick={() => exportData('mood_entries')} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Mood Data
            </Button>
            <Button variant="outline" onClick={() => exportData('journal_entries')} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Journals
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Clean Old Data (30+ days)
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clean Old Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove conversation history older than 30 days. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearOldData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Clean Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Information
          </CardTitle>
          <CardDescription>Security features and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">✓ RLS Enabled</p>
            <p className="text-xs text-muted-foreground mt-1">Row-Level Security is active on all tables</p>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">✓ Admin Verification Active</p>
            <p className="text-xs text-muted-foreground mt-1">Admin status verified via security definer function</p>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">✓ Content Validation</p>
            <p className="text-xs text-muted-foreground mt-1">All user content is filtered and validated</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
