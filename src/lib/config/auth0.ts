/**
 * Auth0 configuration helpers
 */

/**
 * Get the Auth0 audience URL with proper fallback priority
 * 1. NEXT_PUBLIC_AUTH0_AUDIENCE (frontend env var)
 * 2. AUTH0_AUDIENCE (backend env var fallback)
 * 3. Production API URL (default)
 */
export const getAuth0Audience = (): string => {
  return (
    process.env.NEXT_PUBLIC_AUTH0_AUDIENCE ||
    process.env.AUTH0_AUDIENCE ||
    'https://api.potterlabs.xyz'
  );
};