import type { Metadata } from 'next';
import { BackToTop } from '@/components/BackToTop';
import { PageShell } from '@/components/PageShell';
import { AboutContent } from '@/components/pages/AboutContent';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Family-owned Egyptian wire manufacturer since 1988. Explore our 10,000 m² facilities, 4,000-ton annual capacity and the team of 200+ behind Abdelhamid.',
  alternates: { canonical: '/about.php' },
};

export default function AboutPage() {
  return (
    <PageShell
      scripts={['/assets/js/about-scroll.js', '/assets/js/back-to-top.js']}
    >
      <AboutContent />
      <BackToTop variant="about" />
    </PageShell>
  );
}
