import Link from 'next/link';
import type { ComponentProps } from 'react';

type SiteLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

function toAppHref(href: string) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return href;
  }

  return `/${href}`;
}

/** Client-side navigation for in-site paths. Hash and protocol URLs stay native. */
export function SiteLink({ href, prefetch = true, ...props }: SiteLinkProps) {
  return <Link href={toAppHref(href)} prefetch={prefetch} {...props} />;
}
