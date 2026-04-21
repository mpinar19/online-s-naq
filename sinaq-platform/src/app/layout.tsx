import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'SinaqAZ — 700 Ballıq Sınaq Platforması',
  description: 'Azərbaycan məktəbliləri üçün professional sınaq platforması. 1-11-ci sinif, bütün fənlər, PDF-dən sual, internet axtarışı.',
  keywords: 'sinaq, imtahan, Azərbaycan, məktəb, test, 700 bal',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'SinaqAZ — 700 Ballıq Sınaq Platforması',
    description: 'Azərbaycan məktəbliləri üçün professional sınaq platforması.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#080B14" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased">
        <Script src="/data.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
