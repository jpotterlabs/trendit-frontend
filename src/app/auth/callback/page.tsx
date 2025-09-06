'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { Loader2 } from 'lucide-react';

export default function CallbackPage() {
  const { user, isAuthenticated, isLoading, error, getAccessTokenSilently } = useAuth0();
  const { loginWithAuth0 } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleAuth0Callback = async () => {
      if (isLoading) return; // Still loading Auth0 state
      
      if (error) {
        console.error('Auth0 error:', error);
        router.push('/auth/login?error=auth0_error');
        return;
      }

      if (isAuthenticated && user) {
        try {
          // Get the access token from Auth0
          const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 
                          process.env.AUTH0_AUDIENCE || 
                          'https://trendit-api.com';
          
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: audience,
            },
          });

          console.log('Auth0 callback - User:', user);
          console.log('Auth0 callback - Access token received');

          // Send the access token to our backend
          await loginWithAuth0(accessToken);

          // Redirect to dashboard
          router.push('/dashboard');
        } catch (err) {
          console.error('Failed to process Auth0 callback:', err);
          router.push('/auth/login?error=callback_error');
        }
      }
    };

    handleAuth0Callback();
  }, [isAuthenticated, isLoading, error, user, getAccessTokenSilently, loginWithAuth0, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">There was a problem signing you in.</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 p-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Completing sign in...</h1>
        <p className="text-gray-600">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}