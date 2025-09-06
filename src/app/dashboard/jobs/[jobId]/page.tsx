'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  ArrowLeft,
  Play,
  Square,
  Trash2,
  Download,
  RefreshCw,
  Clock,
  Database,
  MessageSquare,
  Users,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { CollectionJobResponse, JobStatus } from '@/lib/types';
import { format } from 'date-fns';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [job, setJob] = useState<CollectionJobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      loadJob();
      
      // Auto-refresh for running jobs (reduced frequency to avoid rate limits)
      const interval = setInterval(() => {
        if (job?.status === JobStatus.RUNNING || job?.status === JobStatus.PENDING) {
          loadJob();
        }
      }, 15000); // Increased from 5s to 15s to reduce API calls
      
      return () => clearInterval(interval);
    }
  }, [jobId, job?.status]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const jobData = await api.getJob(jobId);
      setJob(jobData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load job:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'cancel' | 'delete') => {
    if (!job) return;
    
    try {
      setActionLoading(action);
      
      if (action === 'cancel') {
        await api.cancelJob(job.job_id);
      } else if (action === 'delete') {
        await api.deleteJob(job.job_id);
        router.push('/dashboard/jobs');
        return;
      }
      
      // Reload job data
      await loadJob();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || `Failed to ${action} job`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case JobStatus.RUNNING:
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case JobStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case JobStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case JobStatus.CANCELLED:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case JobStatus.RUNNING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case JobStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case JobStatus.FAILED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case JobStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Job Details" description="Collection job details and progress">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !job) {
    return (
      <DashboardLayout title="Job Details" description="Collection job details and progress">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push('/dashboard/jobs')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout title="Job Details" description="Collection job details and progress">
        <div className="text-center py-12">
          <p className="text-gray-500">Job not found</p>
          <Button onClick={() => router.push('/dashboard/jobs')} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={`Job #${job.id}`}
      description="Collection job details and progress"
      headerActions={
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push('/dashboard/jobs')} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={loadJob} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      }
    >
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Status Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  Job #{job.id}
                </CardTitle>
                <CardDescription>
                  Created {format(new Date(job.created_at), 'MMM d, yyyy \'at\' h:mm a')}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(job.status)}>
                {job.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Progress */}
            {job.status === JobStatus.RUNNING && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {job.collected_posts + job.collected_comments} / {job.total_expected} items collected
                </p>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{job.collected_posts}</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">{job.collected_comments}</p>
                  <p className="text-xs text-gray-500">Comments</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">{job.subreddits.length}</p>
                  <p className="text-xs text-gray-500">Subreddits</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">{job.post_limit}</p>
                  <p className="text-xs text-gray-500">Post Limit</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {job.status === JobStatus.FAILED && job.error_message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{job.error_message}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {job.status === JobStatus.RUNNING && (
                <Button
                  onClick={() => handleAction('cancel')}
                  disabled={actionLoading === 'cancel'}
                  variant="outline"
                  size="sm"
                >
                  {actionLoading === 'cancel' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Square className="mr-2 h-4 w-4" />
                  )}
                  Cancel Job
                </Button>
              )}
              
              {job.status === JobStatus.COMPLETED && (
                <Button
                  onClick={() => router.push(`/dashboard/analytics?job=${job.job_id}`)}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              )}
              
              {(job.status === JobStatus.COMPLETED || job.status === JobStatus.FAILED || job.status === JobStatus.CANCELLED) && (
                <Button
                  onClick={() => handleAction('delete')}
                  disabled={actionLoading === 'delete'}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  {actionLoading === 'delete' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Job
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Job parameters and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Subreddits</h4>
                <div className="flex flex-wrap gap-2">
                  {job.subreddits.map((subreddit) => (
                    <Badge key={subreddit} variant="outline">
                      r/{subreddit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Post Limit:</span>
                  <p>{job.post_limit}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Job ID:</span>
                  <p className="font-mono text-xs">{job.job_id}</p>
                </div>
                
                {job.started_at && (
                  <div>
                    <span className="font-medium text-gray-700">Started:</span>
                    <p>{format(new Date(job.started_at), 'MMM d, h:mm a')}</p>
                  </div>
                )}
                
                {job.completed_at && (
                  <div>
                    <span className="font-medium text-gray-700">Completed:</span>
                    <p>{format(new Date(job.completed_at), 'MMM d, h:mm a')}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Job execution timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Job Created</p>
                  <p className="text-xs text-gray-500">{format(new Date(job.created_at), 'MMM d, yyyy \'at\' h:mm:ss a')}</p>
                </div>
              </div>
              
              {job.started_at && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Job Started</p>
                    <p className="text-xs text-gray-500">{format(new Date(job.started_at), 'MMM d, yyyy \'at\' h:mm:ss a')}</p>
                  </div>
                </div>
              )}
              
              {job.completed_at && (
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${job.status === JobStatus.COMPLETED ? 'bg-green-500' : job.status === JobStatus.FAILED ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                  <div>
                    <p className="font-medium text-sm">Job {job.status === JobStatus.COMPLETED ? 'Completed' : job.status === JobStatus.FAILED ? 'Failed' : 'Ended'}</p>
                    <p className="text-xs text-gray-500">{format(new Date(job.completed_at), 'MMM d, yyyy \'at\' h:mm:ss a')}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}