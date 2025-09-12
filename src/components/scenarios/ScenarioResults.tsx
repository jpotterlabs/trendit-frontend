'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  MessageSquare, 
  TrendingUp, 
  User, 
  Clock,
  Eye,
  ThumbsUp,
  Download,
  Copy,
  Image as ImageIcon
} from 'lucide-react';

interface RedditPost {
  reddit_id: string;
  title: string;
  selftext: string;
  url: string;
  permalink: string;
  subreddit: string;
  author: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  awards_received: number;
  is_nsfw: boolean;
  is_spoiler: boolean;
  is_stickied: boolean;
  post_hint?: string;
  created_utc: string;
  collected_at: string;
}

interface RedditComment {
  reddit_id: string;
  body: string;
  author: string;
  score: number;
  created_utc: string;
  subreddit: string;
  post_title?: string;
  permalink: string;
}

interface RedditUser {
  username: string;
  post_count: number;
  total_score: number;
  avg_score: number;
  subreddits: string[];
}

interface ScenarioResult {
  scenario: string;
  description: string;
  results: (RedditPost | RedditComment | RedditUser)[];
  count: number;
  execution_time_ms: number;
}

interface ScenarioResultsProps {
  results: ScenarioResult;
  onExport?: () => void;
}

export function ScenarioResults({ results, onExport }: ScenarioResultsProps) {
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const formatTimeAgo = (utcString: string) => {
    try {
      const date = new Date(utcString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return utcString;
    }
  };

  const getRedditUrl = (permalink: string) => `https://reddit.com${permalink}`;

  const renderPostResult = (post: RedditPost, index: number) => (
    <Card key={post.reddit_id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg leading-snug mb-2 hover:text-orange-600 transition-colors">
              <a 
                href={getRedditUrl(post.permalink)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-2"
              >
                {post.title}
                <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0" />
              </a>
            </CardTitle>
            
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <Badge variant="outline" className="text-xs">
                r/{post.subreddit}
              </Badge>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                u/{post.author}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(post.created_utc)}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">{post.score}</span>
                <span className="text-gray-500">({Math.round(post.upvote_ratio * 100)}% upvoted)</span>
              </div>
              
              <div className="flex items-center gap-1 text-blue-600">
                <MessageSquare className="h-4 w-4" />
                <span>{post.num_comments} comments</span>
              </div>

              {post.post_hint === 'image' && (
                <div className="flex items-center gap-1 text-purple-600">
                  <ImageIcon className="h-4 w-4" />
                  <span>Image</span>
                </div>
              )}

              {post.awards_received > 0 && (
                <Badge variant="secondary" className="text-xs">
                  🏆 {post.awards_received} awards
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {post.url !== getRedditUrl(post.permalink) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(post.url, '_blank')}
              >
                <Eye className="h-3 w-3 mr-1" />
                View Content
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(getRedditUrl(post.permalink))}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Link
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {post.selftext && (
        <CardContent className="pt-0">
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="line-clamp-3">{post.selftext}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );

  const renderCommentResult = (comment: RedditComment, index: number) => (
    <Card key={comment.reddit_id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <Badge variant="outline" className="text-xs">
                r/{comment.subreddit}
              </Badge>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                u/{comment.author}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(comment.created_utc)}
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ThumbsUp className="h-4 w-4" />
                <span className="font-medium">{comment.score}</span>
              </div>
            </div>
            
            {comment.post_title && (
              <CardDescription className="text-xs mb-2">
                Comment on: "{comment.post_title}"
              </CardDescription>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyToClipboard(getRedditUrl(comment.permalink))}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy Link
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <p className="whitespace-pre-wrap">{comment.body}</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserResult = (user: RedditUser, index: number) => (
    <Card key={user.username} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-medium">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-lg">u/{user.username}</CardTitle>
              <CardDescription>
                Active in {user.subreddits.length} subreddit{user.subreddits.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{user.total_score}</div>
            <div className="text-xs text-gray-500">total karma</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="text-lg font-semibold">{user.post_count}</div>
            <div className="text-xs text-gray-500">posts</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{Math.round(user.avg_score)}</div>
            <div className="text-xs text-gray-500">avg score</div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Active Subreddits</div>
          <div className="flex flex-wrap gap-1">
            {user.subreddits.slice(0, 5).map(subreddit => (
              <Badge key={subreddit} variant="secondary" className="text-xs">
                r/{subreddit}
              </Badge>
            ))}
            {user.subreddits.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{user.subreddits.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResult = (result: RedditPost | RedditComment | RedditUser, index: number) => {
    // Type detection based on available properties
    if ('title' in result && 'subreddit' in result && 'permalink' in result) {
      return renderPostResult(result as RedditPost, index);
    }
    if ('body' in result && 'author' in result) {
      return renderCommentResult(result as RedditComment, index);
    }
    if ('username' in result && 'post_count' in result) {
      return renderUserResult(result as RedditUser, index);
    }
    
    // Fallback for unknown result types
    return (
      <Card key={index} className="mb-4">
        <CardContent className="p-4">
          <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{results.description}</h3>
          <p className="text-sm text-gray-500">
            {results.count} result{results.count !== 1 ? 's' : ''} • 
            Executed in {Math.round(results.execution_time_ms)}ms
          </p>
        </div>
        
        <div className="flex gap-2">
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
          >
            <Copy className="h-3 w-3 mr-1" />
            Raw Data
          </Button>
        </div>
      </div>

      <Separator />

      {/* Results List */}
      <div className="space-y-4">
        {results.results.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No results found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          results.results.map((result, index) => renderResult(result, index))
        )}
      </div>
    </div>
  );
}