import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'SinaqAZ - 700 Balliq AI Sinaq Platformasi',
  description: 'Azerbaycan mektebliyleri ucun professional AI sinaq platformasi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#080B14" />
      </head>
      <body className="antialiased">
        <Script src="/data.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}