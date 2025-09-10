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
  TrendingUp,
  Activity,
  Layers,
  Brain,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

const navigation = [
  { 
    name: 'Overview', 
    href: '/dashboard', 
    icon: Home,
    description: 'Dashboard insights',
    gradient: 'from-sapphire-500 to-violet-500'
  },
  { 
    name: 'Collection Jobs', 
    href: '/dashboard/jobs', 
    icon: Database,
    description: 'Data collection tasks',
    gradient: 'from-emerald-500 to-teal-500'
  },
  { 
    name: 'Scenarios', 
    href: '/dashboard/scenarios', 
    icon: Layers,
    description: 'Analysis scenarios',
    gradient: 'from-violet-500 to-purple-500'
  },
  { 
    name: 'Data Browser', 
    href: '/dashboard/data', 
    icon: Filter,
    description: 'Explore datasets',
    gradient: 'from-amber-500 to-orange-500'
  },
  { 
    name: 'Query Builder', 
    href: '/dashboard/query', 
    icon: Search,
    description: 'Custom queries',
    gradient: 'from-rose-500 to-pink-500'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: TrendingUp,
    description: 'Data insights',
    gradient: 'from-cyan-500 to-blue-500'
  },
  { 
    name: 'Export Center', 
    href: '/dashboard/export', 
    icon: Download,
    description: 'Data export tools',
    gradient: 'from-indigo-500 to-purple-500'
  },
  { 
    name: 'AI Insights', 
    href: '/dashboard/sentiment', 
    icon: Brain,
    description: 'Sentiment analysis',
    gradient: 'from-emerald-500 to-cyan-500'
  },
  { 
    name: 'Billing', 
    href: '/dashboard/billing', 
    icon: CreditCard,
    description: 'Subscription & usage',
    gradient: 'from-violet-500 to-rose-500'
  },
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
    <div className={cn('flex h-full flex-col overflow-y-auto bg-sidebar border-r border-sidebar-border shadow-strong', className)}>
      {/* Revolutionary Logo Header */}
      <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-sidebar-border/50">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sapphire-500 via-violet-500 to-emerald-500 flex items-center justify-center shadow-glow-sapphire transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sapphire-500 via-violet-500 to-emerald-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">Trendit</h1>
            <p className="text-xs text-sidebar-foreground/60 font-medium">Analytics Platform</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Premium Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-3">
            Navigation
          </h2>
          <div className="space-y-1 stagger">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-[1.02]',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-medium border border-sidebar-primary/20'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-sapphire-500 to-violet-500 rounded-r-full" />
                  )}
                  
                  {/* Icon with gradient background */}
                  <div className={cn(
                    'relative flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-300',
                    isActive 
                      ? `bg-gradient-to-br ${item.gradient} shadow-glow-sapphire` 
                      : 'bg-sidebar-foreground/5 group-hover:bg-sidebar-accent'
                  )}>
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-all duration-300',
                        isActive 
                          ? 'text-white' 
                          : 'text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground'
                      )}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.name}</span>
                      {/* Activity indicator for active items */}
                      {isActive && (
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-soft" />
                          <Activity className="h-3 w-3 text-sidebar-accent-foreground/60" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-sidebar-foreground/50 mt-0.5 truncate">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-sidebar-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Premium User Section */}
      <div className="flex-shrink-0 border-t border-sidebar-border/50 p-4 bg-gradient-to-r from-sidebar/50 to-sidebar">
        <div className="space-y-4">
          {/* Enhanced Subscription Badge */}
          {subscription && (
            <div className="bg-sidebar-accent/20 rounded-lg p-3 border border-sidebar-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wide">Current Plan</span>
                <Badge
                  className={cn(
                    'text-xs font-bold px-2.5 py-1 rounded-full border-0',
                    getTierColor(subscription.tier),
                    'shadow-soft'
                  )}
                >
                  {subscription.tier.toUpperCase()}
                </Badge>
              </div>
              
              {/* Usage indicator */}
              {subscription.usage_percentage && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-sidebar-foreground/60">Usage</span>
                    <span className="text-sidebar-foreground/80 font-medium">
                      {Math.round(subscription.usage_percentage.api_calls || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-sidebar-foreground/10 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(subscription.usage_percentage.api_calls || 0, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Premium User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-3 h-auto rounded-xl hover:bg-sidebar-accent/30 transition-all duration-300 group"
              >
                <div className="flex items-center w-full space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-sidebar-primary/20 shadow-soft">
                      <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                      <AvatarFallback className="bg-gradient-to-br from-sapphire-500 to-violet-500 text-white font-semibold">
                        {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-sidebar rounded-full animate-pulse-soft" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-sidebar-foreground truncate group-hover:text-sidebar-accent-foreground transition-colors">
                      {user?.username || 'User'}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="text-sidebar-foreground/40 group-hover:text-sidebar-accent-foreground transition-colors">
                    <Settings className="h-4 w-4" />
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 shadow-strong border border-border bg-card backdrop-blur-sm">
              <DropdownMenuLabel className="text-foreground font-semibold px-2 py-1.5">
                Account Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent p-0">
                <Link href="/dashboard/profile" className="flex items-center w-full px-2 py-2 text-foreground hover:text-accent-foreground">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sapphire-500 to-violet-500 flex items-center justify-center mr-3 shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">Profile</div>
                    <p className="text-xs text-muted-foreground truncate">Manage your profile</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent p-0">
                <Link href="/dashboard/api-keys" className="flex items-center w-full px-2 py-2 text-foreground hover:text-accent-foreground">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-3 shadow-sm">
                    <Key className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">API Keys</div>
                    <p className="text-xs text-muted-foreground truncate">Manage integrations</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent p-0">
                <Link href="/dashboard/billing" className="flex items-center w-full px-2 py-2 text-foreground hover:text-accent-foreground">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mr-3 shadow-sm">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">Billing</div>
                    <p className="text-xs text-muted-foreground truncate">Subscription & usage</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent p-0">
                <Link href="/dashboard/settings" className="flex items-center w-full px-2 py-2 text-foreground hover:text-accent-foreground">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mr-3 shadow-sm">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">Settings</div>
                    <p className="text-xs text-muted-foreground truncate">Preferences & config</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-border" />
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-2 py-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mr-3 shadow-sm">
                  <LogOut className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">Sign out</div>
                  <p className="text-xs text-muted-foreground truncate">End your session</p>
                </div>
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