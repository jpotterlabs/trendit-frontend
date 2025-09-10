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
          <Card key={i} className="card-premium shadow-medium overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-slate-500/5 via-neutral-500/5 to-gray-500/5" />
            <CardHeader className="animate-pulse relative z-10">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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
      gradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
      iconGradient: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Total Comments',
      value: totalComments.toLocaleString(),
      icon: Users,
      change: '+8%',
      changeType: 'positive' as const,
      gradient: 'from-sapphire-500/10 via-blue-500/10 to-violet-500/10',
      iconGradient: 'from-sapphire-500 to-blue-500',
    },
    {
      name: 'Active Jobs',
      value: activeJobs.toString(),
      icon: Clock,
      change: activeJobs > 0 ? `${activeJobs} running` : 'None',
      changeType: 'neutral' as const,
      gradient: 'from-amber-500/10 via-yellow-500/10 to-orange-500/10',
      iconGradient: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Completed Jobs',
      value: completedJobs.toString(),
      icon: CheckCircle,
      change: '+3 this week',
      changeType: 'positive' as const,
      gradient: 'from-violet-500/10 via-purple-500/10 to-pink-500/10',
      iconGradient: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.name} className="card-premium shadow-medium overflow-hidden hover:shadow-strong transition-all duration-300 hover:scale-[1.02] group">
            <div className={`absolute inset-0 pointer-events-none z-0 bg-gradient-to-br ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                {stat.name}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.iconGradient} flex items-center justify-center shadow-glow-sapphire/50 group-hover:shadow-glow-sapphire transition-all duration-300`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className={
                    stat.changeType === 'positive'
                      ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                      : 'text-muted-foreground bg-muted border-border'
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