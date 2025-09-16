'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, MessageCircle, BarChart3, Target, Zap } from 'lucide-react';
import Link from 'next/link';

// Mock data for sentiment analysis
const sentimentSummary = {
  total_analyzed: 15420,
  positive: 8734,
  neutral: 4521,
  negative: 2165,
  average_score: 0.73,
  trending: '+12%'
};

const recentAnalyses = [
  {
    id: 1,
    text: "This product is absolutely amazing! Best purchase I've made.",
    sentiment: 'positive',
    score: 0.94,
    confidence: 0.98,
    source: 'r/ProductReviews',
    timestamp: '2 minutes ago'
  },
  {
    id: 2,
    text: "Not sure if this is worth the price, mixed feelings about it.",
    sentiment: 'neutral',
    score: 0.12,
    confidence: 0.85,
    source: 'r/BuyItForLife',
    timestamp: '5 minutes ago'
  },
  {
    id: 3,
    text: "Terrible experience, wouldn't recommend to anyone.",
    sentiment: 'negative',
    score: -0.78,
    confidence: 0.91,
    source: 'r/CustomerService',
    timestamp: '8 minutes ago'
  },
  {
    id: 4,
    text: "Great value for money, really happy with the quality!",
    sentiment: 'positive',
    score: 0.85,
    confidence: 0.88,
    source: 'r/Reviews',
    timestamp: '12 minutes ago'
  }
];

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
    case 'negative':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300';
    case 'neutral':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300';
  }
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
      return '😐';
    default:
      return '🤔';
  }
};

export default function SentimentPage() {
  const headerActions = (
    <Button asChild className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-glow-emerald transition-all duration-300 hover:scale-105">
      <Link href="/dashboard/analytics">
        <BarChart3 className="mr-2 h-4 w-4" />
        View Full Analytics
      </Link>
    </Button>
  );

  return (
    <DashboardLayout
      title="AI Sentiment Analysis"
      description="Advanced sentiment analysis powered by machine learning"
      headerActions={headerActions}
    >
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger">
          <Card className="card-premium shadow-medium overflow-hidden hover:shadow-strong transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                Total Analyzed
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-glow-emerald/50 group-hover:shadow-glow-emerald transition-all duration-300">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-foreground mb-2">{sentimentSummary.total_analyzed.toLocaleString()}</div>
              <div className="flex items-center">
                <Badge className="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                  {sentimentSummary.trending} this week
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium shadow-medium overflow-hidden hover:shadow-strong transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                Positive Sentiment
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-glow-emerald/50 group-hover:shadow-glow-emerald transition-all duration-300">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-foreground mb-2">{sentimentSummary.positive.toLocaleString()}</div>
              <div className="flex items-center space-x-2">
                <Progress value={(sentimentSummary.positive / sentimentSummary.total_analyzed) * 100} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground font-medium">
                  {Math.round((sentimentSummary.positive / sentimentSummary.total_analyzed) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium shadow-medium overflow-hidden hover:shadow-strong transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                Neutral Sentiment
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-glow-sapphire/50 group-hover:shadow-glow-sapphire transition-all duration-300">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-foreground mb-2">{sentimentSummary.neutral.toLocaleString()}</div>
              <div className="flex items-center space-x-2">
                <Progress value={(sentimentSummary.neutral / sentimentSummary.total_analyzed) * 100} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground font-medium">
                  {Math.round((sentimentSummary.neutral / sentimentSummary.total_analyzed) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium shadow-medium overflow-hidden hover:shadow-strong transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-red-500/10 to-pink-500/10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                Average Score
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sapphire-500 to-violet-500 flex items-center justify-center shadow-glow-violet/50 group-hover:shadow-glow-violet transition-all duration-300">
                <Brain className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-foreground mb-2">{sentimentSummary.average_score}</div>
              <div className="flex items-center">
                <Badge className="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                  Strong positive trend
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger">
          {/* Recent Analyses */}
          <div className="lg:col-span-2 animate-slide-in-left">
            <Card className="card-premium shadow-medium overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sapphire-500/5 via-violet-500/5 to-emerald-500/5" />
              <CardHeader className="flex flex-row items-center justify-between relative">
                <CardTitle className="text-lg font-bold text-gradient-primary flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brain-500 to-violet-500 flex items-center justify-center mr-3">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  Recent Sentiment Analysis
                </CardTitle>
                <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300" asChild>
                  <Link href="/dashboard/analytics">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card/80 hover:shadow-soft hover:border-primary/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getSentimentIcon(analysis.sentiment)}</span>
                        <Badge className={getSentimentColor(analysis.sentiment)}>
                          {analysis.sentiment}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          {analysis.source} • {analysis.timestamp}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-foreground">
                          {analysis.score > 0 ? '+' : ''}{analysis.score.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(analysis.confidence * 100)}% confidence
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 italic leading-relaxed">
                      "{analysis.text}"
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Quick Actions */}
            <Card className="card-premium gradient-data border-0 shadow-medium overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-blue-500/5" />
              <CardHeader className="relative">
                <CardTitle className="text-lg font-bold text-gradient-data flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mr-3">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  AI Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative">
                <Button className="w-full justify-start bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-glow-emerald transition-all duration-300 hover:scale-[1.02]" asChild>
                  <Link href="/dashboard/analytics">
                    <Brain className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">Analyze New Content</div>
                      <div className="text-xs opacity-90">Run sentiment analysis</div>
                    </div>
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-glow-sapphire transition-all duration-300 hover:scale-[1.02]" asChild>
                  <Link href="/dashboard/export">
                    <BarChart3 className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">Export Reports</div>
                      <div className="text-xs opacity-90">Download insights</div>
                    </div>
                  </Link>
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 shadow-glow-violet transition-all duration-300 hover:scale-[1.02]" asChild>
                  <Link href="/dashboard/jobs/new">
                    <Target className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">Configure Analysis</div>
                      <div className="text-xs opacity-90">Set parameters</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="card-premium border-0 shadow-strong overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sapphire-500/10 via-violet-500/10 to-purple-500/10" />
              <CardHeader className="relative">
                <CardTitle className="text-lg font-bold text-gradient-primary flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sapphire-500 to-violet-500 flex items-center justify-center mr-3">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                    <h4 className="text-sm font-semibold text-foreground mb-2">📈 Trending Positive</h4>
                    <p className="text-xs text-muted-foreground">
                      Positive sentiment increased 12% this week, driven by product satisfaction and customer service improvements.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                    <h4 className="text-sm font-semibold text-foreground mb-2">⚡ Key Topics</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {['Quality', 'Price', 'Service', 'Delivery'].map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                    <h4 className="text-sm font-semibold text-foreground mb-2">🎯 Recommendations</h4>
                    <p className="text-xs text-muted-foreground">
                      Focus on addressing neutral sentiment to convert to positive. Monitor delivery-related feedback closely.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}