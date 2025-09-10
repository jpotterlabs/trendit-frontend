'use client';

import { useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { StatsCards } from '@/components/dashboard/overview/stats-cards';
import { RecentJobs } from '@/components/dashboard/overview/recent-jobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStore } from '@/lib/store/dashboard';
import { useAuthStore } from '@/lib/store/auth';
import { Plus, BarChart3, Download, Zap, Activity, TrendingUp, CreditCard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, subscription, isAuthenticated, apiKey } = useAuthStore();
  const {
    jobs,
    dataSummary,
    isLoading,
    loadJobs,
    loadDataSummary,
  } = useDashboardStore();

  // Memoize the dashboard data loading function
  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated || !apiKey) {
      console.log('Not authenticated or no API key, skipping dashboard data load');
      return;
    }
    
    // Load data with staggered timing to prevent API spam
    const loadPromises = [];
    
    // Start jobs loading immediately
    loadPromises.push(loadJobs());
    
    // Delay data summary loading by 300ms to stagger requests
    loadPromises.push(
      new Promise(resolve => {
        setTimeout(async () => {
          await loadDataSummary();
          resolve(undefined);
        }, 300);
      })
    );
    
    // Wait for all loads to complete
    await Promise.allSettled(loadPromises);
  }, [isAuthenticated, apiKey, loadJobs, loadDataSummary]);

  useEffect(() => {
    // Only load if we have authentication
    if (isAuthenticated && apiKey) {
      loadDashboardData();
    }
  }, [isAuthenticated, apiKey, loadDashboardData]);

  const headerActions = (
    <Button asChild className="bg-gradient-to-r from-sapphire-500 to-violet-500 hover:from-sapphire-600 hover:to-violet-600 text-white shadow-glow-sapphire transition-all duration-300 hover:scale-105">
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
      <div className="space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="animate-fade-in">
          <StatsCards
            dataSummary={dataSummary}
            jobs={jobs}
            isLoading={isLoading}
          />
        </div>

        {/* Revolutionary Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger">
          {/* Recent Jobs - Enhanced Layout */}
          <div className="lg:col-span-2 animate-slide-in-left">
            <RecentJobs jobs={jobs} isLoading={isLoading} />
          </div>

          {/* Premium Actions & Info Panel */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Revolutionary Quick Actions */}
            <Card className="card-premium gradient-data border-0 shadow-medium overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sapphire-500/5 via-violet-500/5 to-emerald-500/5" />
              <CardHeader className="relative">
                <CardTitle className="text-lg font-bold text-gradient-primary flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sapphire-500 to-violet-500 flex items-center justify-center mr-3">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative">
                <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-glow-emerald transition-all duration-300 hover:scale-[1.02]" asChild>
                  <Link href="/dashboard/jobs/new">
                    <Plus className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">Create Collection Job</div>
                      <div className="text-xs opacity-90">Start gathering Reddit data</div>
                    </div>
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-glow-sapphire transition-all duration-300 hover:scale-[1.02]" asChild>
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">View Analytics</div>
                      <div className="text-xs opacity-90">Explore data insights</div>
                    </div>
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 shadow-glow-violet transition-all duration-300 hover:scale-[1.02]" asChild>
                  <Link href="/dashboard/export">
                    <Download className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">Export Data</div>
                      <div className="text-xs opacity-90">Download your reports</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Subscription Info */}
            {subscription && (
              <Card className="card-premium border-0 shadow-medium overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
                <CardHeader className="relative">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mr-3">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    Usage Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-foreground">API Calls</span>
                        <span className="text-muted-foreground">
                          {subscription.current_usage.api_calls || 0} / {subscription.limits.api_calls || 0}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={subscription.usage_percentage.api_calls || 0} 
                          className="h-3 bg-muted"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-sapphire-500 to-violet-500 rounded-full opacity-80" 
                             style={{ width: `${Math.min(subscription.usage_percentage.api_calls || 0, 100)}%` }} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-foreground">Exports</span>
                        <span className="text-muted-foreground">
                          {subscription.current_usage.exports || 0} / {subscription.limits.exports || 0}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={subscription.usage_percentage.exports || 0} 
                          className="h-3 bg-muted"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-80" 
                             style={{ width: `${Math.min(subscription.usage_percentage.exports || 0, 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
                    <Button variant="outline" size="sm" className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300" asChild>
                      <Link href="/dashboard/billing">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage Subscription
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Revolutionary Getting Started */}
            {jobs.length === 0 && (
              <Card className="card-premium border-0 shadow-strong overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10" />
                <CardHeader className="relative">
                  <CardTitle className="text-lg font-bold text-gradient-data flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mr-3">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    <p className="text-muted-foreground font-medium">Welcome to Trendit! Transform your Reddit data analysis:</p>
                    <div className="space-y-3">
                      {[
                        { icon: Plus, text: "Create your first collection job", color: "from-emerald-500 to-teal-500" },
                        { icon: Activity, text: "Monitor collection progress", color: "from-sapphire-500 to-violet-500" },
                        { icon: BarChart3, text: "Analyze your collected data", color: "from-violet-500 to-purple-500" },
                        { icon: Download, text: "Export insights and reports", color: "from-amber-500 to-orange-500" }
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/30 transition-all duration-200">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0`}>
                            <step.icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-glow-emerald transition-all duration-300 hover:scale-[1.02]" asChild>
                    <Link href="/dashboard/jobs/new">
                      <TrendingUp className="mr-2 h-4 w-4" />
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