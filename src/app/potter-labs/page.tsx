import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Database, 
  Brain,
  Zap, 
  Users, 
  TrendingUp, 
  Shield, 
  Network,
  ArrowRight,
  CheckCircle,
  Star,
  Building2,
  Globe,
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Target,
  Award,
  Rocket
} from 'lucide-react';

export default function PotterLabsPage() {
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-blue-50/30">
        {/* Floating orbs for ambient effect */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse float-animation"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse float-animation" style={{ animationDelay: '3s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="shimmer-overlay">
                <div className="h-24 w-24 rounded-3xl shine-logo flex items-center justify-center premium-glow shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                  <span className="text-white font-bold text-4xl relative z-20">P</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 text-lg font-semibold shimmer-overlay">
                AI-Powered Social Intelligence
              </Badge>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Potter
              <br />
              <span className="text-shimmer">
                Labs
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-700 mb-12 max-w-5xl mx-auto font-medium leading-relaxed">
              The future of social media analytics. 
              <span className="text-gradient-primary font-semibold">Revolutionary AI-driven insights</span> across every major platform to transform how enterprises understand digital communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <div className="shimmer-overlay">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xl px-10 py-6 shadow-2xl hover-lift" asChild>
                  <Link href="#products">
                    Explore Products
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                </Button>
              </div>
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 text-xl px-10 py-6 hover-lift glass-morphism">
                Request Demo
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 mt-12 text-base text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Enterprise-Grade Security
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                AI-Powered Analytics
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Real-Time Intelligence
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Showcase */}
      <div id="products" className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Our <span className="text-shimmer">Product</span> Portfolio
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A comprehensive suite of AI-powered social media analytics platforms, designed to provide 
              <span className="font-semibold text-blue-600"> unparalleled insights</span> across every major platform.
            </p>
          </div>

          {/* Trendit - Flagship Product */}
          <div className="mb-20">
            <div className="gradient-border hover-lift animate-fade-in max-w-5xl mx-auto">
              <Card className="border-0 relative gradient-border-inner p-8">
                <div className="absolute -top-4 left-8">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-semibold shimmer-overlay">Flagship Product</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mr-6 premium-glow">
                        <span className="text-white font-bold text-2xl">T</span>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-gray-900 mb-2">Trendit</h3>
                        <p className="text-xl text-orange-600 font-semibold">Reddit Analytics Platform</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      Our revolutionary Reddit data collection and analysis platform. Extract insights, track trends, 
                      and analyze communities with powerful AI-driven tools and stunning visualizations. 
                      <span className="font-semibold text-orange-600">Now serving thousands of users worldwide.</span>
                    </p>
                    <div className="flex gap-4 mb-8">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">Active Community Analysis</Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">AI Sentiment Analysis</Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">Real-Time Processing</Badge>
                    </div>
                    <div className="flex gap-4">
                      <div className="shimmer-overlay">
                        <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600" asChild>
                          <Link href="https://reddit.potterlabs.xyz" target="_blank">
                            Launch Trendit
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <Button variant="outline" className="border-orange-300 text-orange-600 hover:border-orange-500">
                        Learn More
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                      <div className="text-3xl font-bold text-orange-600 mb-2">10K+</div>
                      <div className="text-orange-700 font-medium">Active Users</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-2">50M+</div>
                      <div className="text-blue-700 font-medium">Posts Analyzed</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                      <div className="text-green-700 font-medium">Uptime</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="text-3xl font-bold text-purple-600 mb-2">5-Star</div>
                      <div className="text-purple-700 font-medium">User Rating</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Coming Soon Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
            
            {/* Twitter/X Analytics */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-sm">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 premium-glow">
                  <Twitter className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">X Analytics Suite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Advanced Twitter/X analytics with <span className="font-semibold text-blue-600">real-time trend analysis</span>, 
                  influencer tracking, and comprehensive engagement metrics for brands and researchers.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time tweet analysis
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Influencer network mapping
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Viral content prediction
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Professional Insights */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in animation-delay-200 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-sm">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-6 premium-glow">
                  <Linkedin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">LinkedIn Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Professional network analysis with <span className="font-semibold text-indigo-600">industry insights</span>, 
                  career trend tracking, and B2B content performance optimization tools.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Industry trend analysis
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Professional network mapping
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    B2B content optimization
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instagram Engagement Analytics */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 text-sm">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 premium-glow">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Instagram Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Visual content analysis with <span className="font-semibold text-pink-600">aesthetic scoring</span>, 
                  hashtag optimization, and influencer collaboration discovery for brands.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Visual content analysis
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Hashtag performance tracking
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Influencer matching
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TikTok Trend Analysis */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in animation-delay-200 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-3 py-1 text-sm">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-6 premium-glow">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">TikTok Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Next-generation TikTok analytics with <span className="font-semibold text-purple-600">viral prediction AI</span>, 
                  sound trend tracking, and creator performance optimization.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Viral content prediction
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Sound trend analysis
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Creator optimization
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Platform Intelligence */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in md:col-span-2 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 text-sm">Coming 2025</Badge>
              </div>
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 premium-glow">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Multi-Platform Intelligence Suite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  The ultimate social media command center. <span className="font-semibold text-indigo-600">Cross-platform analytics</span> 
                  with unified dashboards, predictive insights, and enterprise-grade AI that connects all your social data.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Unified cross-platform dashboard
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Predictive trend analysis
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Advanced AI insights
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Enterprise security
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Custom integrations
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      White-label solutions
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Beta Program CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200">
              <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Be First in Line</h3>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Join our exclusive beta program and get early access to groundbreaking social media analytics tools.
              </p>
              <div className="shimmer-overlay inline-block">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
                  Join Beta Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                The Future of <span className="text-shimmer">Social Intelligence</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  At Potter Labs, we believe social media data holds the key to understanding 
                  modern human behavior, market trends, and cultural shifts. Our mission is to 
                  <span className="font-semibold text-blue-600"> revolutionize how enterprises extract actionable insights</span> 
                  from the world's largest conversation platforms.
                </p>
                <p>
                  Starting with Reddit through our flagship Trendit platform, we've proven that 
                  AI-powered analytics can transform raw social data into 
                  <span className="font-semibold text-purple-600"> strategic business intelligence</span>. 
                  Now we're expanding across every major social platform.
                </p>
                <p>
                  Our vision: <span className="font-semibold text-indigo-600">A world where every organization 
                  has the power of social intelligence</span> at their fingertips, enabling better decisions, 
                  deeper customer understanding, and breakthrough innovations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover-lift">
                  <Building2 className="h-12 w-12 text-blue-600 mb-4" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-blue-700 font-medium">Enterprise Clients</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl border border-green-200 hover-lift">
                  <Globe className="h-12 w-12 text-green-600 mb-4" />
                  <div className="text-3xl font-bold text-green-600 mb-2">Global</div>
                  <div className="text-green-700 font-medium">Market Reach</div>
                </div>
              </div>
              <div className="space-y-6 mt-12">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 hover-lift">
                  <Award className="h-12 w-12 text-purple-600 mb-4" />
                  <div className="text-3xl font-bold text-purple-600 mb-2">AI-First</div>
                  <div className="text-purple-700 font-medium">Innovation</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 hover-lift">
                  <Rocket className="h-12 w-12 text-orange-600 mb-4" />
                  <div className="text-3xl font-bold text-orange-600 mb-2">2024</div>
                  <div className="text-orange-700 font-medium">Founded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Highlights */}
      <div className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              <span className="text-shimmer">Revolutionary</span> Technology Stack
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Built on cutting-edge AI and enterprise-grade infrastructure, designed for 
              <span className="font-semibold text-blue-600"> unprecedented scale and accuracy</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger">
            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in text-center">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-6 premium-glow">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Advanced AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  State-of-the-art machine learning models for sentiment analysis, trend prediction, and content classification.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in animation-delay-200 text-center">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 premium-glow">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Real-Time Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Lightning-fast data ingestion and processing capable of handling millions of social posts per second.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in text-center">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-6 premium-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Military-grade encryption, SOC 2 compliance, and comprehensive data privacy protection for enterprise clients.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl hover:shadow-3xl hover-lift glass-morphism animate-fade-in animation-delay-200 text-center">
              <CardHeader>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-6 premium-glow">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">API-First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive APIs and SDKs enabling seamless integration with existing enterprise workflows and tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse float-animation"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse float-animation" style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Ready to Transform <span className="shimmer-overlay">Your Business</span>?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join industry leaders using Potter Labs' revolutionary social intelligence platforms 
            to make data-driven decisions and stay ahead of market trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <div className="shimmer-overlay">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-6 hover-lift shadow-2xl"
              >
                Schedule Enterprise Demo
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-xl px-12 py-6 hover-lift glass-morphism"
            >
              Explore Trendit Now
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-8 text-lg text-white/80">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              Custom Implementation
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              Dedicated Support
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              Flexible Pricing
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="shimmer-overlay">
                  <div className="h-12 w-12 rounded-xl shine-logo flex items-center justify-center mr-4 premium-glow">
                    <span className="text-white font-bold text-xl relative z-20">P</span>
                  </div>
                </div>
                <span className="text-3xl font-bold text-white">Potter Labs</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Revolutionizing social media analytics with AI-powered insights across every major platform. 
                Building the future of social intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Products</h3>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="https://reddit.potterlabs.xyz" className="hover:text-white transition-colors">Trendit (Reddit Analytics)</Link></li>
                <li><span className="cursor-not-allowed opacity-60">X Analytics Suite</span></li>
                <li><span className="cursor-not-allowed opacity-60">LinkedIn Intelligence</span></li>
                <li><span className="cursor-not-allowed opacity-60">Instagram Insights</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-lg mb-4 md:mb-0">
                &copy; 2025 Potter Labs. All rights reserved. Built with revolutionary precision.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}