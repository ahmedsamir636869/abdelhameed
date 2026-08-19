import type { Metadata } from 'next';
import { BackToTop } from '@/components/BackToTop';
import { PageShell } from '@/components/PageShell';
import { QuoteContent } from '@/components/pages/QuoteContent';
import { preload } from 'react-dom';

export const metadata: Metadata = {
  title: 'Get a Quote',
  description:
    'Request a quote for custom wire and metal components. Share your drawings, volumes and requirements, and our engineering team will price your project.',
  alternates: { canonical: '/quote.php' },
};

export default function QuotePage() {
  preload('/assets/images/optimized/quote/quote-hero-desktop.webp', {
    as: 'image',
    fetchPriority: 'high',
  });

  return (
    <PageShell scripts={['/assets/js/quote.js', '/assets/js/back-to-top.js']}>
      <QuoteContent />
      <BackToTop variant="quote" />
    </PageShell>
  );
}
