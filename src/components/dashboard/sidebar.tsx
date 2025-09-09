'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/store/auth';
import {
  BarChart3,
  Database,
  Download,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Zap,
  X,
  CreditCard,
  Key,
  Search,
  Layout,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Collection Jobs', href: '/dashboard/jobs', icon: Database },
  { name: 'Scenarios', href: '/dashboard/scenarios', icon: Layout },
  { name: 'Data Browser', href: '/dashboard/data', icon: Search },
  { name: 'Query Data', href: '/dashboard/query', icon: Search },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Export Data', href: '/dashboard/export', icon: Download },
  { name: 'Sentiment Analysis', href: '/dashboard/sentiment', icon: Zap },
];

export function DashboardSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, subscription, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'pro':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-200';
    }
  };

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={cn('flex h-full flex-col overflow-y-auto border-r bg-background', className)}>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center flex-1">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="ml-3 text-xl font-bold text-foreground">Trendit</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-accent border-r-2 border-primary text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-3">
          {/* Subscription badge */}
          {subscription && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Plan</span>
              <Badge
                variant="secondary"
                className={cn('text-xs', getTierColor(subscription.tier))}
              >
                {subscription.tier.toUpperCase()}
              </Badge>
            </div>
          )}

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <div className="flex items-center w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                    <AvatarFallback>
                      {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/api-keys">
                  <Key className="mr-2 h-4 w-4" />
                  API Keys
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full">
              <Sidebar />
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-background shadow md:hidden">
        <Button
          variant="ghost"
          className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1 px-4 flex justify-between">
          <div className="flex-1 flex">
            <div className="w-full flex md:ml-0">
              <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="flex items-center h-full px-2">
                  <span className="text-lg font-semibold text-foreground">Trendit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}