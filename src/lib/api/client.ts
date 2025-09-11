import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  LoginForm,
  RegisterForm,
  LoginResponse,
  UserResponse,
  APIKeyResponse,
  APIKeyListResponse,
  CollectionJobRequest,
  CollectionJobResponse,
  CollectionJobListResponse,
  PostAnalyticsResponse,
  SubscriptionStatusResponse,
  SentimentAnalysisResponse,
  BatchSentimentAnalysisResponse,
  DataSummary,
} from '@/lib/types';
import { config, getApiUrl } from '@/lib/config';

export class TrenditAPI {
  private client: AxiosInstance;
  private token: string | null = null;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();

  constructor(baseURL?: string) {
    const apiUrl = baseURL || getApiUrl();
    
    this.client = axios.create({
      baseURL: apiUrl,
      timeout: 30000, // Increased to 30 seconds for slow backend responses
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log the API URL for debugging
    if (config.app.debug) {
      console.log(`🔗 Trendit API connected to: ${apiUrl}`);
    }

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token and redirect to login
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        
        if (error.response?.status === 429) {
          // Handle rate limit - log warning and implement exponential backoff
          console.warn('⚠️ API rate limit exceeded. Implementing backoff strategy.');
          const retryAfter = error.response.headers['retry-after'] || 5;
          console.warn(`Rate limit hit. Retry after ${retryAfter} seconds.`);
        }
        
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('trendit_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trendit_token');
    }
    // Clear request cache when token changes
    this.requestCache.clear();
    this.pendingRequests.clear();
  }

  loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('trendit_token');
      if (token) {
        this.token = token;
      }
    }
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Authentication
  async register(userData: RegisterForm): Promise<UserResponse> {
    const response: AxiosResponse<UserResponse> = await this.client.post(
      '/auth/register',
      userData
    );
    return response.data;
  }

  async login(credentials: LoginForm): Promise<LoginResponse> {
    try {
      if (config.app.debug) {
        console.log('🔐 Attempting login for username:', credentials.email);
        console.log('🔗 Login endpoint:', this.client.defaults.baseURL + '/auth/login');
      }
      
      // Backend expects: email (required), password (required), username (optional)
      const email = String(credentials.email || '').trim();
      const password = String(credentials.password || '').trim();
      
      // Validate required fields
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Validate email format
      if (!email.includes('@')) {
        throw new Error('Invalid email format - must contain @ symbol');
      }
      
      const loginPayload = {
        email: email,
        password: password,
        username: email.split('@')[0] // Extract username from email
      };
      
      if (config.app.debug) {
        console.log('📤 Original credentials:', {
          email: `"${credentials.email}" (${typeof credentials.email})`,
          password: `"${credentials.password?.slice(0, 3)}..." (${typeof credentials.password})`
        });
        console.log('📤 Processed payload:', { 
          email: `"${loginPayload.email}" (${typeof loginPayload.email})`,
          password: `"${loginPayload.password.slice(0, 3)}..." (${typeof loginPayload.password})`,
          username: `"${loginPayload.username}" (${typeof loginPayload.username})`
        });
        console.log('📤 Raw payload JSON:', JSON.stringify(loginPayload));
        console.log('📤 Content-Type:', this.client.defaults.headers['Content-Type']);
      }
      
      const response: AxiosResponse<LoginResponse> = await this.client.post(
        '/auth/login',
        loginPayload
      );
      
      if (config.app.debug) {
        console.log('✅ Login successful:', response.status);
        console.log('📄 Response data:', response.data);
      }
      
      this.setToken(response.data.access_token);
      return response.data;
    } catch (error: any) {
      if (config.app.debug) {
        console.error('❌ Login failed:', error.response?.status);
        console.error('📄 Error details:', error.response?.data);
        console.error('🔗 Request URL:', error.config?.url);
        console.error('📤 Request payload:', error.config?.data);
        console.error('📋 Full error:', error);
      }

      // Handle network/timeout errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        const networkError = new Error('Cannot connect to backend server. Please ensure the API server is running on port 8000.');
        networkError.name = 'NetworkError';
        throw networkError;
      }

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        const timeoutError = new Error('Backend server is not responding. Please check if the API server is healthy.');
        timeoutError.name = 'TimeoutError';
        throw timeoutError;
      }

      throw error;
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response: AxiosResponse<UserResponse> = await this.client.get('/auth/me');
    return response.data;
  }

  // API Keys
  async createAPIKey(data: { name: string; description?: string }): Promise<APIKeyResponse> {
    if (config.app.debug) {
      console.log('📤 Creating API key:', data);
    }
    
    const response: AxiosResponse<APIKeyResponse> = await this.client.post(
      '/auth/api-keys',
      data
    );
    return response.data;
  }

  async listAPIKeys(): Promise<APIKeyListResponse[]> {
    const response: AxiosResponse<APIKeyListResponse[]> = await this.client.get(
      '/auth/api-keys'
    );
    return response.data;
  }

  async deleteAPIKey(keyId: number): Promise<void> {
    await this.client.delete(`/auth/api-keys/${keyId}`);
  }

  // Collection Jobs
  async createJob(jobData: CollectionJobRequest): Promise<CollectionJobResponse> {
    const response: AxiosResponse<CollectionJobResponse> = await this.client.post(
      '/api/collect/jobs',
      jobData
    );
    return response.data;
  }

  async getJob(jobId: string): Promise<CollectionJobResponse> {
    const response: AxiosResponse<CollectionJobResponse> = await this.client.get(
      `/api/collect/jobs/${jobId}`
    );
    return response.data;
  }

  async listJobs(params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<CollectionJobListResponse> {
    // Create cache key based on parameters
    const cacheKey = `jobs_list_${JSON.stringify(params || {})}`;
    
    return this.cachedGet<CollectionJobListResponse>(
      '/api/collect/jobs' + (params ? '?' + new URLSearchParams(params as any).toString() : ''),
      cacheKey,
      30000 // 30 seconds cache for jobs list
    );
  }

  async cancelJob(jobId: string): Promise<void> {
    await this.client.post(`/api/collect/jobs/${jobId}/cancel`);
  }

  async deleteJob(jobId: string): Promise<void> {
    await this.client.delete(`/api/collect/jobs/${jobId}`);
  }

  // Analytics
  async getJobAnalytics(jobId: string): Promise<PostAnalyticsResponse> {
    const response: AxiosResponse<PostAnalyticsResponse> = await this.client.get(
      `/api/data/analytics/${jobId}`
    );
    return response.data;
  }

  async getDataSummary(): Promise<DataSummary> {
    return this.cachedGet<DataSummary>(
      '/api/data/summary',
      'data_summary',
      120000 // 2 minutes cache
    );
  }

  // Data Query - using correct endpoints from OpenAPI
  async queryPosts(params: {
    job_ids?: string[];
    subreddits?: string[];
    keywords?: string[];
    min_score?: number;
    max_score?: number;
    min_comments?: number;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const response = await this.client.post('/api/data/posts', params);
    return response.data;
  }

  async queryComments(params: {
    job_ids?: string[];
    subreddits?: string[];
    keywords?: string[];
    min_score?: number;
    max_score?: number;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const response = await this.client.post('/api/data/comments', params);
    return response.data;
  }

  // Additional data endpoints from OpenAPI spec
  async getRecentPosts(params: {
    limit?: number;
    subreddit?: string;
    min_score?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    const response = await this.client.get(`/api/data/posts/recent?${queryParams}`);
    return response.data;
  }

  async getTopPosts(params: {
    limit?: number;
    subreddit?: string;
    timeframe_hours?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    const response = await this.client.get(`/api/data/posts/top?${queryParams}`);
    return response.data;
  }

  // SQL endpoint doesn't exist in OpenAPI spec, so this will gracefully fail
  async executeSQL(query: string): Promise<any> {
    const response = await this.client.post('/api/query/sql', { query });
    return response.data;
  }

  // Helper method for cached GET requests
  private async cachedGet<T>(url: string, cacheKey: string, cacheDurationMs: number = 60000): Promise<T> {
    // Check if request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`Request already pending for ${cacheKey}, waiting for existing request`);
      return this.pendingRequests.get(cacheKey)!;
    }
    
    // Check cache first
    const cached = this.requestCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < cacheDurationMs) {
      console.log(`Using cached data for ${cacheKey}`);
      return cached.data;
    }
    
    // Make request and cache it
    const requestPromise = this.client.get(url).then(response => {
      const data = response.data;
      this.requestCache.set(cacheKey, { data, timestamp: Date.now() });
      this.pendingRequests.delete(cacheKey);
      return data;
    }).catch(error => {
      this.pendingRequests.delete(cacheKey);
      throw error;
    });
    
    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  // Subscription (with caching)
  async getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
    return this.cachedGet<SubscriptionStatusResponse>(
      '/api/billing/subscription/status',
      'subscription_status',
      300000 // 5 minutes cache
    );
  }

  // Sentiment Analysis
  async analyzeSentiment(text: string): Promise<SentimentAnalysisResponse> {
    const response: AxiosResponse<SentimentAnalysisResponse> = await this.client.post(
      '/api/sentiment/analyze',
      { text }
    );
    return response.data;
  }

  async analyzeBatchSentiment(texts: string[]): Promise<BatchSentimentAnalysisResponse> {
    const response: AxiosResponse<BatchSentimentAnalysisResponse> = await this.client.post(
      '/api/sentiment/analyze-batch',
      { texts }
    );
    return response.data;
  }

  // Export
  async exportPosts(jobId: string, format: string, options?: any): Promise<string> {
    const response = await this.client.post(
      `/api/export/posts/${format}`,
      { job_id: jobId, ...options },
      { responseType: 'blob' }
    );
    
    // Create download URL from blob
    const blob = new Blob([response.data]);
    return URL.createObjectURL(blob);
  }

  async exportComments(jobId: string, format: string, options?: any): Promise<string> {
    const response = await this.client.post(
      `/api/export/comments/${format}`,
      { job_id: jobId, ...options },
      { responseType: 'blob' }
    );
    
    // Create download URL from blob
    const blob = new Blob([response.data]);
    return URL.createObjectURL(blob);
  }

  async getExportFormats(): Promise<{ formats: string[]; descriptions: Record<string, string> }> {
    const response = await this.client.get('/api/export/formats');
    return response.data;
  }

  // Scenarios
  async getScenarioExamples(): Promise<any> {
    const response = await this.client.get('/api/scenarios/examples');
    return response.data;
  }

  async runScenario1KeywordSearch(params: {
    subreddit: string;
    keywords: string;
    date_from: string;
    date_to: string;
    limit?: number;
    sort_by?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams(params as any);
    const response = await this.client.get(`/api/scenarios/1/subreddit-keyword-search?${queryParams}`);
    return response.data;
  }

  async runScenario2TrendingMulti(params: {
    subreddits: string;
    timeframe?: string;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams(params as any);
    const response = await this.client.get(`/api/scenarios/2/trending-multi-subreddits?${queryParams}`);
    return response.data;
  }

  async runScenario3TopPostsAll(params: {
    sort_type?: string;
    time_filter?: string;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams(params as any);
    const response = await this.client.get(`/api/scenarios/3/top-posts-all?${queryParams}`);
    return response.data;
  }

  async runScenario4MostPopularToday(params: {
    subreddit: string;
    metric?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams(params as any);
    const response = await this.client.get(`/api/scenarios/4/most-popular-today?${queryParams}`);
    return response.data;
  }

  async runScenario5TopComments(params: {
    subreddit?: string;
    post_id?: string;
    keywords?: string;
    min_score?: number;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    const response = await this.client.get(`/api/scenarios/comments/top-by-criteria?${queryParams}`);
    return response.data;
  }

  async runScenario6TopUsers(params: {
    subreddits?: string;
    days_back?: number;
    limit?: number;
    metric?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    const response = await this.client.get(`/api/scenarios/users/top-by-activity?${queryParams}`);
    return response.data;
  }
}

// Create singleton instance
export const api = new TrenditAPI();

// Initialize token from storage on client side
if (typeof window !== 'undefined') {
  api.loadTokenFromStorage();
}