import { StaticPage } from '@/components/StaticPage';

export default function HomePage() {
  return <StaticPage content="home" scripts={['/assets/js/back-to-top.js', '/assets/js/home-scroll.js']} />;
}
