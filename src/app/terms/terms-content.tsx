'use client';

import { PublicLayout } from '@/components/layout/public-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollText, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

// Table of contents data
const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'service-description', title: '2. Service Description' },
  { id: 'user-accounts', title: '3. User Accounts and Registration' },
  { id: 'acceptable-use', title: '4. Acceptable Use Policy' },
  { id: 'data-collection', title: '5. Data Collection and Usage' },
  { id: 'reddit-compliance', title: '6. Reddit API Terms Compliance' },
  { id: 'subscription-billing', title: '7. Subscription and Billing' },
  { id: 'intellectual-property', title: '8. Intellectual Property Rights' },
  { id: 'service-availability', title: '9. Service Availability and Limitations' },
  { id: 'user-responsibilities', title: '10. User Responsibilities' },
  { id: 'privacy-security', title: '11. Privacy and Data Security' },
  { id: 'limitation-liability', title: '12. Limitation of Liability' },
  { id: 'indemnification', title: '13. Indemnification' },
  { id: 'termination', title: '14. Account Termination' },
  { id: 'modifications', title: '15. Modifications to Terms' },
  { id: 'governing-law', title: '16. Governing Law and Disputes' },
  { id: 'contact', title: '17. Contact Information' }
];

export function TermsContent() {
  const lastUpdated = 'December 12, 2024';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PublicLayout
      title="Terms of Service"
      description="Terms and conditions governing the use of Trendit services"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Card */}
        <Card className="card-premium border-0 shadow-medium overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sapphire-500/5 via-violet-500/5 to-emerald-500/5" />
          <CardContent className="relative p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sapphire-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                <ScrollText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gradient-primary mb-2">
                  Terms of Service
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  These terms govern your use of Trendit&apos;s Reddit data collection and analysis services.
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {lastUpdated}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Effective immediately</span>
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
                
                {/* Section 1: Acceptance of Terms */}
                <section id="acceptance">
                  <h2 className="text-2xl font-bold mb-4 text-gradient-data">1. Acceptance of Terms</h2>
                  <div className="prose prose-gray max-w-none dark:prose-invert space-y-4">
                    <p>
                      By accessing or using Trendit services provided by Potter Labs (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use our services.
                    </p>
                    <p>
                      These Terms constitute a legally binding agreement between you and Potter Labs. Your use of our services is also governed by our Privacy Policy, which is incorporated by reference into these Terms.
                    </p>
                  </div>
                </section>

                {/* Section 2: Service Description */}
                <section id="service-description">
                  <h2 className="text-2xl font-bold mb-4 text-gradient-data">2. Service Description</h2>
                  <div className="prose prose-gray max-w-none dark:prose-invert space-y-4">
                    <p>
                      Trendit is a Reddit data collection and analysis platform that provides:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Automated Reddit data collection from public subreddits and posts</li>
                      <li>Data analytics and sentiment analysis tools</li>
                      <li>Export capabilities for collected data in various formats</li>
                      <li>API access for programmatic data retrieval</li>
                      <li>Dashboard interfaces for data visualization and management</li>
                    </ul>
                    <p>
                      Our services are designed for research, analytics, and business intelligence purposes and comply with Reddit&apos;s API Terms of Service and rate limits.
                    </p>
                  </div>
                </section>

                {/* Section 7: Subscription and Billing */}
                <section id="subscription-billing">
                  <h2 className="text-2xl font-bold mb-4 text-gradient-data">7. Subscription and Billing</h2>
                  <div className="prose prose-gray max-w-none dark:prose-invert space-y-4">
                    <h3 className="text-lg font-semibold">7.1 Subscription Plans</h3>
                    <p>
                      Trendit offers various subscription tiers with different features and usage limits. Subscription fees are billed in advance on a monthly or annual basis, as selected during signup.
                    </p>

                    <h3 className="text-lg font-semibold">7.2 Payment Processing</h3>
                    <p>
                      Payments are processed securely through Paddle.com. By subscribing, you authorize us to charge your selected payment method for the subscription fees and any applicable taxes.
                    </p>

                    <h3 className="text-lg font-semibold">7.3 Auto-Renewal</h3>
                    <p>
                      Subscriptions automatically renew at the end of each billing period unless canceled before the renewal date. You will be charged the then-current subscription fee for the next billing period.
                    </p>

                    <h3 className="text-lg font-semibold">7.4 Cancellation Policy</h3>
                    <p>
                      You may cancel your subscription at any time through your account dashboard or by contacting support. Cancellation takes effect at the end of your current billing period. You will retain access to paid features until the end of your billing period.
                    </p>

                    <h3 className="text-lg font-semibold">7.5 Refund Policy</h3>
                    <p>
                      <strong>30-Day Money-Back Guarantee:</strong> New subscribers may request a full refund within 30 days of their initial purchase. Refunds for subsequent billing periods are not provided, except at our sole discretion for exceptional circumstances.
                    </p>
                    <p>
                      <strong>Refund Process:</strong> To request a refund, contact our support team at billing@potterlabs.xyz within the eligible period. Refunds are processed through the original payment method within 5-10 business days.
                    </p>
                    <p>
                      <strong>Usage-Based Refunds:</strong> Partial refunds may be considered for unused service periods due to technical issues or service interruptions on our end.
                    </p>

                    <h3 className="text-lg font-semibold">7.6 Fee Changes</h3>
                    <p>
                      We may modify subscription fees with 30 days' advance notice. Fee changes apply to new subscriptions and renewals after the notice period. Current subscribers will be notified via email.
                    </p>

                    <h3 className="text-lg font-semibold">7.7 Failed Payments</h3>
                    <p>
                      If a payment fails, we will attempt to collect payment for up to 7 days. If payment cannot be collected, your subscription will be suspended until payment is successful. Your account and data will be retained for 30 days to allow for payment resolution.
                    </p>
                  </div>
                </section>

                {/* Section 14: Account Termination */}
                <section id="termination">
                  <h2 className="text-2xl font-bold mb-4 text-gradient-data">14. Account Termination</h2>
                  <div className="prose prose-gray max-w-none dark:prose-invert space-y-4">
                    <h3 className="text-lg font-semibold">14.1 Termination by User</h3>
                    <p>
                      You may terminate your account at any time by canceling your subscription and contacting support. Upon termination, your access to the service will end, but you may retain access through the end of your current billing period.
                    </p>

                    <h3 className="text-lg font-semibold">14.2 Termination by Us</h3>
                    <p>
                      We may suspend or terminate your account immediately if you violate these Terms, engage in prohibited activities, or if your account remains unpaid for more than 30 days.
                    </p>

                    <h3 className="text-lg font-semibold">14.3 Data Retention</h3>
                    <p>
                      After account termination, we may retain your data for up to 90 days for recovery purposes. After this period, your data will be permanently deleted, except as required for legal compliance.
                    </p>
                  </div>
                </section>

                {/* Section 17: Contact */}
                <section id="contact">
                  <h2 className="text-2xl font-bold mb-4 text-gradient-data">17. Contact Information</h2>
                  <div className="prose prose-gray max-w-none dark:prose-invert space-y-4">
                    <p>
                      For questions about these Terms of Service, please contact us:
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p><strong>Potter Labs</strong></p>
                      <p>Email: legal@potterlabs.xyz</p>
                      <p>Website: <Link href="https://potterlabs.xyz" className="text-primary hover:underline">https://potterlabs.xyz</Link></p>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <div className="border-t pt-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-sm text-muted-foreground">
                      These Terms of Service are effective as of {lastUpdated}
                    </p>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/privacy">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Privacy Policy
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
    </PublicLayout>
  );
}