// API Response Types
export interface UserResponse {
  id: number;
  email: string;
  username?: string;
  is_active: boolean;
  subscription_status: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginResponse extends Token {
  user: UserResponse;
}

export interface APIKeyResponse {
  id: number;
  name: string;
  key: string;
  created_at: string;
  expires_at?: string;
}

export interface APIKeyListResponse {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
}

// Collection Job Types
export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum SortType {
  HOT = 'hot',
  NEW = 'new',
  TOP = 'top',
  RISING = 'rising',
  CONTROVERSIAL = 'controversial',
}

export enum TimeFilter {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all',
}

export interface CollectionJobRequest {
  subreddits: string[];
  sort_types?: SortType[];
  time_filters?: TimeFilter[];
  post_limit?: number;
  comment_limit?: number;
  max_comment_depth?: number;
  keywords?: string[];
  min_score?: number;
  min_upvote_ratio?: number;
  date_from?: string;
  date_to?: string;
  exclude_nsfw?: boolean;
  anonymize_users?: boolean;
}

export interface CollectionJobResponse {
  id: number;
  job_id: string;
  status: JobStatus;
  progress: number;
  total_expected: number;
  collected_posts: number;
  collected_comments: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  subreddits: string[];
  post_limit: number;
}

export interface CollectionJobListResponse {
  jobs: CollectionJobResponse[];
  total: number;
  page: number;
  per_page: number;
}

// Analytics Types
export interface PostAnalyticsResponse {
  total_posts: number;
  unique_subreddits: number;
  unique_authors: number;
  date_range: {
    earliest: string;
    latest: string;
  };
  score_stats: {
    mean: number;
    median: number;
    max: number;
    min: number;
  };
  engagement_stats: {
    average_comments: number;
    average_upvote_ratio: number;
  };
  content_distribution: {
    [key: string]: number;
  };
  top_posts: any[];
  subreddit_breakdown: {
    [key: string]: number;
  };
}

export interface DataSummary {
  total_posts: number;
  total_comments: number;
  date_range: {
    earliest: string;
    latest: string;
  };
  subreddit_breakdown: {
    [key: string]: {
      posts: number;
      comments: number;
    };
  };
  top_keywords: string[];
  average_score: number;
  engagement_rate: number;
}

// Subscription Types
export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export interface SubscriptionStatusResponse {
  tier: string;
  status: string;
  current_period_end?: string;
  next_billed_at?: string;
  price_per_month: number;
  currency: string;
  limits: {
    [key: string]: number;
  };
  current_usage: {
    [key: string]: number;
  };
  usage_percentage: {
    [key: string]: number;
  };
  is_trial: boolean;
  trial_end_date?: string;
  customer_portal_url?: string;
}

// Billing & Checkout Types
export interface SubscriptionTiersResponse {
  tiers: {
    [key: string]: {
      name: string;
      price: number;
      currency: string;
      interval: string;
      features: string[];
      limits: {
        api_calls_per_month: number;
        exports_per_month: number;
        sentiment_analysis_per_month: number;
        data_retention_days: number;
      };
    };
  };
}

export interface CheckoutRequest {
  tier: SubscriptionTier;
  trial_days?: number;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutResponse {
  checkout_url: string;
  tier: string;
  price: number;
  trial_days?: number;
  expires_at?: string;
}

export interface UpgradeSubscriptionRequest {
  new_tier: SubscriptionTier;
}

export interface UsageAnalyticsResponse {
  billing_period: {
    start: string;
    end: string;
  };
  daily_usage: {
    [date: string]: {
      [usage_type: string]: number;
    };
  };
  endpoint_usage: {
    [endpoint: string]: number;
  };
  total_usage_this_period: {
    [usage_type: string]: number;
  };
  usage_trends: {
    average_daily_usage: {
      [usage_type: string]: number;
    };
    projected_monthly_usage: {
      [usage_type: string]: number;
    };
    busiest_day?: string;
    most_used_endpoint?: string;
  };
}

// Sentiment Analysis Types
export interface SentimentAnalysisResponse {
  text: string;
  sentiment_score?: number;
  sentiment_label: string;
  analysis_time_ms: number;
}

export interface BatchSentimentAnalysisResponse {
  results: SentimentAnalysisResponse[];
  stats: any;
  total_time_ms: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface CreateJobForm extends CollectionJobRequest {
  name?: string;
  description?: string;
}

// UI State Types
export interface DashboardState {
  user: UserResponse | null;
  subscription: SubscriptionStatusResponse | null;
  jobs: CollectionJobResponse[];
  isLoading: boolean;
  error: string | null;
}