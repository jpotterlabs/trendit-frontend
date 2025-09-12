import { Metadata } from 'next';
import { TermsContent } from './terms-content';

export const metadata: Metadata = {
  title: 'Terms of Service | Trendit - Reddit Data Analytics Platform',
  description: 'Terms and conditions governing the use of Trendit\'s Reddit data collection and analysis services by Potter Labs.',
  keywords: [
    'terms of service',
    'legal terms',
    'reddit data collection',
    'data analytics',
    'Potter Labs',
    'Trendit',
    'user agreement',
    'service terms'
  ],
  authors: [{ name: 'Potter Labs' }],
  creator: 'Potter Labs',
  publisher: 'Potter Labs',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Terms of Service | Trendit',
    description: 'Terms and conditions governing the use of Trendit\'s Reddit data collection and analysis services.',
    url: 'https://reddit.potterlabs.xyz/terms',
    siteName: 'Trendit',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | Trendit',
    description: 'Terms and conditions for Trendit\'s Reddit data analytics platform.',
    creator: '@PotterLabs',
  },
  alternates: {
    canonical: 'https://reddit.potterlabs.xyz/terms',
  },
};

export default function TermsPage() {
  return <TermsContent />;
}