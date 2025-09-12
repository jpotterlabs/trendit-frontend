import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Potter Labs - AI-Powered Social Media Analytics Platform',
  description: 'Revolutionary AI-powered social media analytics across all major platforms. Enterprise-grade insights for Reddit, Twitter/X, LinkedIn, Instagram, and TikTok. Transform your social intelligence with Potter Labs.',
  keywords: [
    'social media analytics',
    'AI analytics',
    'Reddit analytics',
    'Twitter analytics', 
    'LinkedIn analytics',
    'Instagram analytics',
    'TikTok analytics',
    'social media intelligence',
    'enterprise analytics',
    'social listening',
    'trend analysis',
    'sentiment analysis',
    'Potter Labs',
    'Trendit',
    'social data',
    'business intelligence',
    'market research',
    'social insights'
  ],
  authors: [{ name: 'Potter Labs' }],
  creator: 'Potter Labs',
  publisher: 'Potter Labs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://potterlabs.xyz'),
  alternates: {
    canonical: '/potter-labs',
  },
  openGraph: {
    title: 'Potter Labs - AI-Powered Social Media Analytics Platform',
    description: 'Revolutionary AI-powered social media analytics across all major platforms. Enterprise-grade insights for Reddit, Twitter/X, LinkedIn, Instagram, and TikTok.',
    url: 'https://potterlabs.xyz/potter-labs',
    siteName: 'Potter Labs',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-potter-labs.png',
        width: 1200,
        height: 630,
        alt: 'Potter Labs - AI-Powered Social Media Analytics',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Potter Labs - AI-Powered Social Media Analytics Platform',
    description: 'Revolutionary AI-powered social media analytics across all major platforms. Enterprise-grade insights for your business.',
    images: ['/twitter-potter-labs.png'],
    creator: '@potterlabs',
    site: '@potterlabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'Business',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Potter Labs',
    'application-name': 'Potter Labs',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#3b82f6',
  },
};

interface PotterLabsLayoutProps {
  children: React.ReactNode;
}

export default function PotterLabsLayout({ children }: PotterLabsLayoutProps) {
  return (
    <>
      {/* JSON-LD Structured Data for Corporate Entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Corporation',
            name: 'Potter Labs',
            alternateName: 'PotterLabs',
            url: 'https://potterlabs.xyz',
            logo: 'https://potterlabs.xyz/logo-potter-labs.png',
            description: 'AI-powered social media analytics platform providing revolutionary insights across Reddit, Twitter/X, LinkedIn, Instagram, and TikTok for enterprise clients.',
            foundingDate: '2024',
            industry: 'Software as a Service (SaaS)',
            sector: 'Technology',
            keywords: 'social media analytics, AI analytics, business intelligence, social listening, trend analysis',
            sameAs: [
              'https://twitter.com/potterlabs',
              'https://linkedin.com/company/potter-labs',
              'https://github.com/jpotterlabs'
            ],
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'US',
              addressRegion: 'United States'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-555-POTTER',
              contactType: 'customer service',
              availableLanguage: 'English'
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Social Media Analytics Products',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'SoftwareApplication',
                    name: 'Trendit',
                    description: 'Reddit data analytics platform',
                    url: 'https://reddit.potterlabs.xyz',
                    applicationCategory: 'Analytics Software'
                  }
                }
              ]
            },
            makesOffer: {
              '@type': 'Offer',
              name: 'Social Media Analytics Services',
              description: 'Enterprise-grade social media analytics and intelligence services'
            }
          })
        }}
      />

      {/* JSON-LD Structured Data for Software Products */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Trendit',
            applicationCategory: 'Analytics Software',
            applicationSubCategory: 'Social Media Analytics',
            description: 'Revolutionary Reddit data collection and analysis platform with AI-powered sentiment analysis and trend detection.',
            url: 'https://reddit.potterlabs.xyz',
            author: {
              '@type': 'Corporation',
              name: 'Potter Labs',
              url: 'https://potterlabs.xyz'
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              name: 'Free Tier',
              description: 'Free tier available with premium options'
            },
            featureList: [
              'Reddit data collection',
              'AI sentiment analysis', 
              'Advanced analytics',
              'Multiple export formats',
              'Real-time processing'
            ],
            operatingSystem: 'Web Browser',
            screenshot: 'https://reddit.potterlabs.xyz/screenshots/dashboard.png'
          })
        }}
      />

      {/* JSON-LD Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Potter Labs - The Future of Social Media Analytics',
            description: 'Discover how Potter Labs is revolutionizing social media analytics with AI-powered insights across Reddit, Twitter/X, LinkedIn, Instagram, and TikTok.',
            author: {
              '@type': 'Corporation',
              name: 'Potter Labs'
            },
            publisher: {
              '@type': 'Corporation',
              name: 'Potter Labs',
              logo: {
                '@type': 'ImageObject',
                url: 'https://potterlabs.xyz/logo-potter-labs.png'
              }
            },
            mainEntityOfPage: 'https://potterlabs.xyz/potter-labs',
            datePublished: '2025-01-01',
            dateModified: new Date().toISOString().split('T')[0],
            image: 'https://potterlabs.xyz/og-potter-labs.png'
          })
        }}
      />

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="ICBM" content="39.8283, -98.5795" />
      <meta name="DC.title" content="Potter Labs - AI-Powered Social Media Analytics" />
      <meta name="DC.creator" content="Potter Labs" />
      <meta name="DC.subject" content="Social Media Analytics, AI, Business Intelligence" />
      <meta name="DC.description" content="Revolutionary AI-powered social media analytics platform" />
      <meta name="DC.publisher" content="Potter Labs" />
      <meta name="DC.contributor" content="Potter Labs Team" />
      <meta name="DC.date" content={new Date().toISOString().split('T')[0]} />
      <meta name="DC.type" content="Text" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content="https://potterlabs.xyz/potter-labs" />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content="Worldwide" />
      <meta name="DC.rights" content="Copyright Potter Labs 2025" />

      {children}
    </>
  );
}