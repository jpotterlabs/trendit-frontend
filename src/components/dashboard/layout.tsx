'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from './sidebar';
import { DashboardHeader } from './header';
import { useAuthStore } from '@/lib/store/auth';
import { Toaster } from '@/components/ui/sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
}

export function DashboardLayout({ children, title, description, headerActions }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, token, loadSubscription } = useAuthStore();

  useEffect(() => {
    console.log('DashboardLayout auth check:', { isAuthenticated, hasToken: !!token });

    if (!isAuthenticated && !token) {
      console.log('Redirecting to login: not authenticated and no token');
      router.push('/auth/login');
      return;
    }

    // Load subscription data if authenticated
    if (isAuthenticated && token) {
      console.log('Loading subscription data...');
      loadSubscription();
    }
  }, [isAuthenticated, token, router, loadSubscription]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <DashboardSidebar />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden md:ml-64">
        <DashboardHeader title={title} description={description}>
          {headerActions}
        </DashboardHeader>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gradient-to-br from-background via-background to-muted/30">
          <div className="min-h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
              <div className="animate-fade-in">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}