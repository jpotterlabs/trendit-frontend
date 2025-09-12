'use client';

import { useState, useCallback } from 'react';
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
import { 
  Loader2, Search, Filter, Download, Calendar, Users, MessageSquare, ExternalLink, Copy, ThumbsUp, 
  ChevronDown, ChevronUp, Play, Image as ImageIcon, Video, Link as LinkIcon, Eye, Heart, ArrowUp, ArrowDown, 
  MoreHorizontal, Expand 
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { format } from 'date-fns';
import Image from 'next/image';

interface QueryFilters {
  job_ids?: string[];
  subreddits?: string[];
  keywords?: string[];
  min_score?: number;
  max_score?: number;
  min_comments?: number;
  time_filter?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  exclude_deleted?: boolean;
}

interface RedditPost {
  id: string;
  title: string;
  content?: string;
  selftext?: string;
  author: string;
  subreddit: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  created_at: string;
  created_utc?: string;
  url: string;
  thumbnail?: string;
  post_hint?: string;
  preview?: any;
  media?: any;
  is_video?: boolean;
  domain?: string;
  permalink?: string;
}

interface RedditComment {
  id: string;
  content: string;
  author: string;
  subreddit: string;
  score: number;
  created_at: string;
  created_utc?: string;
  post_title: string;
  post_id?: string;
  depth: number;
  parent_id?: string;
  permalink?: string;
}

interface UnifiedFeedItem {
  type: 'post' | 'comment';
  data: RedditPost | RedditComment;
  comments?: RedditComment[];
  expanded?: boolean;
}

interface QueryResult {
  posts?: RedditPost[];
  comments?: RedditComment[];
  total: number;
  query_time_ms: number;
  filters_applied: QueryFilters;
}

export default function QueryPage() {
  const [activeQueryTab, setActiveQueryTab] = useState<'advanced' | 'recent' | 'top'>('advanced');
  const [viewMode, setViewMode] = useState<'unified' | 'posts' | 'comments'>('unified');
  const [feedItems, setFeedItems] = useState<UnifiedFeedItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string } | null>(null);
  const [filters, setFilters] = useState<QueryFilters>({
    limit: 50,
    sort_by: 'score',
    sort_order: 'desc',
    time_filter: 'all',
    exclude_deleted: false,
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
  
  // Pagination state
  const [currentOffset, setCurrentOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  const handleFilterChange = (key: keyof QueryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const createUnifiedFeed = (posts: RedditPost[], comments: RedditComment[]): UnifiedFeedItem[] => {
    const feedItems: UnifiedFeedItem[] = [];
    const postMap = new Map<string, UnifiedFeedItem>();
    
    // Add posts to feed
    posts.forEach(post => {
      const feedItem: UnifiedFeedItem = {
        type: 'post',
        data: post,
        comments: [],
        expanded: false
      };
      feedItems.push(feedItem);
      postMap.set(post.id, feedItem);
    });
    
    // Group comments with their parent posts or add as standalone
    comments.forEach(comment => {
      const parentPost = postMap.get(comment.post_id || '');
      if (parentPost && parentPost.comments) {
        parentPost.comments.push(comment);
      } else {
        // Standalone comment if parent post not found
        feedItems.push({
          type: 'comment',
          data: comment,
          expanded: false
        });
      }
    });
    
    // Sort by score or date
    return feedItems.sort((a, b) => {
      const scoreA = a.data.score || 0;
      const scoreB = b.data.score || 0;
      return scoreB - scoreA;
    });
  };

  const runQuery = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setCurrentOffset(0); // Reset pagination for new queries
        setHasMoreResults(false);
      }
      setError(null);
      
      const queryOffset = isLoadMore ? currentOffset + (filters.limit || 50) : 0;
      const paginatedFilters = { ...filters, offset: queryOffset };
      
      console.log('🔍 Query Filters being sent:', JSON.stringify(paginatedFilters, null, 2));
      console.log('🔍 View Mode:', viewMode);
      console.log('🔍 Is Load More:', isLoadMore, 'Offset:', queryOffset);
      
      let postsData: RedditPost[] = [];
      let commentsData: RedditComment[] = [];
      let apiResponse: any = {};
      
      try {
        // For unified view, fetch both posts and comments
        if (viewMode === 'unified' || viewMode === 'posts') {
          console.log('🔍 Fetching posts...');
          const postsResponse = await api.queryPosts(paginatedFilters);
          const postsArray = postsResponse.data || postsResponse.posts || postsResponse.results || postsResponse;
          postsData = Array.isArray(postsArray) ? postsArray : [];
          apiResponse = postsResponse;
        }
        
        if (viewMode === 'unified' || viewMode === 'comments') {
          console.log('🔍 Fetching comments...');
          const commentsResponse = await api.queryComments(paginatedFilters);
          const commentsArray = commentsResponse.data || commentsResponse.comments || commentsResponse.results || commentsResponse;
          commentsData = Array.isArray(commentsArray) ? commentsArray : [];
          if (viewMode === 'comments') apiResponse = commentsResponse;
        }
        
        console.log('🔍 API calls successful');
      } catch (apiError) {
        console.error('🔍 API call failed:', apiError);
        throw apiError;
      }
      
      // Create unified feed or separate results
      if (viewMode === 'unified') {
        const newUnifiedFeed = createUnifiedFeed(postsData, commentsData);
        if (isLoadMore) {
          setFeedItems(prev => [...prev, ...newUnifiedFeed]);
        } else {
          setFeedItems(newUnifiedFeed);
        }
      } else {
        const feedData = viewMode === 'posts' ? postsData : commentsData;
        const newUnifiedFeed = feedData.map(item => ({
          type: viewMode.slice(0, -1) as 'post' | 'comment',
          data: item,
          expanded: false,
          comments: viewMode === 'posts' ? [] : undefined
        }));
        if (isLoadMore) {
          setFeedItems(prev => [...prev, ...newUnifiedFeed]);
        } else {
          setFeedItems(newUnifiedFeed);
        }
      }
      
      // Update pagination state
      const receivedItems = postsData.length + commentsData.length;
      const requestedLimit = filters.limit || 50;
      setHasMoreResults(receivedItems === requestedLimit);
      if (isLoadMore) {
        setCurrentOffset(prev => prev + requestedLimit);
      }
      
      const results: QueryResult = {
        posts: postsData,
        comments: commentsData,
        total: apiResponse.total || apiResponse.count || (postsData.length + commentsData.length) || 0,
        query_time_ms: apiResponse.query_time_ms || apiResponse.execution_time_ms || 0,
        filters_applied: filters
      };
      
      console.log('🔍 Final results object:', results);
      setResults(results);
    } catch (err: any) {
      console.error('Query API error:', err);
      
      if (err.response?.status === 404 || err.response?.status === 501) {
        setError('Query API not yet implemented. Showing sample data.');
        const mockPosts = generateMockData('posts', 15) as RedditPost[];
        const mockComments = generateMockData('comments', 10) as RedditComment[];
        
        if (viewMode === 'unified') {
          const unifiedFeed = createUnifiedFeed(mockPosts, mockComments);
          setFeedItems(unifiedFeed);
        } else {
          const feedData = viewMode === 'posts' ? mockPosts : mockComments;
          const unifiedFeed = feedData.map(item => ({
            type: viewMode.slice(0, -1) as 'post' | 'comment',
            data: item,
            expanded: false,
            comments: viewMode === 'posts' ? [] : undefined
          }));
          setFeedItems(unifiedFeed);
        }
        
        const mockResults: QueryResult = {
          posts: mockPosts,
          comments: mockComments,
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
      setLoadingMore(false);
    }
  };

  const loadMoreResults = async () => {
    if (loadingMore || !hasMoreResults) return;
    
    try {
      await runQuery(true); // true indicates this is a "load more" request
    } catch (error) {
      console.error('Load more failed:', error);
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
          posts: generateMockData('posts', 15) as RedditPost[],
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

  const getItemDate = (item: any) => {
    return item.created_utc || item.created_at;
  };
  
  const generateMockData = (type: 'posts' | 'comments', count: number) => {
    const data = [];
    const sampleImages = [
      'https://picsum.photos/800/450?random=1',
      'https://picsum.photos/800/450?random=2', 
      'https://picsum.photos/800/450?random=3',
      null, null // Some posts without images
    ];
    
    const sampleContent = [
      'This is a comprehensive analysis of the latest developments in machine learning. The field has seen tremendous growth over the past year, with new breakthroughs in natural language processing and computer vision that are reshaping how we think about AI capabilities.',
      'Check out this amazing project I\'ve been working on! It combines React with some cutting-edge APIs to create something really useful for developers. The learning curve was steep but totally worth it.',
      'Here\'s my take on the current state of web development. Framework fatigue is real, but there are some genuinely exciting developments happening that make the complexity worthwhile.',
      'Just discovered this incredible technique that completely changed how I approach problem-solving in my day job. Sharing it here in case it helps anyone else facing similar challenges.',
      'Long-form discussion about the implications of recent tech industry changes and what they mean for developers, designers, and the broader ecosystem. Lots to unpack here.'
    ];
    
    for (let i = 0; i < count; i++) {
      if (type === 'posts') {
        const hasImage = Math.random() > 0.4;
        data.push({
          id: `post_${i + 1}`,
          title: `${['Breaking:', 'Discussion:', 'Show Reddit:', 'Ask Reddit:', 'TIL:'][i % 5]} ${['Breakthrough in AI leads to new possibilities', 'What do you think about this new framework?', 'Built this tool over the weekend', 'How do you handle complex state management?', 'The future of web development looks bright'][i % 5]}`,
          content: sampleContent[i % sampleContent.length],
          selftext: sampleContent[i % sampleContent.length],
          author: `user${Math.floor(Math.random() * 50) + 1}`,
          subreddit: ['technology', 'programming', 'webdev', 'MachineLearning', 'reactjs'][i % 5],
          score: Math.floor(Math.random() * 2000) + 50,
          upvote_ratio: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
          num_comments: Math.floor(Math.random() * 200) + 5,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          url: `https://reddit.com/r/sample/post_${i + 1}`,
          thumbnail: hasImage ? sampleImages[i % sampleImages.length] : null,
          post_hint: hasImage ? 'image' : 'self',
          is_video: Math.random() > 0.9,
          domain: hasImage ? 'i.redd.it' : 'self.programming'
        });
      } else {
        data.push({
          id: `comment_${i + 1}`,
          content: sampleContent[i % sampleContent.length].substring(0, 200) + '...',
          author: `commenter${Math.floor(Math.random() * 30) + 1}`,
          subreddit: ['technology', 'programming', 'webdev', 'MachineLearning', 'reactjs'][i % 5],
          score: Math.floor(Math.random() * 500) + 1,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          post_title: `Parent Post for Comment ${i + 1}`,
          post_id: `post_${Math.floor(i / 3) + 1}`,
          depth: Math.floor(Math.random() * 4),
        });
      }
    }
    return data;
  };
  
  const toggleItemExpansion = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);
  
  const openMediaViewer = useCallback((url: string, type: string) => {
    setSelectedMedia({ url, type });
  }, []);
  
  // Allowed image domains (must match next.config.ts)
  const ALLOWED_IMAGE_DOMAINS = [
    'picsum.photos',
    'i.redd.it', 
    'preview.redd.it',
    'external-preview.redd.it',
    'i.imgur.com',
    'imgur.com'
  ];

  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      
      // Check if hostname is in allowed list
      const isAllowedDomain = ALLOWED_IMAGE_DOMAINS.some(domain => 
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
      
      // Additional check for common image file extensions
      const hasImageExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(parsedUrl.pathname);
      
      return isAllowedDomain && (hasImageExtension || hostname.includes('redd.it') || hostname.includes('picsum'));
    } catch {
      // Invalid URL
      return false;
    }
  };
  
  const getContentPreview = (content: string | undefined, maxLength: number = 300): string => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
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
    <DashboardLayout title="Query Data" description="Search and analyze Reddit data with our revolutionary content-rich interface">
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
                {/* View Mode Selection */}
                <div>
                  <Label>View Mode</Label>
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'unified' | 'posts' | 'comments')}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="unified">Unified Feed</TabsTrigger>
                      <TabsTrigger value="posts">Posts Only</TabsTrigger>
                      <TabsTrigger value="comments">Comments Only</TabsTrigger>
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
                    <Label htmlFor="time_filter">Time Range</Label>
                    <Select
                      value={filters.time_filter || 'all'}
                      onValueChange={(value) => handleFilterChange('time_filter', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">Past Hour</SelectItem>
                        <SelectItem value="day">Past 24 Hours</SelectItem>
                        <SelectItem value="week">Past Week</SelectItem>
                        <SelectItem value="month">Past Month</SelectItem>
                        <SelectItem value="year">Past Year</SelectItem>
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
                
                <Button onClick={() => runQuery()} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
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
        
        {results && feedItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Query Results</CardTitle>
                  <CardDescription>
                    Found {results.total} results in {results.query_time_ms}ms • Showing {feedItems.length} items
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={exportResults} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feedItems.map((feedItem: UnifiedFeedItem, index: number) => {
                  const isExpanded = expandedItems.has(feedItem.data.id);
                  const isPost = feedItem.type === 'post';
                  const data = feedItem.data as any;
                  
                  return (
                    <div 
                      key={feedItem.data.id || index}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Post/Comment Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                          {/* Vote Buttons */}
                          <div className="flex flex-col items-center gap-1 pt-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600">
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold text-sm text-gray-900">
                              {data.score || 0}
                            </span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title for posts */}
                            {isPost && (
                              <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                                {(data as RedditPost).title}
                              </h3>
                            )}
                            
                            {/* Post content or comment text */}
                            <div className="mb-4">
                              {isPost ? (
                                <div>
                                  {/* Image thumbnail for posts */}
                                  {isValidImageUrl(data.thumbnail) && (
                                    <div 
                                      className="relative mb-4 rounded-lg overflow-hidden cursor-pointer group"
                                      onClick={() => openMediaViewer(data.thumbnail, 'image')}
                                    >
                                      <Image
                                        src={data.thumbnail}
                                        alt="Post image"
                                        width={600}
                                        height={300}
                                        className="w-full h-auto max-h-96 object-cover group-hover:scale-105 transition-transform duration-200"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                        <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Post text content */}
                                  {(data.content || data.selftext) && (
                                    <div className="prose prose-sm max-w-none">
                                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {isExpanded 
                                          ? (data.content || data.selftext)
                                          : getContentPreview(data.content || data.selftext, 400)
                                        }
                                      </p>
                                      {(data.content || data.selftext)?.length > 400 && (
                                        <Button 
                                          variant="link" 
                                          size="sm" 
                                          className="p-0 h-auto text-orange-600 hover:text-orange-700"
                                          onClick={() => toggleItemExpansion(data.id)}
                                        >
                                          {isExpanded ? 'Show less' : 'Read more'}
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* External link preview */}
                                  {data.domain && data.domain !== 'self.programming' && data.url && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <LinkIcon className="h-4 w-4" />
                                        <span className="font-medium">{data.domain}</span>
                                        <Button 
                                          variant="link" 
                                          size="sm" 
                                          className="p-0 h-auto ml-auto"
                                          onClick={() => window.open(data.url, '_blank')}
                                        >
                                          <ExternalLink className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-200">
                                  <div className="text-xs text-gray-500 mb-2">
                                    Reply to: <span className="font-medium">{(data as RedditComment).post_title}</span>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {isExpanded 
                                      ? data.content
                                      : getContentPreview(data.content, 300)
                                    }
                                  </p>
                                  {data.content?.length > 300 && (
                                    <Button 
                                      variant="link" 
                                      size="sm" 
                                      className="p-0 h-auto text-orange-600 hover:text-orange-700 mt-2"
                                      onClick={() => toggleItemExpansion(data.id)}
                                    >
                                      {isExpanded ? 'Show less' : 'Read more'}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <Badge variant="outline" className="text-orange-600 border-orange-200">
                                r/{data.subreddit}
                              </Badge>
                              <span>u/{data.author}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(getItemDate(data))}
                              </span>
                              {isPost && (
                                <>
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {(data as RedditPost).num_comments} comments
                                  </span>
                                  <span>
                                    {Math.round((data as RedditPost).upvote_ratio * 100)}% upvoted
                                  </span>
                                </>
                              )}
                              {!isPost && (data as RedditComment).depth > 0 && (
                                <span>Depth: {(data as RedditComment).depth}</span>
                              )}
                            </div>
                            
                            {/* Comments for posts in unified view */}
                            {isPost && feedItem.comments && feedItem.comments.length > 0 && (
                              <div className="mt-6 border-t border-gray-100 pt-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="mb-3 text-gray-600 hover:text-gray-900"
                                  onClick={() => toggleItemExpansion(data.id + '_comments')}
                                >
                                  {expandedItems.has(data.id + '_comments') ? (
                                    <><ChevronUp className="h-4 w-4 mr-1" /> Hide {feedItem.comments.length} comments</>
                                  ) : (
                                    <><ChevronDown className="h-4 w-4 mr-1" /> Show {feedItem.comments.length} comments</>
                                  )}
                                </Button>
                                
                                {expandedItems.has(data.id + '_comments') && (
                                  <div className="space-y-3">
                                    {feedItem.comments.slice(0, 5).map((comment: RedditComment) => (
                                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border-l-2 border-gray-200">
                                        <div className="flex items-start gap-3">
                                          <div className="flex flex-col items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                              <ArrowUp className="h-3 w-3" />
                                            </Button>
                                            <span className="text-xs font-medium">{comment.score}</span>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                              <ArrowDown className="h-3 w-3" />
                                            </Button>
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                                              <span className="font-medium">u/{comment.author}</span>
                                              <span>{formatDate(getItemDate(comment))}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                              {getContentPreview(comment.content, 200)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {feedItem.comments.length > 5 && (
                                      <div className="text-center">
                                        <Button variant="outline" size="sm">
                                          View all {feedItem.comments.length} comments
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Action buttons */}
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyToClipboard(data.content || data.selftext || data.title)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSelectedItem(data)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                              
                              {data.url && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => openRedditLink(data.url)}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Reddit
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {hasMoreResults && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Showing {feedItems.length} of {results?.total || 0} results
                  </p>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={loadMoreResults}
                    disabled={loadingMore || loading}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading More...
                      </>
                    ) : (
                      'Load More Results'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Media Viewer Modal */}
        <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
            {selectedMedia && (
              <div className="relative">
                <DialogHeader className="pb-4">
                  <DialogTitle>Media Viewer</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={selectedMedia.url}
                    alt="Full size media"
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Item Detail Modal */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Badge variant="outline" className="text-orange-600 border-orange-200">r/{selectedItem.subreddit}</Badge>
                    {'title' in selectedItem ? selectedItem.title : 'Comment Details'}
                  </DialogTitle>
                  <DialogDescription>
                    by u/{selectedItem.author} • {formatDate(getItemDate(selectedItem))}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Content */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Content</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedItem.content || (selectedItem as any).selftext || (selectedItem as any).title}
                      </p>
                    </div>
                  </div>

                  {/* Image if available */}
                  {isValidImageUrl((selectedItem as any).thumbnail) && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Media</h4>
                      <div className="relative rounded-lg overflow-hidden">
                        <Image
                          src={(selectedItem as any).thumbnail}
                          alt="Post image"
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">Score</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-700">{selectedItem.score || 0}</p>
                    </div>
                    
                    {'num_comments' in selectedItem && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Comments</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{selectedItem.num_comments || 0}</p>
                      </div>
                    )}
                    
                    {(selectedItem as any).upvote_ratio && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Upvote %</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">
                          {Math.round((selectedItem as any).upvote_ratio * 100)}%
                        </p>
                      </div>
                    )}
                    
                    {'depth' in selectedItem && (selectedItem as any).depth !== undefined && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Depth</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-700">{(selectedItem as any).depth}</p>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Metadata</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-gray-600 font-medium">ID:</span>
                        <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded">{selectedItem.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-gray-600 font-medium">Author:</span>
                        <span className="text-gray-900">u/{selectedItem.author}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <span className="text-gray-600 font-medium">Subreddit:</span>
                        <span className="text-gray-900">r/{selectedItem.subreddit}</span>
                      </div>
                      {'post_title' in selectedItem && (selectedItem as any).post_title && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <span className="text-gray-600 font-medium">Post:</span>
                          <span className="text-gray-900 text-right max-w-xs truncate">{(selectedItem as any).post_title}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Created:</span>
                        <span className="text-gray-900">{formatDate(getItemDate(selectedItem))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => copyToClipboard(selectedItem.content || (selectedItem as any).selftext || (selectedItem as any).title)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Content
                    </Button>
                    
                    {(selectedItem as any).url && (
                      <Button
                        onClick={() => openRedditLink((selectedItem as any).url)}
                        variant="outline"
                        className="flex-1"
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