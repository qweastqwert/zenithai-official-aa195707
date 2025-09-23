import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Users, UserCheck, Settings } from 'lucide-react';
import { useTherapistApplications } from '@/hooks/useTherapistApplications';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { applications, loading, updateApplicationStatus } = useTherapistApplications();
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');

  const handleStatusUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingId(applicationId);
      await updateApplicationStatus(applicationId, status, reviewNotes);
      toast.success(`Application ${status} successfully`);
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (error) {
      toast.error(`Failed to ${status} application`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved Therapists</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-background/80 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Applications Management */}
      <Card className="bg-background/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Therapist Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed ({reviewedApplications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending applications
                </div>
              ) : (
                pendingApplications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-background/60 border-border/30">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{application.full_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                License: {application.license_number}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Specialization</p>
                              <p className="text-muted-foreground">{application.specialization}</p>
                            </div>
                            <div>
                              <p className="font-medium">Experience</p>
                              <p className="text-muted-foreground">{application.experience_years} years</p>
                            </div>
                            <div>
                              <p className="font-medium">Applied</p>
                              <p className="text-muted-foreground">
                                {new Date(application.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-sm mb-2">Education & Credentials</p>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                              {application.education}
                            </p>
                          </div>

                          {selectedApplication === application.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3 border-t pt-4"
                            >
                              <div>
                                <label className="block text-sm font-medium mb-2">Review Notes</label>
                                <Textarea
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Add any notes about this application..."
                                  className="min-h-[80px]"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleStatusUpdate(application.id, 'approved')}
                                  disabled={processingId === application.id}
                                  className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                  disabled={processingId === application.id}
                                  variant="destructive"
                                  className="transition-all duration-200 hover:scale-105"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => setSelectedApplication(null)}
                                  variant="outline"
                                  className="transition-all duration-200 hover:scale-105"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </motion.div>
                          )}

                          {selectedApplication !== application.id && (
                            <Button
                              onClick={() => setSelectedApplication(application.id)}
                              variant="outline"
                              className="w-full transition-all duration-200 hover:scale-105"
                            >
                              Review Application
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-4">
              {reviewedApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reviewed applications
                </div>
              ) : (
                reviewedApplications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-background/60 border-border/30">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{application.full_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Reviewed on {new Date(application.reviewed_at!).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={application.status === 'approved' ? 'default' : 'destructive'}
                            className={
                              application.status === 'approved'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : ''
                            }
                          >
                            {application.status === 'approved' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        {application.notes && (
                          <div className="mt-3">
                            <p className="text-sm font-medium">Review Notes:</p>
                            <p className="text-sm text-muted-foreground mt-1">{application.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminDashboard;