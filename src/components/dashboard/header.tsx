'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth';
import { cn } from '@/lib/utils';

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
    <div className="border-b border-gray-300 dark:border-gray-600 bg-card/80 backdrop-blur-xl px-6 py-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground font-medium">{description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Enhanced Usage indicators */}
          {subscription && (
            <div className="hidden lg:flex items-center space-x-4">
              {Object.entries(subscription.usage_percentage).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {key.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            value >= 90 ? "bg-gradient-to-r from-rose-500 to-red-500" :
                            value >= 75 ? "bg-gradient-to-r from-amber-500 to-yellow-500" :
                            "bg-gradient-to-r from-emerald-500 to-green-500"
                          )}
                          style={{ width: `${Math.min(value as number, 100)}%` }}
                        />
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-bold border-0 px-2 py-0.5",
                          getUsageColor(value as number)
                        )}
                      >
                        {Math.round(value as number)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Premium Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search data, jobs, scenarios..."
              className="pl-10 w-72 bg-background/50 border-gray-300 dark:border-gray-600 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          {/* Enhanced Notifications */}
          <Button 
            variant="outline" 
            size="icon" 
            className="relative bg-background/50 border-gray-300 dark:border-gray-600 hover:bg-accent hover:border-primary/30 transition-all duration-300 group"
          >
            <Bell className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
            <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 text-xs bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-background animate-pulse-soft">
              3
            </Badge>
          </Button>

          {/* Additional actions with enhanced styling */}
          <div className="flex items-center space-x-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}