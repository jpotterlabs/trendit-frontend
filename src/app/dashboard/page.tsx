'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { StatsCards } from '@/components/dashboard/overview/stats-cards';
import { RecentJobs } from '@/components/dashboard/overview/recent-jobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStore } from '@/lib/store/dashboard';
import { useAuthStore } from '@/lib/store/auth';
import { Plus, BarChart3, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, subscription } = useAuthStore();
  const {
    jobs,
    dataSummary,
    isLoading,
    loadJobs,
    loadDataSummary,
  } = useDashboardStore();

  useEffect(() => {
    loadJobs();
    loadDataSummary();
  }, [loadJobs, loadDataSummary]);

  const headerActions = (
    <Button asChild>
      <Link href="/dashboard/jobs/new">
        <Plus className="mr-2 h-4 w-4" />
        New Collection Job
      </Link>
    </Button>
  );

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.username || 'there'}!`}
      description="Monitor your Reddit data collection and analytics"
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards
          dataSummary={dataSummary}
          jobs={jobs}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Jobs - Takes up 2/3 on large screens */}
          <div className="lg:col-span-2">
            <RecentJobs jobs={jobs} isLoading={isLoading} />
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/jobs/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection Job
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/export">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle>Usage Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Calls</span>
                      <span>
                        {subscription.current_usage.api_calls || 0} / {subscription.limits.api_calls || 0}
                      </span>
                    </div>
                    <Progress 
                      value={subscription.usage_percentage.api_calls || 0} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exports</span>
                      <span>
                        {subscription.current_usage.exports || 0} / {subscription.limits.exports || 0}
                      </span>
                    </div>
                    <Progress 
                      value={subscription.usage_percentage.exports || 0} 
                      className="h-2"
                    />
                  </div>

                  <div className="pt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/dashboard/billing">
                        Manage Subscription
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Getting Started */}
            {jobs.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>Welcome to Trendit! Here's how to get started:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Create your first collection job</li>
                      <li>Monitor the collection progress</li>
                      <li>Analyze your collected data</li>
                      <li>Export insights and reports</li>
                    </ol>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href="/dashboard/jobs/new">
                      Start First Collection
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}