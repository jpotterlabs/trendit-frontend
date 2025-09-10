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
import { useAuth } from '@/lib/contexts/auth';
import { apiClient } from '@/lib/api/client';

interface SubscriptionTier {
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: {
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
  current_period_end: string | null;
  next_billed_at: string | null;
  price_per_month: number;
  currency: string;
  limits: {
    api_calls_per_month: number;
    exports_per_month: number;
    sentiment_analysis_per_month: number;
    data_retention_days: number;
  };
  current_usage: {
    api_call: number;
    export: number;
    sentiment_analysis: number;
  };
  usage_percentage: {
    api_call: number;
    export: number;
    sentiment_analysis: number;
  };
  is_trial: boolean;
  trial_end_date: string | null;
  customer_portal_url: string | null;
}

export default function BillingPage() {
  const { user } = useAuth();
  const [tiers, setTiers] = useState<Record<string, SubscriptionTier>>({});
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!user) return;

      try {
        // Fetch available tiers
        const tiersResponse = await apiClient.get('/api/billing/tiers');
        setTiers(tiersResponse.data.tiers);

        // Fetch current subscription status
        const statusResponse = await apiClient.get('/api/billing/subscription/status');
        setCurrentSubscription(statusResponse.data);
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, [user]);

  const handleUpgrade = async (tierKey: string) => {
    if (!user || upgrading) return;

    setUpgrading(tierKey);
    try {
      const response = await apiClient.post('/api/billing/checkout/create', {
        tier: tierKey,
        success_url: `${window.location.origin}/dashboard/billing?success=true`,
        cancel_url: `${window.location.origin}/dashboard/billing?canceled=true`
      });

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
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
              const percentage = currentSubscription.usage_percentage[type] || 0;
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
                  className={`card-premium shadow-medium relative overflow-hidden transition-all duration-300 hover:shadow-strong hover:scale-[1.02] ${
                    isPopular ? 'ring-2 ring-sapphire-500 ring-opacity-50' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-sapphire-500 to-violet-500 px-3 py-1 text-center">
                      <span className="text-xs font-semibold text-white">Most Popular</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
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
                        className={`w-full ${
                          tierKey === 'pro' 
                            ? 'bg-gradient-to-r from-sapphire-500 to-violet-500 hover:from-sapphire-600 hover:to-violet-600'
                            : tierKey === 'enterprise'
                            ? 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600'
                            : 'bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600'
                        } text-white font-semibold transition-all duration-300`}
                      >
                        {upgrading === tierKey ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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