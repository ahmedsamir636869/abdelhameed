import type { Metadata } from 'next';
import { BackToTop } from '@/components/BackToTop';
import { PageShell } from '@/components/PageShell';
import { ManufacturingContent } from '@/components/pages/ManufacturingContent';
import { preload } from 'react-dom';

export const metadata: Metadata = {
  title: 'Manufacturing',
  description:
    'ISO 9001, ISO 14001 and ISO 45001 certified wire manufacturing. See the machinery, controlled processes and quality systems behind every Abdelhamid component.',
  alternates: { canonical: '/manufacturing.php' },
};

export default function ManufacturingPage() {
  preload('/assets/images/optimized/manufacturing/hero-6.webp', { as: 'image', fetchPriority: 'high' });

  return (
    <PageShell
      scripts={['/assets/js/back-to-top.js']}
    >
      <ManufacturingContent />
      <BackToTop variant="manufacturing" />
    </PageShell>
  );
}
