import { StaticPage } from '@/components/StaticPage';

export default function QuotePage() {
  return <StaticPage content="quote" scripts={['/assets/js/quote.js']} />;
}
