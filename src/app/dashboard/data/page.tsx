'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Loader2, 
  Search, 
  Database, 
  Calendar, 
  Users, 
  MessageSquare, 
  ExternalLink, 
  Copy, 
  ThumbsUp,
  Filter,
  RefreshCw,
  ArrowRight,
  ChevronLeft,
  Folder,
  FileText
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { useDashboardStore } from '@/lib/store/dashboard';
import { format } from 'date-fns';

export default function DataBrowserPage() {
  const { jobs, loadJobs } = useDashboardStore();
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [minScore, setMinScore] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (selectedJob) {
      loadJobData();
    }
  }, [selectedJob, activeTab]);

  const loadJobData = async () => {
    if (!selectedJob) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Query posts or comments for the selected job
      const filters: Record<string, any> = {
        job_ids: [selectedJob.job_id],
        limit: 100, // Load more items for browsing
        sort_by: sortBy,
        sort_order: 'desc' as const
      };

      if (minScore) {
        filters.min_score = minScore;
      }

      let apiResponse;
      if (activeTab === 'posts') {
        apiResponse = await api.queryPosts(filters);
      } else {
        apiResponse = await api.queryComments(filters);
      }
      
      console.log('📊 Job Data Response:', apiResponse);
      
      const responseData = apiResponse.data || apiResponse.posts || apiResponse.comments || apiResponse.results || apiResponse;
      const resultArray = Array.isArray(responseData) ? responseData : (responseData?.data || responseData?.results || []);
      
      setData(resultArray || []);
    } catch (err: any) {
      console.error('Job Data API error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load job data');
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
    setData([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
    setData([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(searchLower)) ||
      (item.content && item.content.toLowerCase().includes(searchLower)) ||
      (item.author && item.author.toLowerCase().includes(searchLower)) ||
      (item.subreddit && item.subreddit.toLowerCase().includes(searchLower))
    );
  });

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openRedditLink = (url: string) => {
    window.open(url, '_blank');
  };

  // Show job selection if no job is selected
  if (!selectedJob) {
    return (
      <DashboardLayout title="Data Browser" description="Browse and explore your collected Reddit data">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Select a Collection</h1>
              <p className="text-gray-600">Choose a collection job to browse its data</p>
            </div>
            <Button onClick={loadJobs} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.filter(job => job.status === 'completed').map((job) => (
              <Card 
                key={job.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200"
                onClick={() => handleJobSelect(job)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <Database className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">Collection #{job.id}</CardTitle>
                      <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        Completed
                      </Badge>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Subreddits */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Subreddits:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.subreddits.slice(0, 3).map((subreddit) => (
                        <Badge key={subreddit} variant="secondary" className="text-xs">
                          r/{subreddit}
                        </Badge>
                      ))}
                      {job.subreddits.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.subreddits.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>{job.collected_posts} posts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span>{job.collected_comments} comments</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Collected {formatDate(job.completed_at || job.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {jobs.filter(job => job.status === 'completed').length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Collections</h3>
                <p className="text-gray-500 mb-4">
                  You need completed collection jobs to browse data. Create a collection job first.
                </p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <a href="/dashboard/jobs/new">
                    <Database className="mr-2 h-4 w-4" />
                    Create Collection Job
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Show data browser for selected job
  return (
    <DashboardLayout title={`Collection #${selectedJob.id}`} description="Browse collected Reddit data">
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToJobs} variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Folder className="h-5 w-5 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Collection #{selectedJob.id}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{selectedJob.collected_posts} posts</span>
                  <span>{selectedJob.collected_comments} comments</span>
                  <span>from {selectedJob.subreddits.length} subreddits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Type Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Posts ({selectedJob.collected_posts})
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({selectedJob.collected_comments})
              </TabsTrigger>
            </TabsList>

            <Button onClick={loadJobData} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <TabsContent value="posts" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Browse Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search titles, content, authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="score">Score</SelectItem>
                        <SelectItem value="created_at">Date</SelectItem>
                        <SelectItem value="num_comments">Comments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Min Score</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minScore || ''}
                      onChange={(e) => setMinScore(parseInt(e.target.value) || undefined)}
                    />
                  </div>
                </div>
                {(searchTerm || minScore) && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Showing {filteredData.length} of {data.length} posts
                    </span>
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setMinScore(undefined);
                      }}
                      variant="ghost" 
                      size="sm"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Browse Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search comments, authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="score">Score</SelectItem>
                        <SelectItem value="created_at">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Min Score</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minScore || ''}
                      onChange={(e) => setMinScore(parseInt(e.target.value) || undefined)}
                    />
                  </div>
                </div>
                {(searchTerm || minScore) && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Showing {filteredData.length} of {data.length} comments
                    </span>
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setMinScore(undefined);
                      }}
                      variant="ghost" 
                      size="sm"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Loading {activeTab}...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && currentItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {activeTab === 'posts' ? 'Posts' : 'Comments'} 
                  <span className="text-gray-500 ml-2">({filteredData.length})</span>
                </CardTitle>
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentItems.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    {activeTab === 'posts' ? (
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 mr-4">
                            {item.title || 'Untitled Post'}
                          </h3>
                          <Badge variant="outline">r/{item.subreddit}</Badge>
                        </div>
                        {item.content && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {item.content.substring(0, 200)}...
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>by u/{item.author}</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {item.score || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {item.num_comments || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">r/{item.subreddit}</Badge>
                          <span className="text-xs text-gray-500">Score: {item.score || 0}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                          {item.content || 'No content'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>by u/{item.author}</span>
                          {item.post_title && (
                            <span className="flex items-center gap-1 truncate max-w-xs">
                              <span>in:</span>
                              <span className="truncate">"{item.post_title}"</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <Button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                  </div>
                  
                  <Button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && currentItems.length === 0 && data.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
              <p className="text-gray-500">
                This collection doesn't have any {activeTab} yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* No Results After Filter */}
        {!loading && currentItems.length === 0 && data.length > 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filters.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setMinScore(undefined);
                }}
                variant="outline"
              >
                Clear all filters
              </Button>
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
                        {selectedItem.content || 'No content available'}
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
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(selectedItem.content || '')}
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