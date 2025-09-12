'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, Clock, Mail, Eye } from 'lucide-react';
import Link from 'next/link';

// Table of contents data
const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-collected', title: '2. Information We Collect' },
  { id: 'reddit-data', title: '3. Reddit Data Collection' },
  { id: 'how-we-use', title: '4. How We Use Your Information' },
  { id: 'data-sharing', title: '5. Information Sharing and Disclosure' },
  { id: 'third-party', title: '6. Third-Party Services' },
  { id: 'data-security', title: '7. Data Security' },
  { id: 'data-retention', title: '8. Data Retention' },
  { id: 'your-rights', title: '9. Your Privacy Rights' },
  { id: 'cookies', title: '10. Cookies and Analytics' },
  { id: 'international', title: '11. International Data Transfers' },
  { id: 'children', title: '12. Children\'s Privacy' },
  { id: 'california', title: '13. California Privacy Rights (CCPA)' },
  { id: 'gdpr', title: '14. European Privacy Rights (GDPR)' },
  { id: 'changes', title: '15. Changes to Privacy Policy' },
  { id: 'contact', title: '16. Contact Information' }
];

export function PrivacyContent() {
  const lastUpdated = 'December 12, 2024';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <DashboardLayout
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Card */}
        <Card className="card-premium border-0 shadow-medium overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-blue-500/5" />
          <CardContent className="relative p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gradient-primary mb-2">
                  Privacy Policy
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  This Privacy Policy explains how Potter Labs collects, uses, and protects your information when you use Trendit.
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {lastUpdated}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Transparent and comprehensive</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-premium border-0 shadow-medium sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 text-gradient-primary">Table of Contents</h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 font-normal hover:bg-primary/5 hover:text-primary transition-all duration-200"
                      onClick={() => scrollToSection(section.id)}
                    >
                      <span className="text-sm leading-relaxed">{section.title}</span>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="card-premium border-0 shadow-medium">
              <CardContent className="p-8 space-y-12">
                
                {/* Section 1: Introduction */}
                <section id="introduction">
                  <h2 className="text-2xl font-bold mb-4 text-gradient-data">1. Introduction</h2>
                  <div className="prose prose-gray max-w-none dark:prose-invert space-y-4">
                    <p>
                      Welcome to Trendit, a Reddit data collection and analysis platform operated by Potter Labs (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and being transparent about how we collect, use, and share your information.
                    </p>
                    <p>
                      This Privacy Policy applies to our website, dashboard, API, and all related services (collectively, the &quot;Service&quot;). By using our Service, you consent to the collection and use of your information as described in this policy.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        <strong>Key Principle:</strong> We only collect information necessary to provide and improve our services. We never sell personal data and we&apos;re committed to data minimization and user control.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2: Information We Collect */}
                <section id="information-collected">
                  <h2 className="text-2xl font-bold mb-4 text-gradient-data">2. Information We Collect</h2>
                  <div className="prose prose-gray max-w-none dark:prose-invert space-y-4">
                    <h3 className="text-xl font-semibold">2.1 Account Information</h3>
                    <p>When you create an account, we collect:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Email address (for authentication via Auth0)</li>
                      <li>Username and profile information from your OAuth provider (Google, GitHub)</li>
                      <li>Account preferences and settings</li>
                      <li>Subscription and billing information</li>
                    </ul>

                    <h3 className="text-xl font-semibold">2.2 Usage Information</h3>
                    <p>We automatically collect information about how you use our Service:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>API usage patterns and call frequency</li>
                      <li>Dashboard interactions and feature usage</li>
                      <li>Data collection job configurations and results</li>
                      <li>Login times and session duration</li>
                      <li>Error logs and performance metrics</li>
                    </ul>

                    <h3 className="text-xl font-semibold">2.3 Technical Information</h3>
                    <p>For security and functionality purposes, we collect:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>IP addresses and device information</li>
                      <li>Browser type and operating system</li>
                      <li>Referrer URLs and clickstream data</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </section>

                {/* Contact Section */}
                <section id="contact">
                  <h2 className="text-2xl font-bold mb-4 text-gradient-data">16. Contact Information</h2>
                  <div className="prose prose-gray max-w-none dark:prose-invert space-y-4">
                    <p>
                      If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          General Privacy Inquiries
                        </h4>
                        <p><strong>Email:</strong> privacy@potterlabs.xyz</p>
                        <p><strong>Response Time:</strong> Within 30 days</p>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Data Protection Officer
                        </h4>
                        <p><strong>Email:</strong> dpo@potterlabs.xyz</p>
                        <p><strong>For:</strong> GDPR and EU privacy matters</p>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Potter Labs</h4>
                      <p>Website: <Link href="https://potterlabs.xyz" className="text-primary hover:underline">https://potterlabs.xyz</Link></p>
                      <p>Service Website: <Link href="https://reddit.potterlabs.xyz" className="text-primary hover:underline">https://reddit.potterlabs.xyz</Link></p>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <div className="border-t pt-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-sm text-muted-foreground">
                      This Privacy Policy is effective as of {lastUpdated}
                    </p>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/terms">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Terms of Service
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard">
                          Back to Dashboard
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}