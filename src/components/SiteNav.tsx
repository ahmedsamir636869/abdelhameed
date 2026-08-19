'use client';

import { usePathname } from 'next/navigation';
import { SiteLink } from '@/components/SiteLink';

type NavKey = 'home' | 'about' | 'products' | 'manufacturing' | 'contact' | 'quote';

const NAV_ITEMS: Array<{ key: NavKey; href: string; label: string }> = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'about', href: '/about.php', label: 'About' },
  { key: 'products', href: '/products.php', label: 'Products' },
  { key: 'manufacturing', href: '/manufacturing.php', label: 'Manufacturing' },
  { key: 'contact', href: '/contact.php', label: 'Contact' },
];

function navKeyFromPath(pathname: string): NavKey {
  if (pathname.includes('about.php')) return 'about';
  if (pathname.includes('products.php')) return 'products';
  if (pathname.includes('manufacturing.php')) return 'manufacturing';
  if (pathname.includes('contact.php')) return 'contact';
  if (pathname.includes('quote.php')) return 'quote';
  return 'home';
}

export function SiteNav() {
  const pathname = usePathname() || '/';
  const active = navKeyFromPath(pathname);

  return (
    <>
      <nav className="navigation" id="primary-navigation" aria-label="Primary navigation">
        <ul className="nav-links">
          {NAV_ITEMS.map(({ key, href, label }) => (
            <li key={key}>
              <SiteLink
                href={href}
                className={active === key ? 'active' : ''}
                aria-current={active === key ? 'page' : undefined}
              >
                <span>{label}</span>
              </SiteLink>
            </li>
          ))}

          <li className="mobile-nav-quote">
            <SiteLink href="/quote.php" className={active === 'quote' ? 'active' : ''}>
              <span>Get a Quote</span>
            </SiteLink>
          </li>
        </ul>
      </nav>

      <div className="nav-cta">
        <SiteLink href="/quote.php" className="btn glass btn-navbar">
          Get a Quote
        </SiteLink>

        <button
          className="mobile-toggle glass"
          type="button"
          aria-label="Open navigation menu"
          aria-controls="primary-navigation"
          aria-expanded="false"
        >
          ☰
        </button>
      </div>
    </>
  );
}
