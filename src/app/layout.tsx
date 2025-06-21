import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bad & Boujee Hair | Premium Hair Extensions & Accessories',
  description: 'Premium hair extensions and accessories for the modern woman. Quality products with affordable pricing and low maintenance. Shop ponytails, clip-ins, hair care, and accessories.',
  keywords: 'hair extensions, ponytails, clip-ins, hair accessories, premium hair, Australian hair, bad boujee hair',
  authors: [{ name: 'Bad & Boujee Hair' }],
  creator: 'Bad & Boujee Hair',
  publisher: 'Bad & Boujee Hair',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.badboujeehair.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bad & Boujee Hair | Premium Hair Extensions',
    description: 'Premium hair extensions and accessories for the modern woman. Quality products with affordable pricing.',
    url: 'https://www.badboujeehair.com',
    siteName: 'Bad & Boujee Hair',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bad & Boujee Hair - Premium Hair Extensions',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bad & Boujee Hair | Premium Hair Extensions',
    description: 'Premium hair extensions and accessories for the modern woman.',
    images: ['/images/og-image.jpg'],
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ff6b9d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
