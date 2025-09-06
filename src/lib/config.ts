// Trendit Configuration Utilities
// ================================

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NODE_ENV === 'development' 
      ? process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:8000'
      : process.env.NEXT_PUBLIC_API_URL_PROD || 'https://api.trendit.example.com',
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
  
  return url;
};

// Validate configuration
export const validateConfig = (): boolean => {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL_DEV',
    'NEXT_PUBLIC_API_URL_PROD',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing);
    return false;
  }
  
  return true;
};

export default config;