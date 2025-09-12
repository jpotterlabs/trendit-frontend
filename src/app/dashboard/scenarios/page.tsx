'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Loader2, 
  Play, 
  Search, 
  TrendingUp, 
  Zap, 
  Users, 
  MessageSquare,
  Settings,
  Calendar,
  Target
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { format } from 'date-fns';
import { ScenarioResults } from '@/components/scenarios/ScenarioResults';

interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  example: string;
  parameterTemplate: Record<string, any>;
  runFunction: (params: any) => Promise<any>;
}

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const scenarios: ScenarioDefinition[] = [
    {
      id: 'keyword-search',
      name: 'Keyword Search',
      description: 'Search for posts containing specific keywords within subreddits and date ranges',
      icon: <Search className="h-5 w-5" />,
      category: 'Content Discovery',
      example: 'Find posts about "GPT" and "transformer" in AI subreddits',
      parameterTemplate: {
        subreddit: 'MachineLearning',
        keywords: 'GPT,transformer,AI',
        date_from: '2025-01-01',
        date_to: '2025-09-04',
        limit: 10,
        sort_by: 'score'
      },
      runFunction: api.runScenario1KeywordSearch
    },
    {
      id: 'trending-multi',
      name: 'Multi-Subreddit Trending',
      description: 'Identify trending topics across multiple subreddits',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'Trend Analysis',
      example: 'Track trending posts in programming subreddits',
      parameterTemplate: {
        subreddits: 'python,javascript,golang',
        timeframe: 'day',
        limit: 10
      },
      runFunction: api.runScenario2TrendingMulti
    },
    {
      id: 'top-posts-all',
      name: 'Top Posts in r/all',
      description: 'Get top posts from r/all with various sorting and filtering options',
      icon: <Zap className="h-5 w-5" />,
      category: 'Popular Content',
      example: 'Top hot posts in r/all for this week',
      parameterTemplate: {
        sort_type: 'hot',
        time_filter: 'week',
        limit: 10
      },
      runFunction: api.runScenario3TopPostsAll
    },
    {
      id: 'most-popular-today',
      name: 'Most Popular Today',
      description: 'Find the most popular post in a specific subreddit today',
      icon: <Target className="h-5 w-5" />,
      category: 'Daily Highlights',
      example: 'Most popular post in r/openai today',
      parameterTemplate: {
        subreddit: 'openai',
        metric: 'score'
      },
      runFunction: api.runScenario4MostPopularToday
    },
    {
      id: 'top-comments',
      name: 'Top Comments',
      description: 'Get top comments based on various criteria',
      icon: <MessageSquare className="h-5 w-5" />,
      category: 'Comment Analysis',
      example: 'Top comments in r/python about "django"',
      parameterTemplate: {
        subreddit: 'python',
        keywords: 'django',
        min_score: 5,
        limit: 10
      },
      runFunction: api.runScenario5TopComments
    },
    {
      id: 'top-users',
      name: 'Top Users by Activity',
      description: 'Find most active/popular users based on various metrics',
      icon: <Users className="h-5 w-5" />,
      category: 'User Analysis',
      example: 'Most active users in programming subreddits',
      parameterTemplate: {
        subreddits: 'python,javascript,golang',
        days_back: 7,
        limit: 10,
        metric: 'post_count'
      },
      runFunction: api.runScenario6TopUsers
    },
    {
      id: 'scenario-examples',
      name: 'View Examples',
      description: 'Get example API calls and scenarios',
      icon: <Settings className="h-5 w-5" />,
      category: 'Documentation',
      example: 'View all available scenario examples and templates',
      parameterTemplate: {},
      runFunction: api.getScenarioExamples
    }
  ];

  const categorizedScenarios = scenarios.reduce((acc, scenario) => {
    if (!acc[scenario.category]) {
      acc[scenario.category] = [];
    }
    acc[scenario.category].push(scenario);
    return acc;
  }, {} as Record<string, ScenarioDefinition[]>);

  const openScenario = (scenario: ScenarioDefinition) => {
    setSelectedScenario(scenario);
    setParameters(scenario.parameterTemplate);
    setResults(null);
    setError(null);
    setIsDialogOpen(true);
  };

  const runScenario = async () => {
    if (!selectedScenario) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await selectedScenario.runFunction(parameters);
      setResults(result);
      // Close dialog to show results cleanly in separate card
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to run scenario');
    } finally {
      setLoading(false);
    }
  };

  const updateParameter = (key: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderParameterInput = (key: string, value: any) => {
    // Handle different input types based on key name and value
    if (key.includes('date')) {
      return (
        <Input
          type="date"
          value={value || ''}
          onChange={(e) => updateParameter(key, e.target.value)}
        />
      );
    }
    
    if (key === 'limit' || key === 'min_score' || key === 'days_back') {
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => updateParameter(key, parseInt(e.target.value) || 0)}
        />
      );
    }
    
    if (key === 'sort_type') {
      return (
        <Select value={value || 'hot'} onValueChange={(val) => updateParameter(key, val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="rising">Rising</SelectItem>
            <SelectItem value="controversial">Controversial</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    if (key === 'time_filter' || key === 'timeframe') {
      return (
        <Select value={value || 'day'} onValueChange={(val) => updateParameter(key, val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">Hour</SelectItem>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    if (key === 'metric') {
      return (
        <Select value={value || 'score'} onValueChange={(val) => updateParameter(key, val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">Score</SelectItem>
            <SelectItem value="comments">Comments</SelectItem>
            <SelectItem value="upvote_ratio">Upvote Ratio</SelectItem>
            <SelectItem value="post_count">Post Count</SelectItem>
            <SelectItem value="total_score">Total Score</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    // Default to text input
    return (
      <Input
        value={value || ''}
        onChange={(e) => updateParameter(key, e.target.value)}
        placeholder={key.includes('subreddit') ? 'python,javascript' : ''}
      />
    );
  };

  return (
    <DashboardLayout title="Scenarios" description="Pre-built analysis patterns for Reddit data">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openScenario(scenario)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  {scenario.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{scenario.name}</CardTitle>
                </div>
              </div>
              <Badge variant="outline" className="w-fit">
                {scenario.category}
              </Badge>
            </CardHeader>
            
            <CardContent className="pt-0">
              <CardDescription className="mb-3 text-sm line-clamp-2">
                {scenario.description}
              </CardDescription>
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Example:</strong> {scenario.example}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scenario Configuration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          // Don't clear selectedScenario immediately - we need it for results header
          // Only clear it when results are cleared
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedScenario && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedScenario.icon}
                  {selectedScenario.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedScenario.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Parameters */}
                {Object.keys(selectedScenario.parameterTemplate).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Parameters</h3>
                    <div className="space-y-4">
                      {Object.entries(selectedScenario.parameterTemplate).map(([key, defaultValue]) => (
                        <div key={key}>
                          <Label htmlFor={key} className="capitalize">
                            {key.replace(/_/g, ' ')}
                          </Label>
                          {renderParameterInput(key, parameters[key] ?? defaultValue)}
                          <p className="text-sm text-gray-500 mt-1">
                            {key === 'subreddit' && 'Single subreddit name (e.g., "python")'}
                            {key === 'subreddits' && 'Comma-separated subreddit names (e.g., "python,javascript")'}
                            {key === 'keywords' && 'Comma-separated keywords to search for'}
                            {key === 'date_from' && 'Start date for search range'}
                            {key === 'date_to' && 'End date for search range'}
                            {key === 'limit' && 'Maximum number of results to return'}
                            {key === 'min_score' && 'Minimum score threshold for results'}
                            {key === 'days_back' && 'Number of days to analyze backwards'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Run Button */}
                <Button 
                  onClick={runScenario} 
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Scenario...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Scenario
                    </>
                  )}
                </Button>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Results Display - Separate Card */}
      {results && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedScenario?.icon}
                  <div>
                    <CardTitle>Scenario Results: {selectedScenario?.name}</CardTitle>
                    <CardDescription>
                      {results.description}
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setResults(null);
                    setSelectedScenario(null);
                  }}
                >
                  Close Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScenarioResults results={results} />
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}