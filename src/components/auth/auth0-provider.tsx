'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

export function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  const router = useRouter();

  // Environment variables for Auth0 configuration
  // These will need to be set in the standalone deployment
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || process.env.AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || process.env.AUTH0_AUDIENCE;
  const baseUrl = process.env.NEXT_PUBLIC_AUTH0_BASE_URL || process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  
  const redirectUri = `${baseUrl}/auth/callback`;

  // Don't render Auth0Provider if required config is missing
  if (!domain || !clientId) {
    console.warn('Auth0 configuration missing. OAuth login will not be available.');
    return <>{children}</>;
  }

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    router.push(appState?.returnTo || '/dashboard');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience || 'https://api.potterlabs.xyz',
        scope: "openid profile email"
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}