'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, TrendingUp, Users, FileText, Clock, CheckCircle } from 'lucide-react';
import { DataSummary, CollectionJobResponse } from '@/lib/types';

interface StatsCardsProps {
  dataSummary: DataSummary | null;
  jobs: CollectionJobResponse[];
  isLoading?: boolean;
}

export function StatsCards({ dataSummary, jobs, isLoading = false }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const activeJobs = jobs.filter(job => job.status === 'running').length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const totalPosts = dataSummary?.total_posts || 0;
  const totalComments = dataSummary?.total_comments || 0;

  const stats = [
    {
      name: 'Total Posts',
      value: totalPosts.toLocaleString(),
      icon: FileText,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Comments',
      value: totalComments.toLocaleString(),
      icon: Users,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Jobs',
      value: activeJobs.toString(),
      icon: Clock,
      change: activeJobs > 0 ? `${activeJobs} running` : 'None',
      changeType: 'neutral' as const,
    },
    {
      name: 'Completed Jobs',
      value: completedJobs.toString(),
      icon: CheckCircle,
      change: '+3 this week',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center mt-1">
                <Badge
                  variant="outline"
                  className={
                    stat.changeType === 'positive'
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-600 bg-gray-50'
                  }
                >
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}