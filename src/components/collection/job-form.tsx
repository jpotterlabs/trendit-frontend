'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreateJobForm, SortType, TimeFilter } from '@/lib/types';
import { api } from '@/lib/api/client';
import { useDashboardStore } from '@/lib/store/dashboard';
import { Loader2, Plus, X, Info } from 'lucide-react';
import { toast } from 'sonner';

export function JobForm() {
  const router = useRouter();
  const { loadJobs } = useDashboardStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subredditInput, setSubredditInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  
  const form = useForm<CreateJobForm>({
    defaultValues: {
      subreddits: [],
      sort_types: [SortType.HOT],
      time_filters: [TimeFilter.WEEK],
      post_limit: 100,
      comment_limit: 50,
      max_comment_depth: 3,
      keywords: [],
      min_score: 0,
      min_upvote_ratio: 0.0,
      exclude_nsfw: true,
      anonymize_users: true,
    },
  });

  const { watch, setValue } = form;
  const subreddits = watch('subreddits');
  const keywords = watch('keywords');
  const sortTypes = watch('sort_types');
  const timeFilters = watch('time_filters');

  const addSubreddit = () => {
    if (subredditInput.trim() && !subreddits.includes(subredditInput.trim())) {
      setValue('subreddits', [...subreddits, subredditInput.trim()]);
      setSubredditInput('');
    }
  };

  const removeSubreddit = (subreddit: string) => {
    setValue('subreddits', subreddits.filter(s => s !== subreddit));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setValue('keywords', [...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setValue('keywords', keywords.filter(k => k !== keyword));
  };

  const toggleSortType = (sortType: SortType) => {
    if (sortTypes.includes(sortType)) {
      setValue('sort_types', sortTypes.filter(s => s !== sortType));
    } else {
      setValue('sort_types', [...sortTypes, sortType]);
    }
  };

  const toggleTimeFilter = (timeFilter: TimeFilter) => {
    if (timeFilters.includes(timeFilter)) {
      setValue('time_filters', timeFilters.filter(t => t !== timeFilter));
    } else {
      setValue('time_filters', [...timeFilters, timeFilter]);
    }
  };

  const onSubmit = async (data: CreateJobForm) => {
    if (data.subreddits.length === 0) {
      toast.error('Please add at least one subreddit');
      return;
    }

    if (data.sort_types.length === 0) {
      toast.error('Please select at least one sort type');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const job = await api.createJob(data);
      
      toast.success('Collection job created successfully!');
      loadJobs(); // Refresh jobs list
      router.push(`/dashboard/jobs/${job.job_id}`);
      
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create collection job';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Collection Job</CardTitle>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Configure your Reddit data collection parameters. Jobs will run in the background
              and collect posts and comments based on your specifications.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Subreddits */}
              <FormItem>
                <FormLabel>Subreddits *</FormLabel>
                <FormDescription>
                  Add the subreddits you want to collect data from (without r/ prefix)
                </FormDescription>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., python, javascript, reactjs"
                      value={subredditInput}
                      onChange={(e) => setSubredditInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubreddit())}
                    />
                    <Button type="button" onClick={addSubreddit} size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subreddits.map((subreddit) => (
                      <Badge key={subreddit} variant="secondary" className="px-2 py-1">
                        r/{subreddit}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => removeSubreddit(subreddit)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormItem>

              {/* Sort Types */}
              <FormItem>
                <FormLabel>Sort Types *</FormLabel>
                <FormDescription>
                  Select how posts should be sorted in each subreddit
                </FormDescription>
                <div className="flex flex-wrap gap-2">
                  {Object.values(SortType).map((sortType) => (
                    <Badge
                      key={sortType}
                      variant={sortTypes.includes(sortType) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSortType(sortType)}
                    >
                      {sortType}
                    </Badge>
                  ))}
                </div>
              </FormItem>

              {/* Time Filters */}
              <FormItem>
                <FormLabel>Time Filters</FormLabel>
                <FormDescription>
                  Time periods for filtering posts (applies to 'top' sort type)
                </FormDescription>
                <div className="flex flex-wrap gap-2">
                  {Object.values(TimeFilter).map((timeFilter) => (
                    <Badge
                      key={timeFilter}
                      variant={timeFilters.includes(timeFilter) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTimeFilter(timeFilter)}
                    >
                      {timeFilter}
                    </Badge>
                  ))}
                </div>
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Post Limit */}
                <FormField
                  control={form.control}
                  name="post_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Limit</FormLabel>
                      <FormDescription>Maximum posts to collect per subreddit</FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Comment Limit */}
                <FormField
                  control={form.control}
                  name="comment_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment Limit</FormLabel>
                      <FormDescription>Maximum comments to collect per post</FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="1000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Comment Depth */}
                <FormField
                  control={form.control}
                  name="max_comment_depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Comment Depth</FormLabel>
                      <FormDescription>Maximum depth of comment threads</FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Min Score */}
                <FormField
                  control={form.control}
                  name="min_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Score</FormLabel>
                      <FormDescription>Only collect posts with this score or higher</FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Keywords */}
              <FormItem>
                <FormLabel>Keywords (Optional)</FormLabel>
                <FormDescription>
                  Filter posts that contain these keywords in title or content
                </FormDescription>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., machine learning, AI, tutorial"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="px-2 py-1">
                        {keyword}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => removeKeyword(keyword)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormItem>

              {/* Additional Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="exclude_nsfw"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Exclude NSFW Content</FormLabel>
                        <FormDescription className="text-sm">
                          Skip posts marked as NSFW
                        </FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anonymize_users"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Anonymize Users</FormLabel>
                        <FormDescription className="text-sm">
                          Replace usernames with anonymous IDs
                        </FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/jobs')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Creating Job...' : 'Create Collection Job'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}