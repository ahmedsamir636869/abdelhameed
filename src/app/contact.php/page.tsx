import type { Metadata } from 'next';
import { BackToTop } from '@/components/BackToTop';
import { PageShell } from '@/components/PageShell';
import { ContactContent } from '@/components/pages/ContactContent';
import { preload } from 'react-dom';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Abdelhamid Engineering Industries. Send us your questions, discuss a project, or request technical details for wire and metal components.',
  alternates: { canonical: '/contact.php' },
};

export default function ContactPage() {
  preload('/assets/images/optimized/contact/contact-hero-desktop.webp', {
    as: 'image',
    fetchPriority: 'high',
  });

  return (
    <PageShell scripts={['/assets/js/back-to-top.js']}>
      <ContactContent />
      <BackToTop variant="contact" />
    </PageShell>
  );
}
