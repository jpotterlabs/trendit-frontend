import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponse, LoginResponse, SubscriptionStatusResponse } from '@/lib/types';
import { api } from '@/lib/api/client';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  apiKey: string | null;
  subscription: SubscriptionStatusResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithAuth0: (accessToken: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  loadSubscription: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      apiKey: null,
      subscription: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Step 1: Login with username/email/password to get JWT token
          const response: LoginResponse = await api.login({ email, password });
          
          // Step 2: Use JWT token to create API key
          api.setToken(response.access_token);
          const apiKeyResponse = await api.createAPIKey({
            name: 'Frontend API Key',
            description: 'Auto-generated API key for frontend access'
          });
          
          // Step 3: Switch to using API key for all future requests
          api.setToken(apiKeyResponse.key);
          
          set({
            user: response.user,
            token: response.access_token,
            apiKey: apiKeyResponse.key,
            isAuthenticated: true,
            isLoading: false,
          });

          // Load subscription data after login (now using API key)
          // Skip loading user profile for now - endpoint doesn't exist yet
          get().loadSubscription();
          
        } catch (error: any) {
          let message = 'Login failed';
          
          if (error.response?.data?.detail) {
            // Handle different error formats
            if (typeof error.response.data.detail === 'string') {
              message = error.response.data.detail;
            } else if (Array.isArray(error.response.data.detail)) {
              // Handle validation errors (array of error objects)
              message = error.response.data.detail.map((err: any) => err.msg || err.message || 'Validation error').join(', ');
            } else {
              message = 'Login validation failed';
            }
          } else if (error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error.message) {
            message = error.message;
          }
          
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      loginWithAuth0: async (accessToken: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Get the API base URL from environment or use default
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 
                           process.env.NEXT_PUBLIC_API_URL_DEV || 
                           'http://localhost:8000';
          
          // Call our backend's Auth0 callback endpoint with the access token
          const response = await fetch(`${apiBaseUrl}/auth0/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: accessToken,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Auth0 login failed');
          }

          const data = await response.json();
          
          // Set up the authenticated state with our backend's response
          set({
            user: data.user,
            token: data.jwt_token,
            apiKey: data.api_key,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set the API client to use the API key for future requests
          api.setToken(data.api_key);

          // Load subscription data
          get().loadSubscription();
          
        } catch (error: any) {
          let message = 'Auth0 login failed';
          
          if (error.message) {
            message = error.message;
          }
          
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          await api.register({ username, email, password });
          
          // Auto login after registration
          await get().login(email, password);
          
        } catch (error: any) {
          let message = 'Registration failed';
          
          if (error.response?.data?.detail) {
            // Handle different error formats
            if (typeof error.response.data.detail === 'string') {
              message = error.response.data.detail;
            } else if (Array.isArray(error.response.data.detail)) {
              // Handle validation errors (array of error objects)
              message = error.response.data.detail.map((err: any) => err.msg || err.message || 'Validation error').join(', ');
            } else {
              message = 'Registration validation failed';
            }
          } else if (error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error.message) {
            message = error.message;
          }
          
          set({
            error: message,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        api.clearToken();
        set({
          user: null,
          token: null,
          apiKey: null,
          subscription: null,
          isAuthenticated: false,
          error: null,
        });
      },

      loadUser: async () => {
        try {
          const { apiKey } = get();
          if (!apiKey) return;

          // Make sure we're using the API key for this request
          api.setToken(apiKey);
          set({ isLoading: true });
          const user = await api.getCurrentUser();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
        } catch (error: any) {
          console.error('Failed to load user:', error);
          // Don't logout on user profile loading error - just set loading to false
          set({ isLoading: false });
        }
      },

      loadSubscription: async () => {
        try {
          const { apiKey } = get();
          if (!apiKey) return;
          
          // Make sure we're using the API key for this request
          api.setToken(apiKey);
          const subscription = await api.getSubscriptionStatus();
          set({ subscription });
        } catch (error: any) {
          console.error('Failed to load subscription:', error);
          // Don't logout on subscription error, just log it
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'trendit-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        apiKey: state.apiKey,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize API client with stored API key on app load
useAuthStore.subscribe((state) => {
  if (state.apiKey && state.isAuthenticated) {
    api.setToken(state.apiKey);
  }
});