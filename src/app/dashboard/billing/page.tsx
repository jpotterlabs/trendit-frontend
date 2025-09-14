'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock,
  Zap,
  Shield,
  Phone,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { api } from '@/lib/api/client';
import { SubscriptionTier } from '@/lib/types';

interface SubscriptionTierInfo {
  key: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits?: {
    api_calls_per_month: number;
    exports_per_month: number;
    sentiment_analysis_per_month: number;
    data_retention_days: number;
  };
  isPopular?: boolean;
}

interface SubscriptionStatus {
  tier: string;
  status: string;
  current_period_end?: string;
  next_billed_at?: string;
  price_per_month: number;
  currency: string;
  limits: { [key: string]: number };
  current_usage: { [key: string]: number };
  usage_percentage: { [key: string]: number };
  is_trial: boolean;
  trial_end_date?: string;
  customer_portal_url?: string;
}

export default function BillingPage() {
  const { user } = useAuthStore();
  const [tiers, setTiers] = useState<Record<string, SubscriptionTierInfo>>({});
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!user) return;

      try {
        setError(null);
        
        // Fetch available tiers from API
        const tiersResponse = await api.getBillingTiers();
        setTiers(tiersResponse.tiers);

        // Fetch current subscription status using existing method
        const subscriptionStatus = await api.getSubscriptionStatus();
        setCurrentSubscription(subscriptionStatus);
      } catch (error) {
        setError('Unable to load billing information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, [user]);

  const handleUpgrade = async (tierKey: string) => {
    if (!user || upgrading) return;

    setUpgrading(tierKey);
    setError(null);
    
    try {
      // Create checkout session with Paddle
      const response = await api.createCheckout({
        tier: tierKey as SubscriptionTier,
        success_url: `${window.location.origin}/dashboard/billing?success=true`,
        cancel_url: `${window.location.origin}/dashboard/billing?canceled=true`
      });

      if (response.checkout_url) {
        // Redirect to Paddle checkout
        window.location.href = response.checkout_url;
      } else {
        setError('Unable to create checkout session. Please try again.');
      }
    } catch (error: any) {
      setError('Failed to initiate upgrade. Please try again or contact support.');
    } finally {
      setUpgrading(null);
    }
  };

  const formatUsageType = (type: string) => {
    switch (type) {
      case 'api_call': return 'API Calls';
      case 'export': return 'Exports';
      case 'sentiment_analysis': return 'Sentiment Analysis';
      default: return type;
    }
  };

  const getUsageIcon = (type: string) => {
    switch (type) {
      case 'api_call': return <Zap className="h-4 w-4" />;
      case 'export': return <FileText className="h-4 w-4" />;
      case 'sentiment_analysis': return <TrendingUp className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Billing & Subscription" description="Manage your subscription and usage">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Billing & Subscription" description="Manage your subscription and usage">
      <div className="space-y-8">
        {/* Error Display */}
        {error && (
          <Card className="card-premium border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
            <CardContent className="pt-6">
              <div id="billing-error" className="flex items-center gap-2 text-red-600 dark:text-red-400" role="alert">
                <span className="text-sm font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Current Usage Overview */}
        {currentSubscription && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="card-premium shadow-medium">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-foreground/80">
                  Current Plan
                </CardTitle>
                <CreditCard className="h-4 w-4 text-sapphire-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {currentSubscription.tier.charAt(0).toUpperCase() + currentSubscription.tier.slice(1)}
                </div>
                <Badge 
                  variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {currentSubscription.status}
                </Badge>
                {currentSubscription.next_billed_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Next billing: {new Date(currentSubscription.next_billed_at).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>

            {Object.entries(currentSubscription.current_usage).map(([type, usage]) => {
              const rawPercentage = currentSubscription.usage_percentage[type] || 0;
              const percentage = Math.min(Math.max(rawPercentage, 0), 100); // Clamp between 0-100
              const limit = type === 'api_call' ? currentSubscription.limits.api_calls_per_month :
                           type === 'export' ? currentSubscription.limits.exports_per_month :
                           currentSubscription.limits.sentiment_analysis_per_month;

              return (
                <Card key={type} className="card-premium shadow-medium">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-foreground/80">
                      {formatUsageType(type)}
                    </CardTitle>
                    {getUsageIcon(type)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-2">
                      {usage.toLocaleString()} / {limit.toLocaleString()}
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                      role="progressbar"
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${formatUsageType(type)} usage: ${usage} of ${limit} used (${percentage.toFixed(1)}%)`}
                      style={{
                        '--progress-background': percentage > 80 ? '#ef4444' : 
                                                 percentage > 60 ? '#f59e0b' : '#10b981'
                      } as React.CSSProperties}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {percentage.toFixed(1)}% used this period
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Subscription Plans */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {Object.entries(tiers).map(([tierKey, tier]) => {
              const isCurrent = currentSubscription?.tier === tierKey;
              const isPopular = tierKey === 'pro';

              return (
                <Card 
                  key={tierKey} 
                  className={`card-premium shadow-medium relative overflow-hidden transition-all motion-safe:duration-300 motion-reduce:transition-none hover:shadow-strong motion-safe:hover:scale-[1.02] motion-reduce:hover:scale-100 ${
                    isPopular ? 'ring-2 ring-sapphire-500 ring-opacity-50' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-sapphire-500 to-violet-500 px-3 py-1 text-center pointer-events-none">
                      <span className="text-xs font-semibold text-white">Most Popular</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${
                    tierKey === 'free' ? 'from-slate-500/5 to-gray-500/5' :
                    tierKey === 'pro' ? 'from-sapphire-500/5 to-violet-500/5' :
                    'from-violet-500/5 to-purple-500/5'
                  }`} />
                  
                  <CardHeader className={`relative ${isPopular ? 'pt-8' : ''}`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-foreground">
                        {tier.name}
                      </CardTitle>
                      {isCurrent && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        ${tier.price}
                      </span>
                      <span className="text-muted-foreground">/{tier.interval}</span>
                    </div>
                    <CardDescription>{tier.features[0]}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {!isCurrent ? (
                      <Button
                        onClick={() => handleUpgrade(tierKey)}
                        disabled={upgrading === tierKey || tierKey === 'free'}
                        aria-describedby={error ? 'billing-error' : undefined}
                        className={`w-full focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${
                          tierKey === 'pro' 
                            ? 'bg-gradient-to-r from-sapphire-500 to-violet-500 hover:from-sapphire-600 hover:to-violet-600 focus:ring-sapphire-500'
                            : tierKey === 'enterprise'
                            ? 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 focus:ring-violet-500'
                            : 'bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 focus:ring-slate-500'
                        } text-white font-semibold transition-all motion-safe:duration-300 motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {upgrading === tierKey ? (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full motion-safe:animate-spin motion-reduce:animate-none" 
                              role="status"
                              aria-label="Processing upgrade"
                            />
                            Processing...
                          </div>
                        ) : (
                          tierKey === 'free' ? 'Current Plan' : `Upgrade to ${tier.name}`
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        {currentSubscription?.customer_portal_url && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(currentSubscription.customer_portal_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Manage Subscription
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-premium shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Enterprise Features
              </CardTitle>
              <CardDescription>
                Advanced features for large-scale operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Custom integrations & API</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">SLA guarantees</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Priority feature requests</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-premium shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-sapphire-500" />
                Support Options
              </CardTitle>
              <CardDescription>
                Get help when you need it most
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sapphire-500" />
                  <span className="text-sm">Community forum (Free)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sapphire-500" />
                  <span className="text-sm">Email support (Pro)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-sapphire-500" />
                  <span className="text-sm">Phone & chat (Enterprise)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}