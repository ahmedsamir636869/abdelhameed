import { StaticPage } from '@/components/StaticPage';

export default function AboutPage() {
  return <StaticPage content="about" scripts={['/assets/js/about-scroll.js', '/assets/js/back-to-top.js']} />;
}

