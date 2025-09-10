// Trendit Configuration Utilities
// ================================

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'development' 
        ? process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:8000'
        : (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
            ? (process.env.NEXT_PUBLIC_API_URL_PREVIEW
               || process.env.NEXT_PUBLIC_API_URL_PROD
               || 'https://api.potterlabs.xyz')
            : (process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.potterlabs.xyz'))),
    timeout: 10000, // 10 seconds
  },
  
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Trendit',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
  },
  
  // Authentication
  auth: {
    tokenKey: 'trendit_token',
    tokenExpiry: parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRY || '86400'), // 24 hours
  },
  
  // Feature Flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
};

// Environment helpers
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API URL getter with environment detection
export const getApiUrl = (): string => {
  const url = config.api.baseUrl;
  
  if (config.app.debug) {
    console.log(`🔗 API Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 API URL: ${url}`);
  }
  
  // Trim trailing slash to prevent double slashes in requests
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export default config;