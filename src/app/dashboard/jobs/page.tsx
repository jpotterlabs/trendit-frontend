'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { JobList } from '@/components/collection/job-list';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store/dashboard';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  const { jobs, isLoading, loadJobs } = useDashboardStore();

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleRefresh = () => {
    loadJobs();
  };

  const headerActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      <Button asChild>
        <Link href="/dashboard/jobs/new">
          <Plus className="mr-2 h-4 w-4" />
          New Job
        </Link>
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Collection Jobs"
      description="Manage your Reddit data collection jobs"
      headerActions={headerActions}
    >
      <JobList jobs={jobs} isLoading={isLoading} />
    </DashboardLayout>
  );
}