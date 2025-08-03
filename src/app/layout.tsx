import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Avatar Voting PWA',
  description: 'Anonymous swipe-based voting for AI avatars with HeyGen integration',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Avatar Voting',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Avatar Voting PWA',
    title: 'Avatar Voting PWA',
    description: 'Anonymous swipe-based voting for AI avatars',
  },
  twitter: {
    card: 'summary',
    title: 'Avatar Voting PWA',
    description: 'Anonymous swipe-based voting for AI avatars',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#9333ea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Avatar Voting" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
