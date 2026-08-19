import type { Metadata } from 'next';
import { ClientChrome } from '@/components/ClientChrome';
import { ExtensionGuard } from '@/components/ExtensionGuard';
import { SiteHeader } from '@/components/SiteHeader';
import { siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Abdelhamid Engineering Industries | Wire Components',
    template: '%s | Abdelhamid Engineering Industries',
  },
  description:
    'Precision wire and metal components for household appliances, retail displays, and industrial applications. Egyptian manufacturing since 1988.',
  applicationName: 'Abdelhamid Engineering Industries',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Abdelhamid Engineering Industries',
    locale: 'en_US',
    url: '/',
    title: 'Abdelhamid Engineering Industries | Wire Components',
    description:
      'Precision wire and metal components for household appliances, retail displays, and industrial applications. Egyptian manufacturing since 1988.',
    images: [{ url: '/assets/images/hero.jpeg', width: 1600, height: 944 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/logos/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="bg-ink-950 font-sans text-white antialiased">
        <ExtensionGuard />
        <ClientChrome />
        <div id="motion-root" className="motion-page relative isolate min-h-screen overflow-x-clip">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
