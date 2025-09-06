'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CollectionJobResponse, JobStatus } from '@/lib/types';
import { useDashboardStore } from '@/lib/store/dashboard';
import { formatDistanceToNow } from 'date-fns';
import {
  Eye,
  MoreHorizontal,
  Play,
  Square,
  Trash2,
  Search,
  RefreshCw,
  Filter,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

interface JobListProps {
  jobs: CollectionJobResponse[];
  isLoading?: boolean;
}

export function JobList({ jobs, isLoading = false }: JobListProps) {
  const { refreshJob, cancelJob, deleteJob } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case JobStatus.RUNNING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 animate-pulse';
      case JobStatus.FAILED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case JobStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await cancelJob(jobId);
      toast.success('Job cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel job');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      toast.success('Job deleted successfully');
      setJobToDelete(null);
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleRefreshJob = async (jobId: string) => {
    try {
      await refreshJob(jobId);
      toast.success('Job status refreshed');
    } catch (error) {
      toast.error('Failed to refresh job');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.subreddits.some(sub =>
      sub.toLowerCase().includes(searchQuery.toLowerCase())
    ) || job.job_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">No collection jobs</h3>
              <p className="text-gray-500">Get started by creating your first collection job.</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/jobs/new">
                <Plus className="mr-2 h-4 w-4" />
                Create First Job
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs by subreddit or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter === 'all' ? 'All Status' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                {Object.values(JobStatus).map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.job_id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {job.subreddits.map(sub => `r/${sub}`).join(', ')}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(job.status)}
                    >
                      {job.status}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {job.collected_posts}
                      </div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {job.collected_comments}
                      </div>
                      <div className="text-xs text-gray-500">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {job.post_limit}
                      </div>
                      <div className="text-xs text-gray-500">Target Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700">
                        {formatDistanceToNow(new Date(job.created_at))} ago
                      </div>
                      <div className="text-xs text-gray-500">Created</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(job.status === JobStatus.RUNNING || job.status === JobStatus.PENDING) && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  {/* Error Message */}
                  {job.error_message && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">{job.error_message}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/jobs/${job.job_id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRefreshJob(job.job_id)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Status
                      </DropdownMenuItem>
                      
                      {job.status === JobStatus.RUNNING && (
                        <DropdownMenuItem onClick={() => handleCancelJob(job.job_id)}>
                          <Square className="mr-2 h-4 w-4" />
                          Cancel Job
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setJobToDelete(job.job_id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection Job</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the collection job
              and all its collected data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => jobToDelete && handleDeleteJob(jobToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}