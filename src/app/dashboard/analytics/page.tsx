'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { useDashboardStore } from '@/lib/store/dashboard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function AnalyticsPage() {
  const {
    jobs,
    selectedJob,
    jobAnalytics,
    isLoading,
    loadJobs,
    loadJobAnalytics,
    selectJob,
  } = useDashboardStore();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    const job = jobs.find(j => j.job_id === jobId);
    if (job) {
      selectJob(job);
    }
  };

  const handleRefresh = () => {
    if (selectedJobId) {
      loadJobAnalytics(selectedJobId);
    }
  };

  const headerActions = (
    <Button 
      variant="outline" 
      onClick={handleRefresh} 
      disabled={!selectedJobId || isLoading}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      Refresh
    </Button>
  );

  return (
    <DashboardLayout
      title="Analytics"
      description="Analyze your Reddit data collection results"
      headerActions={headerActions}
    >
      <AnalyticsDashboard
        jobs={jobs}
        selectedJobId={selectedJobId}
        analytics={jobAnalytics}
        isLoading={isLoading}
        onJobSelect={handleJobSelect}
      />
    </DashboardLayout>
  );
}