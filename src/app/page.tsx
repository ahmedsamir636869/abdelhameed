import type { Metadata } from 'next';
import { BackToTop } from '@/components/BackToTop';
import { PageShell } from '@/components/PageShell';
import { HomeContent } from '@/components/pages/HomeContent';
import { preload } from 'react-dom';

export const metadata: Metadata = {
  description:
    'Abdelhamid Engineering Industries manufactures precision wire and metal components for appliances, retail displays and industry. 38+ years, 18 countries served.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  preload('/assets/images/optimized/home/hero-desktop.webp', { as: 'image', fetchPriority: 'high' });

  return (
    <PageShell
      scripts={['/assets/js/back-to-top.js']}
    >
      <HomeContent />
      <BackToTop variant="home" />
    </PageShell>
  );
}
