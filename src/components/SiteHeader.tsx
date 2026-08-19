import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';

export function SiteHeader() {
  return (
    <header className="header">
      <div className="navbar glass">
        <Link href="/" prefetch={true} className="nav-logo">
          <img
            src="/assets/logos/logo.webp"
            alt="Abdelhamid Engineering Industries"
            width="86"
            height="86"
            decoding="async"
            fetchPriority="low"
          />

          <div className="nav-logo-text" aria-hidden="true">
            <h4>Abdelhamid</h4>
            <span>For Engineering Industries</span>
          </div>
        </Link>

        <SiteNav />
      </div>
    </header>
  );
}
