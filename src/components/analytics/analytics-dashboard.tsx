'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  EngagementTrends,
  SubredditDistribution,
  SentimentAnalysis,
  KeywordFrequency,
  ScoreDistribution,
} from './charts';
import { PostAnalyticsResponse, CollectionJobResponse } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Users, FileText, TrendingUp, MessageSquare } from 'lucide-react';

interface AnalyticsDashboardProps {
  jobs: CollectionJobResponse[];
  selectedJobId: string | null;
  analytics: PostAnalyticsResponse | null;
  isLoading: boolean;
  onJobSelect: (jobId: string) => void;
}

export function AnalyticsDashboard({
  jobs,
  selectedJobId,
  analytics,
  isLoading,
  onJobSelect,
}: AnalyticsDashboardProps) {
  const selectedJob = jobs.find(job => job.job_id === selectedJobId);
  const completedJobs = jobs.filter(job => job.status === 'completed');

  // Transform analytics data for charts
  const getChartData = () => {
    if (!analytics) return null;

    // Mock engagement trends data (would come from API in real app)
    const engagementTrends = [
      { date: '2025-08-01', posts: 15, avgScore: 42, comments: 180 },
      { date: '2025-08-02', posts: 23, avgScore: 38, comments: 245 },
      { date: '2025-08-03', posts: 18, avgScore: 55, comments: 198 },
      { date: '2025-08-04', posts: 31, avgScore: 47, comments: 312 },
      { date: '2025-08-05', posts: 28, avgScore: 52, comments: 289 },
    ];

    // Subreddit distribution
    const subredditData = Object.entries(analytics.subreddit_breakdown).map(([name, posts]) => ({
      name: name.replace('r/', ''),
      posts: posts as number,
      comments: Math.floor((posts as number) * 12), // Mock comment ratio
    }));

    // Sentiment data (mock)
    const sentimentData = [
      { name: 'Positive', value: 45 },
      { name: 'Neutral', value: 38 },
      { name: 'Negative', value: 17 },
    ];

    // Keyword frequency (mock based on content distribution)
    const keywordData = Object.entries(analytics.content_distribution || {})
      .slice(0, 10)
      .map(([keyword, frequency]) => ({
        keyword,
        frequency: frequency as number,
      }));

    // Score distribution (mock)
    const scoreData = [
      { scoreRange: '0-10', count: 45 },
      { scoreRange: '11-25', count: 67 },
      { scoreRange: '26-50', count: 89 },
      { scoreRange: '51-100', count: 124 },
      { scoreRange: '100+', count: 78 },
    ];

    return {
      engagementTrends,
      subredditData,
      sentimentData,
      keywordData,
      scoreData,
    };
  };

  const chartData = getChartData();

  // Summary statistics
  const summaryStats = analytics ? [
    {
      title: 'Total Posts',
      value: analytics.total_posts.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Unique Authors',
      value: analytics.unique_authors.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Subreddits',
      value: analytics.unique_subreddits.toString(),
      icon: MessageSquare,
      color: 'text-purple-600',
    },
    {
      title: 'Avg Score',
      value: analytics.score_stats?.mean?.toFixed(1) || '0.0',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Job Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Collection Job
              </label>
              <Select value={selectedJobId || ''} onValueChange={onJobSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a completed job to analyze..." />
                </SelectTrigger>
                <SelectContent>
                  {completedJobs.map((job) => (
                    <SelectItem key={job.job_id} value={job.job_id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{job.subreddits.join(', ')}</span>
                        <Badge variant="outline" className="ml-2">
                          {job.collected_posts} posts
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedJob && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDistanceToNow(new Date(selectedJob.created_at))} ago
                </div>
                <div className="flex items-center">
                  <FileText className="mr-1 h-4 w-4" />
                  {selectedJob.collected_posts} posts
                </div>
                <div className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  {selectedJob.collected_comments} comments
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content based on selection */}
      {!selectedJobId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Select a Job to View Analytics</h3>
              <p className="text-gray-500 max-w-sm">
                Choose a completed collection job from the dropdown above to view detailed analytics and visualizations.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-6">
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : analytics ? (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {summaryStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubredditDistribution 
                  data={chartData?.subredditData || []} 
                  isLoading={false}
                />
                <ScoreDistribution 
                  data={chartData?.scoreData || []} 
                  isLoading={false}
                />
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <EngagementTrends 
                data={chartData?.engagementTrends || []} 
                isLoading={false}
              />
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <KeywordFrequency 
                data={chartData?.keywordData || []} 
                isLoading={false}
              />
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-6">
              <SentimentAnalysis 
                data={chartData?.sentimentData || []} 
                isLoading={false}
              />
            </TabsContent>
          </Tabs>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mean Score:</span>
                    <span className="font-medium">{analytics.score_stats?.mean?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Score:</span>
                    <span className="font-medium">{analytics.score_stats?.median?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Score:</span>
                    <span className="font-medium">{analytics.score_stats?.max || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Score:</span>
                    <span className="font-medium">{analytics.score_stats?.min || '0'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Range:</span>
                    <span className="font-medium text-sm">
                      {new Date(analytics.date_range.earliest).toLocaleDateString()} - {new Date(analytics.date_range.latest).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Comments:</span>
                    <span className="font-medium">{analytics.engagement_stats?.average_comments?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Upvote Ratio:</span>
                    <span className="font-medium">{analytics.engagement_stats?.average_upvote_ratio ? (analytics.engagement_stats.average_upvote_ratio * 100).toFixed(1) : '0.0'}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium text-gray-900">No Analytics Available</h3>
              <p className="text-gray-500">
                Unable to load analytics for the selected job. Please try refreshing or selecting a different job.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}