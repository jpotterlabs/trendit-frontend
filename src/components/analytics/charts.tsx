'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Color palette for charts
const COLORS = ['#FF4500', '#0079D3', '#46D160', '#FFB000', '#FF3333', '#9333EA'];

interface EngagementTrendData {
  date: string;
  posts: number;
  avgScore: number;
  comments: number;
}

interface SubredditData {
  name: string;
  posts: number;
  comments: number;
}

interface SentimentData {
  name: string;
  value: number;
}

interface KeywordData {
  keyword: string;
  frequency: number;
}

// Engagement Trends Chart
interface EngagementTrendsProps {
  data: EngagementTrendData[];
  isLoading?: boolean;
}

export function EngagementTrends({ data, isLoading }: EngagementTrendsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="posts" fill={COLORS[0]} name="Posts" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgScore"
              stroke={COLORS[1]}
              strokeWidth={2}
              name="Avg Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Subreddit Distribution Chart
interface SubredditDistributionProps {
  data: SubredditData[];
  isLoading?: boolean;
}

export function SubredditDistribution({ data, isLoading }: SubredditDistributionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subreddit Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts by Subreddit</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="posts" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Sentiment Analysis Chart
interface SentimentAnalysisProps {
  data: SentimentData[];
  isLoading?: boolean;
}

export function SentimentAnalysis({ data, isLoading }: SentimentAnalysisProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Keyword Frequency Chart
interface KeywordFrequencyProps {
  data: KeywordData[];
  isLoading?: boolean;
}

export function KeywordFrequency({ data, isLoading }: KeywordFrequencyProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  // Take top 10 keywords for better visualization
  const topKeywords = data.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Frequent Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topKeywords}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="keyword" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frequency" fill={COLORS[3]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Score Distribution Chart
interface ScoreDistributionProps {
  data: { scoreRange: string; count: number }[];
  isLoading?: boolean;
}

export function ScoreDistribution({ data, isLoading }: ScoreDistributionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="scoreRange" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={COLORS[4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}