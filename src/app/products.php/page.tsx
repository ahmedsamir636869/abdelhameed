import type { Metadata } from 'next';
import { BackToTop } from '@/components/BackToTop';
import { PageShell } from '@/components/PageShell';
import { ProductsContent } from '@/components/pages/ProductsContent';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Browse wire components for refrigerators, dishwashers and ovens, plus retail display systems, shopping baskets and wire mesh decking for storage racking.',
  alternates: { canonical: '/products.php' },
};

export default function ProductsPage() {
  return (
    <PageShell
      scripts={['/assets/js/back-to-top.js']}
    >
      <ProductsContent />
      <BackToTop variant="products" />
    </PageShell>
  );
}
