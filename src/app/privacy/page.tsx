import { Metadata } from 'next';
import { PrivacyContent } from './privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy | Trendit - Reddit Data Analytics Platform',
  description: 'Comprehensive privacy policy explaining how Potter Labs collects, uses, and protects your information when using Trendit\'s Reddit data analytics services.',
  keywords: [
    'privacy policy',
    'data protection',
    'GDPR compliance',
    'CCPA compliance',
    'reddit data privacy',
    'user privacy',
    'Potter Labs',
    'Trendit',
    'data security',
    'privacy rights'
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
    title: 'Privacy Policy | Trendit',
    description: 'Learn how Potter Labs protects your privacy and handles your data when using Trendit\'s Reddit analytics platform.',
    url: 'https://reddit.potterlabs.xyz/privacy',
    siteName: 'Trendit',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Trendit',
    description: 'Privacy policy for Trendit\'s Reddit data analytics platform by Potter Labs.',
    creator: '@PotterLabs',
  },
  alternates: {
    canonical: 'https://reddit.potterlabs.xyz/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}