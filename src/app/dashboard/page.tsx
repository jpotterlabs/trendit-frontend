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
            {/* Clean Quick Actions */}
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white border-0 h-auto py-3 px-4" asChild>
                  <Link href="/dashboard/jobs/new">
                    <Plus className="mr-3 h-4 w-4 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">Create Collection Job</div>
                      <div className="text-xs text-blue-100">Start gathering Reddit data</div>
                    </div>
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-auto py-3 px-4" asChild>
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="mr-3 h-4 w-4 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">View Analytics</div>
                      <div className="text-xs text-emerald-100">Explore data insights</div>
                    </div>
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white border-0 h-auto py-3 px-4" asChild>
                  <Link href="/dashboard/export">
                    <Download className="mr-3 h-4 w-4 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">Export Data</div>
                      <div className="text-xs text-purple-100">Download your reports</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Usage Overview */}
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription ? (
                  <div className="space-y-4">
                    {/* API Calls Usage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">API Calls</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {subscription.current_usage?.api_calls || 0} / {subscription.limits?.api_calls || 'Unlimited'}
                          </span>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {subscription.usage_percentage?.api_calls || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(subscription.usage_percentage?.api_calls || 0, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Export Usage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Exports</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {subscription.current_usage?.exports || 0} / {subscription.limits?.exports || 'Unlimited'}
                          </span>
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {subscription.usage_percentage?.exports || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(subscription.usage_percentage?.exports || 0, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Sentiment Analysis Usage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sentiment Analysis</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {subscription.current_usage?.sentiment_analysis || 0} / {subscription.limits?.sentiment_analysis || 'Unlimited'}
                          </span>
                          <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                            {subscription.usage_percentage?.sentiment_analysis || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(subscription.usage_percentage?.sentiment_analysis || 0, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Plan Info */}
                    <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          {subscription.tier || 'Free'} Plan
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          ${subscription.price_per_month || 0}/mo
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                        <Link href="/dashboard/billing">
                          <CreditCard className="mr-1.5 h-3 w-3" />
                          Manage Subscription
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Loading usage data...</p>
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Clean Getting Started */}
            {jobs.length === 0 && (
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Welcome to Trendit! Transform your Reddit data analysis:</p>
                    <div className="space-y-3">
                      {[
                        { icon: Plus, text: "Create your first collection job", color: "bg-blue-100 text-blue-600" },
                        { icon: Activity, text: "Monitor collection progress", color: "bg-emerald-100 text-emerald-600" },
                        { icon: BarChart3, text: "Analyze your collected data", color: "bg-purple-100 text-purple-600" },
                        { icon: Download, text: "Export insights and reports", color: "bg-orange-100 text-orange-600" }
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
                          <div className={`w-6 h-6 rounded-full ${step.color} dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0`}>
                            <step.icon className="h-3 w-3" />
                          </div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white" asChild>
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