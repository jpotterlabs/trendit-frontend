'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CollectionJobResponse, JobStatus } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Eye, MoreHorizontal, Database } from 'lucide-react';
import Link from 'next/link';

interface RecentJobsProps {
  jobs: CollectionJobResponse[];
  isLoading?: boolean;
}

export function RecentJobs({ jobs, isLoading = false }: RecentJobsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Collection Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case JobStatus.RUNNING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case JobStatus.FAILED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case JobStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    }
  };

  const recentJobs = jobs.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Collection Jobs</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/jobs">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentJobs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No collection jobs yet</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/jobs">Create First Job</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job.job_id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {job.subreddits.join(', ')}
                        </p>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(job.status)}
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                        <span>{job.collected_posts} posts</span>
                        <span>{job.collected_comments} comments</span>
                        <span>
                          {formatDistanceToNow(new Date(job.created_at))} ago
                        </span>
                      </div>
                      {(job.status === JobStatus.RUNNING || job.status === JobStatus.PENDING) && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/jobs/${job.job_id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}