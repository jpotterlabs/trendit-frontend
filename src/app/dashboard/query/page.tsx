'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Search, Filter, Download, Calendar, Users, MessageSquare, ExternalLink, Copy, ThumbsUp } from 'lucide-react';
import { api } from '@/lib/api/client';
import { format } from 'date-fns';

interface QueryFilters {
  job_ids?: string[];
  subreddits?: string[];
  keywords?: string[];
  min_score?: number;
  max_score?: number;
  min_comments?: number;
  date_from?: string;
  date_to?: string;
  time_filter?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

interface QueryResult {
  posts?: any[];
  comments?: any[];
  total: number;
  query_time_ms: number;
  filters_applied: QueryFilters;
}

export default function QueryPage() {
  const [activeQueryTab, setActiveQueryTab] = useState<'advanced' | 'recent' | 'top'>('advanced');
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [filters, setFilters] = useState<QueryFilters>({
    limit: 50,
    sort_by: 'score',
    sort_order: 'desc',
  });
  const [recentParams, setRecentParams] = useState({
    limit: 20,
    subreddit: '',
    min_score: 0,
  });
  const [topParams, setTopParams] = useState({
    limit: 20,
    subreddit: '',
    timeframe_hours: 24,
  });
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleFilterChange = (key: keyof QueryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const runQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the real API based on the active tab
      let apiResponse;
      if (activeTab === 'posts') {
        apiResponse = await api.queryPosts(filters);
      } else {
        apiResponse = await api.queryComments(filters);
      }
      
      // Debug: Log the actual API response structure
      console.log('🔍 Raw API Response:', apiResponse);
      console.log('🔍 API Response keys:', Object.keys(apiResponse));
      
      // Try different possible response structures
      const responseData = apiResponse.data || apiResponse.posts || apiResponse.comments || apiResponse.results || apiResponse;
      const resultArray = Array.isArray(responseData) ? responseData : (responseData?.data || responseData?.results || []);
      
      console.log('🔍 Extracted data array:', resultArray);
      console.log('🔍 Data array length:', resultArray?.length);
      
      // Transform API response to match our expected format
      const results: QueryResult = {
        [activeTab]: resultArray,
        total: apiResponse.total || apiResponse.count || resultArray?.length || 0,
        query_time_ms: apiResponse.query_time_ms || apiResponse.execution_time_ms || 0,
        filters_applied: filters
      };
      
      console.log('🔍 Final results object:', results);
      setResults(results);
    } catch (err: any) {
      console.error('Query API error:', err);
      
      // Fallback to mock data if API fails
      if (err.response?.status === 404 || err.response?.status === 501) {
        setError('Query API not yet implemented. Showing sample data.');
        const mockResults: QueryResult = {
          [activeTab]: generateMockData(activeTab, 25),
          total: 1250,
          query_time_ms: 450,
          filters_applied: filters
        };
        setResults(mockResults);
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to execute query');
      }
    } finally {
      setLoading(false);
    }
  };

  const runSqlQuery = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the real SQL API
      const apiResponse = await api.executeSQL(sqlQuery);
      
      // Transform API response to match our expected format
      const results: QueryResult = {
        posts: apiResponse.data || apiResponse.results || [],
        total: apiResponse.total || apiResponse.count || apiResponse.data?.length || 0,
        query_time_ms: apiResponse.query_time_ms || apiResponse.execution_time_ms || 0,
        filters_applied: {}
      };
      
      setResults(results);
    } catch (err: any) {
      console.error('SQL Query API error:', err);
      
      // Fallback to mock data if API fails
      if (err.response?.status === 404 || err.response?.status === 501) {
        setError('SQL Query API not yet implemented. Showing sample data.');
        const mockResults: QueryResult = {
          posts: generateMockData('posts', 15),
          total: 15,
          query_time_ms: 280,
          filters_applied: {}
        };
        setResults(mockResults);
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to execute SQL query');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const generateMockData = (type: 'posts' | 'comments', count: number) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      if (type === 'posts') {
        data.push({
          id: `post_${i + 1}`,
          title: `Sample Post Title ${i + 1}`,
          content: `This is sample post content for demonstration purposes. Post ${i + 1}.`,
          author: `user${i + 1}`,
          subreddit: ['technology', 'programming', 'webdev', 'MachineLearning'][i % 4],
          score: Math.floor(Math.random() * 1000) + 10,
          upvote_ratio: (Math.random() * 0.3 + 0.7).toFixed(2),
          num_comments: Math.floor(Math.random() * 100),
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          url: `https://reddit.com/r/sample/post_${i + 1}`,
        });
      } else {
        data.push({
          id: `comment_${i + 1}`,
          content: `This is a sample comment for demonstration. Comment ${i + 1}.`,
          author: `commenter${i + 1}`,
          subreddit: ['technology', 'programming', 'webdev', 'MachineLearning'][i % 4],
          score: Math.floor(Math.random() * 500),
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          post_title: `Parent Post ${i + 1}`,
          depth: Math.floor(Math.random() * 3),
        });
      }
    }
    return data;
  };

  const exportResults = async () => {
    if (!results) return;
    
    try {
      // Mock export - in real app this would call the export API
      const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `query_results_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Failed to export results');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const openRedditLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <DashboardLayout title="Query Data" description="Search and query collected Reddit data">
      <div className="space-y-6">
        {/* Query Interface */}
        <Tabs value={showAdvanced ? 'sql' : 'filters'} onValueChange={(value) => setShowAdvanced(value === 'sql')}>
          <TabsList>
            <TabsTrigger value="filters">Filter Builder</TabsTrigger>
            <TabsTrigger value="sql">SQL Query</TabsTrigger>
          </TabsList>
          
          <TabsContent value="filters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Filters</CardTitle>
                <CardDescription>
                  Build your query using filters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Data Type Selection */}
                <div>
                  <Label>Data Type</Label>
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'posts' | 'comments')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="posts">Posts</TabsTrigger>
                      <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Basic Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="AI, machine learning, etc."
                      value={filters.keywords?.join(', ') || ''}
                      onChange={(e) => handleFilterChange('keywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subreddits">Subreddits</Label>
                    <Input
                      id="subreddits"
                      placeholder="technology, programming"
                      value={filters.subreddits?.join(', ') || ''}
                      onChange={(e) => handleFilterChange('subreddits', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="min_score">Min Score</Label>
                    <Input
                      id="min_score"
                      type="number"
                      placeholder="10"
                      value={filters.min_score || ''}
                      onChange={(e) => handleFilterChange('min_score', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date_from">Date From</Label>
                    <Input
                      id="date_from"
                      type="date"
                      value={filters.date_from || ''}
                      onChange={(e) => handleFilterChange('date_from', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date_to">Date To</Label>
                    <Input
                      id="date_to"
                      type="date"
                      value={filters.date_to || ''}
                      onChange={(e) => handleFilterChange('date_to', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time_filter">Time Filter</Label>
                    <Select
                      value={filters.time_filter || ''}
                      onValueChange={(value) => handleFilterChange('time_filter', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">Last Hour</SelectItem>
                        <SelectItem value="day">Last Day</SelectItem>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="limit">Limit</Label>
                    <Input
                      id="limit"
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="50"
                      value={filters.limit || ''}
                      onChange={(e) => handleFilterChange('limit', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sort_by">Sort By</Label>
                    <Select
                      value={filters.sort_by || 'score'}
                      onValueChange={(value) => handleFilterChange('sort_by', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="score">Score</SelectItem>
                        <SelectItem value="created_at">Date</SelectItem>
                        <SelectItem value="num_comments">Comments</SelectItem>
                        <SelectItem value="upvote_ratio">Upvote Ratio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Select
                      value={filters.sort_order || 'desc'}
                      onValueChange={(value) => handleFilterChange('sort_order', value as 'asc' | 'desc')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={runQuery} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Run Query
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sql" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SQL Query</CardTitle>
                <CardDescription>
                  Write custom SQL queries to search the database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sql">SQL Query</Label>
                  <Textarea
                    id="sql"
                    rows={6}
                    placeholder="SELECT * FROM posts WHERE score > 100 ORDER BY created_at DESC LIMIT 50"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="font-mono"
                  />
                </div>
                
                <Button onClick={runSqlQuery} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Execute Query
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {results && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Query Results</CardTitle>
                  <CardDescription>
                    Found {results.total} results in {results.query_time_ms}ms
                  </CardDescription>
                </div>
                <Button onClick={exportResults} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(results.posts || results.comments || []).map((item: any, index: number) => (
                  <div 
                    key={item.id || index} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedItem(item)}
                  >
                    {activeTab === 'posts' ? (
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-gray-900 pr-4">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
                            <Badge variant="outline">r/{item.subreddit}</Badge>
                            <span>{item.score} pts</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{item.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>by u/{item.author}</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {item.num_comments} comments
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at)}
                          </span>
                          <span>{(parseFloat(item.upvote_ratio) * 100).toFixed(0)}% upvoted</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="text-gray-900 pr-4">{item.content}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
                            <Badge variant="outline">r/{item.subreddit}</Badge>
                            <span>{item.score} pts</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>by u/{item.author}</span>
                          <span>in "{item.post_title}"</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at)}
                          </span>
                          <span>depth: {item.depth}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {results.total > (results.posts?.length || results.comments?.length || 0) && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing {results.posts?.length || results.comments?.length || 0} of {results.total} results
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Item Detail Modal */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Badge variant="outline">r/{selectedItem.subreddit}</Badge>
                    {activeTab === 'posts' ? selectedItem.title : 'Comment Details'}
                  </DialogTitle>
                  <DialogDescription>
                    by u/{selectedItem.author} • {formatDate(selectedItem.created_at)}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Content */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Content</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {activeTab === 'posts' ? selectedItem.content : selectedItem.content}
                      </p>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Score</span>
                      </div>
                      <p className="text-lg font-semibold text-blue-700">{selectedItem.score || 0}</p>
                    </div>
                    
                    {activeTab === 'posts' && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Comments</span>
                        </div>
                        <p className="text-lg font-semibold text-green-700">{selectedItem.num_comments || 0}</p>
                      </div>
                    )}
                    
                    {selectedItem.upvote_ratio && (
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Upvote %</span>
                        </div>
                        <p className="text-lg font-semibold text-purple-700">
                          {(parseFloat(selectedItem.upvote_ratio) * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                    
                    {activeTab === 'comments' && selectedItem.depth !== undefined && (
                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-900">Depth</span>
                        </div>
                        <p className="text-lg font-semibold text-orange-700">{selectedItem.depth}</p>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Metadata</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-mono text-gray-900">{selectedItem.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Author:</span>
                        <span className="text-gray-900">u/{selectedItem.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subreddit:</span>
                        <span className="text-gray-900">r/{selectedItem.subreddit}</span>
                      </div>
                      {activeTab === 'comments' && selectedItem.post_title && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Post:</span>
                          <span className="text-gray-900 truncate max-w-xs">{selectedItem.post_title}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">{formatDate(selectedItem.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(selectedItem.content)}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Content
                    </Button>
                    
                    {selectedItem.url && (
                      <Button
                        onClick={() => openRedditLink(selectedItem.url)}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Reddit
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}