'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { SignInPage, Testimonial } from '@/components/ui/sign-in';
import { useAuthStore } from '@/lib/store/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Sample testimonials for the new design
const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    name: "Sarah Chen",
    handle: "@sarahdigital", 
    text: "Trendit's analytics transformed how we understand our community engagement."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    name: "Marcus Johnson", 
    handle: "@marcustech",
    text: "The Reddit data insights are incredibly detailed and actionable for our marketing."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    name: "David Martinez",
    handle: "@davidcreates", 
    text: "Best platform for Reddit analytics. Clean interface, powerful features."
  },
];

export function SignInPageWithAuth() {
  const router = useRouter();
  const { loginWithRedirect } = useAuth0();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showAlert, setShowAlert] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      clearError();
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setShowAlert(true);
      // Error is handled in the store
    }
  };

  const handleGoogleSignIn = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      },
    });
  };

  const handleResetPassword = () => {
    // Navigate to password reset page or trigger Auth0 reset
    router.push('/auth/reset-password');
  };

  const handleCreateAccount = () => {
    router.push('/auth/register');
  };

  return (
    <div className="relative">
      {/* Error Alert Overlay */}
      {error && showAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400" variant="destructive">
            <AlertDescription className="font-medium">
              {error}
              <button 
                onClick={() => setShowAlert(false)}
                className="ml-2 text-rose-500 hover:text-rose-700 font-bold"
              >
                ×
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <SignInPage
        title={
          <span className="font-light text-foreground tracking-tighter">
            Welcome to <span className="text-gradient-primary font-semibold">Trendit</span>
          </span>
        }
        description="Access your Reddit analytics platform and discover powerful insights"
        heroImageSrc="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=2160&q=80"
        testimonials={testimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-card rounded-2xl p-6 shadow-strong">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-foreground font-medium">Signing you in...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}