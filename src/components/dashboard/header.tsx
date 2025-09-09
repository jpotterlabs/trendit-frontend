'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  const { subscription } = useAuthStore();

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
    return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-foreground sm:truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Usage indicators */}
          {subscription && (
            <div className="flex items-center space-x-3">
              {Object.entries(subscription.usage_percentage).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500 capitalize">
                    {key.replace('_', ' ')}:
                  </span>
                  <Badge
                    variant="outline"
                    className={getUsageColor(value as number)}
                  >
                    {Math.round(value as number)}%
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-64"
            />
          </div>

          {/* Notifications */}
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
              3
            </Badge>
          </Button>

          {/* Additional actions */}
          {children}
        </div>
      </div>
    </div>
  );
}