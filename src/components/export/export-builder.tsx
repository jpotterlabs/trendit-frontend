'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { CollectionJobResponse } from '@/lib/types';
import { api } from '@/lib/api/client';
import { useDashboardStore } from '@/lib/store/dashboard';
import { Download, FileText, Database, Info, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ExportForm {
  jobId: string;
  format: string;
  exportType: 'posts' | 'comments' | 'both';
  fields: string[];
}

const POST_FIELDS = [
  'id', 'title', 'author', 'subreddit', 'score', 'upvote_ratio', 
  'num_comments', 'created_utc', 'url', 'selftext', 'is_nsfw'
];

const COMMENT_FIELDS = [
  'id', 'author', 'body', 'score', 'created_utc', 'parent_id',
  'post_id', 'subreddit', 'depth', 'is_submitter'
];

const EXPORT_FORMATS = [
  { 
    value: 'csv', 
    label: 'CSV', 
    description: 'Comma-separated values for Excel/spreadsheet analysis',
    icon: '📊'
  },
  { 
    value: 'json', 
    label: 'JSON', 
    description: 'JavaScript Object Notation for web applications',
    icon: '{ }'
  },
  { 
    value: 'jsonl', 
    label: 'JSONL', 
    description: 'JSON Lines format for streaming/big data processing',
    icon: '📝'
  },
  { 
    value: 'parquet', 
    label: 'Parquet', 
    description: 'Columnar format optimized for analytics',
    icon: '🗃️'
  }
];

export function ExportBuilder() {
  const { jobs, loadJobs } = useDashboardStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<any[]>([]);

  const form = useForm<ExportForm>({
    defaultValues: {
      jobId: '',
      format: 'csv',
      exportType: 'posts',
      fields: POST_FIELDS,
    },
  });

  const { watch, setValue } = form;
  const selectedJobId = watch('jobId');
  const selectedFormat = watch('format');
  const exportType = watch('exportType');
  const selectedFields = watch('fields');

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    // Update fields when export type changes
    if (exportType === 'posts') {
      setValue('fields', POST_FIELDS);
    } else if (exportType === 'comments') {
      setValue('fields', COMMENT_FIELDS);
    } else {
      setValue('fields', [...POST_FIELDS, ...COMMENT_FIELDS]);
    }
  }, [exportType, setValue]);

  const completedJobs = jobs.filter(job => job.status === 'completed');
  const selectedJob = completedJobs.find(job => job.job_id === selectedJobId);

  const handleFieldToggle = (field: string) => {
    const currentFields = selectedFields || [];
    if (currentFields.includes(field)) {
      setValue('fields', currentFields.filter(f => f !== field));
    } else {
      setValue('fields', [...currentFields, field]);
    }
  };

  const onSubmit = async (data: ExportForm) => {
    if (!data.jobId) {
      toast.error('Please select a collection job');
      return;
    }

    try {
      setIsExporting(true);
      
      let downloadUrl: string;
      const options = {
        fields: data.fields,
      };

      if (data.exportType === 'posts') {
        downloadUrl = await api.exportPosts(data.jobId, data.format, options);
      } else if (data.exportType === 'comments') {
        downloadUrl = await api.exportComments(data.jobId, data.format, options);
      } else {
        // Export both - start with posts
        downloadUrl = await api.exportPosts(data.jobId, data.format, options);
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${data.exportType}-${selectedJob?.subreddits.join('-')}.${data.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to export history
      const exportRecord = {
        id: Date.now(),
        jobId: data.jobId,
        jobName: selectedJob?.subreddits.join(', '),
        format: data.format,
        type: data.exportType,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };
      
      setExportHistory(prev => [exportRecord, ...prev]);
      toast.success('Export completed successfully!');

    } catch (error: any) {
      const message = error.response?.data?.detail || 'Export failed';
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  };

  const availableFields = exportType === 'posts' ? POST_FIELDS : 
                         exportType === 'comments' ? COMMENT_FIELDS : 
                         [...POST_FIELDS, ...COMMENT_FIELDS];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">Export Builder</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export Builder</CardTitle>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Export your collected Reddit data in various formats for analysis, visualization, or archival purposes.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Job Selection */}
                  <FormField
                    control={form.control}
                    name="jobId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Job *</FormLabel>
                        <FormDescription>
                          Select a completed job to export data from
                        </FormDescription>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a completed job..." />
                            </SelectTrigger>
                            <SelectContent>
                              {completedJobs.map((job) => (
                                <SelectItem key={job.job_id} value={job.job_id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{job.subreddits.join(', ')}</span>
                                    <div className="flex items-center space-x-2 ml-2">
                                      <Badge variant="outline">
                                        {job.collected_posts} posts
                                      </Badge>
                                      <Badge variant="outline">
                                        {job.collected_comments} comments
                                      </Badge>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Export Type */}
                  <FormField
                    control={form.control}
                    name="exportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Export Type *</FormLabel>
                        <FormDescription>
                          Choose what type of data to export
                        </FormDescription>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="posts">
                                <div className="flex items-center">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Posts Only
                                </div>
                              </SelectItem>
                              <SelectItem value="comments">
                                <div className="flex items-center">
                                  <Database className="mr-2 h-4 w-4" />
                                  Comments Only
                                </div>
                              </SelectItem>
                              <SelectItem value="both">
                                <div className="flex items-center">
                                  <Download className="mr-2 h-4 w-4" />
                                  Both Posts & Comments
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Format Selection */}
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Export Format *</FormLabel>
                        <FormDescription>
                          Choose the file format for your export
                        </FormDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                          {EXPORT_FORMATS.map((format) => (
                            <Card
                              key={format.value}
                              className={`cursor-pointer transition-all ${
                                field.value === format.value
                                  ? 'ring-2 ring-orange-500 bg-orange-50'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => field.onChange(format.value)}
                            >
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl mb-2">{format.icon}</div>
                                <div className="font-medium">{format.label}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {format.description}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Field Selection */}
                  <FormItem>
                    <FormLabel>Fields to Export</FormLabel>
                    <FormDescription>
                      Select which data fields to include in your export
                    </FormDescription>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setValue('fields', availableFields)}
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setValue('fields', [])}
                        >
                          Clear All
                        </Button>
                        <span className="text-sm text-gray-500">
                          ({selectedFields?.length || 0} selected)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                        {availableFields.map((field) => (
                          <div key={field} className="flex items-center space-x-2">
                            <Checkbox
                              id={field}
                              checked={selectedFields?.includes(field) || false}
                              onCheckedChange={() => handleFieldToggle(field)}
                            />
                            <label
                              htmlFor={field}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {field}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormItem>

                  {/* Job Summary */}
                  {selectedJob && (
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Export Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Job:</span>
                            <div className="font-medium">{selectedJob.subreddits.join(', ')}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Posts:</span>
                            <div className="font-medium">{selectedJob.collected_posts}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Comments:</span>
                            <div className="font-medium">{selectedJob.collected_comments}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Fields:</span>
                            <div className="font-medium">{selectedFields?.length || 0}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isExporting || !selectedJobId}>
                      {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isExporting ? 'Preparing Export...' : 'Export Data'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
            </CardHeader>
            <CardContent>
              {exportHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Download className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No exports yet</p>
                  <p className="text-sm">Your export history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map((export_) => (
                    <div
                      key={export_.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{export_.jobName}</span>
                          <Badge variant="outline">{export_.format.toUpperCase()}</Badge>
                          <Badge variant="secondary">{export_.type}</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(export_.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}