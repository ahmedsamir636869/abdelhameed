import type { Metadata } from 'next';
import HomePage from '../page';

/* Legacy URL kept for inbound links; it serves the same content as "/",
   so point search engines at the canonical home page. */
export const metadata: Metadata = {
  description:
    'Abdelhamid Engineering Industries manufactures precision wire and metal components for appliances, retail displays and industry. 38+ years, 18 countries served.',
  alternates: { canonical: '/' },
};

export default HomePage;
