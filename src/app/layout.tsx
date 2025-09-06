import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/contexts/theme';
import { Auth0ProviderWrapper } from '@/components/auth/auth0-provider';

const geistSans = Inter({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trendit - Reddit Analytics Platform',
  description: 'Comprehensive Reddit data collection and analysis platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Auth0ProviderWrapper>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}