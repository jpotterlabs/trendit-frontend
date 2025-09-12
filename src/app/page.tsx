import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Database, 
  Download, 
  Zap, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30">
        {/* Floating orbs for ambient effect */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse float-animation"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse float-animation" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="shimmer-overlay">
                <div className="h-20 w-20 rounded-2xl shine-logo flex items-center justify-center premium-glow shadow-2xl">
                  <span className="text-white font-bold text-3xl relative z-20">T</span>
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Reddit Data
              <br />
              <span className="text-shimmer">
                Analytics
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              Revolutionary Reddit data collection and analysis platform. 
              <span className="text-gradient-primary font-semibold">Extract insights, track trends, and analyze communities</span> with powerful AI-driven tools and stunning visualizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <div className="shimmer-overlay">
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-lg px-8 py-4 shadow-2xl hover-lift" asChild>
                  <Link href="/auth/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-orange-500 text-lg px-8 py-4 hover-lift glass-morphism" asChild>
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Free tier available
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Start in seconds
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Reddit <span className="text-shimmer">Analytics</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to collect, analyze, and export Reddit data for research, 
              marketing, or content strategy with <span className="font-semibold text-orange-600">revolutionary precision</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger">
            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 premium-glow">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Data Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Collect posts and comments from multiple subreddits with customizable filters, 
                  keywords, and time ranges using our <span className="font-semibold text-orange-600">advanced AI algorithms</span>.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in animation-delay-200">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 premium-glow">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Visualize engagement trends, sentiment analysis, keyword frequency, 
                  and subreddit comparisons with <span className="font-semibold text-blue-600">revolutionary interactive charts</span>.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 premium-glow">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Multiple Export Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Export your data in CSV, JSON, JSONL, or Parquet formats for 
                  analysis in Excel, Python, R, or other tools with <span className="font-semibold text-green-600">lightning speed</span>.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in animation-delay-200">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-6 premium-glow">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">AI Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  <span className="font-semibold text-purple-600">Revolutionary AI-powered</span> sentiment analysis to understand community opinions 
                  and emotional trends in discussions with unprecedented accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 premium-glow">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Background Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Set up collection jobs that run in the background with <span className="font-semibold text-indigo-600">real-time 
                  progress tracking</span> and intelligent status updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in animation-delay-200">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-6 premium-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  <span className="font-semibold text-red-600">Military-grade security</span> with built-in user anonymization, secure API access, and compliance 
                  with data privacy best practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, <span className="text-shimmer">Transparent</span> Pricing
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Start free and scale as you grow. <span className="font-semibold text-orange-600">No hidden fees. Revolutionary value.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="border-2 border-gray-300 hover-lift shadow-xl animate-fade-in">
              <CardHeader>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900">Free</h3>
                  <div className="text-5xl font-bold text-gray-900 mt-4">$0</div>
                  <p className="text-gray-600 mt-3 text-lg">Perfect for getting started</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">1,000 API calls/month</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">5 exports/month</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">100 sentiment analyses</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">Basic analytics</span>
                  </div>
                </div>
                <Button className="w-full py-3 text-lg" variant="outline" asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Standard Tier (was Pro) */}
            <div className="gradient-border hover-lift animate-fade-in animation-delay-200">
              <Card className="border-0 relative gradient-border-inner">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 text-sm font-semibold shimmer-overlay">Most Popular</Badge>
                </div>
                <CardHeader>
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900">Standard</h3>
                    <div className="text-5xl font-bold text-gray-900 mt-4">
                      <span className="text-shimmer">$9.99</span>
                    </div>
                    <p className="text-gray-600 mt-3 text-lg">For growing teams</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-base">10,000 API calls/month</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-base">100 exports/month</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-base">5,000 sentiment analyses</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-base">Advanced analytics</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-base">Standard support</span>
                    </div>
                  </div>
                  <div className="shimmer-overlay">
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 py-3 text-lg" asChild>
                      <Link href="/auth/register">Start Free Trial</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Premium Tier (was Enterprise) */}
            <Card className="border-2 border-purple-300 hover-lift shadow-xl animate-fade-in">
              <CardHeader>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900">Premium</h3>
                  <div className="text-5xl font-bold text-gray-900 mt-4">
                    <span className="text-gradient-primary">$29.99</span>
                  </div>
                  <p className="text-gray-600 mt-3 text-lg">For power users</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">Unlimited API calls</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">Unlimited exports</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">Unlimited sentiment analyses</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">Advanced analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-base">Premium support</span>
                  </div>
                </div>
                <Button className="w-full py-3 text-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white" asChild>
                  <Link href="/auth/register">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 bg-gradient-to-r from-orange-500 via-pink-500 to-blue-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse float-animation"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse float-animation" style={{ animationDelay: '3s' }}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to unlock <span className="shimmer-overlay">Reddit insights</span>?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            Join thousands of researchers, marketers, and analysts using Trendit 
            to understand Reddit communities with <span className="font-semibold text-white">revolutionary precision</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="shimmer-overlay">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-10 py-4 hover-lift shadow-2xl"
                asChild
              >
                <Link href="/auth/register">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 text-xl px-10 py-4 hover-lift glass-morphism"
            >
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/20 to-blue-500/20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="shimmer-overlay">
                <div className="h-10 w-10 rounded-xl shine-logo flex items-center justify-center mr-4 premium-glow">
                  <span className="text-white font-bold text-lg relative z-20">T</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">Trendit</span>
            </div>
            <div className="flex space-x-8 text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors text-lg">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors text-lg">Terms of Service</Link>
              <Link href="/contact" className="hover:text-white transition-colors text-lg">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">&copy; 2025 Trendit. All rights reserved. Built with revolutionary precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}