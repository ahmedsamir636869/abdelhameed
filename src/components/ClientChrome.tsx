'use client';

import { useLayoutEffect, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { loadScript } from '@/lib/load-script';
import { SITE_ROUTES } from '@/lib/site-routes';

const MOTION_SRC = '/assets/js/motion-experience.js';

export function ClientChrome() {
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    SITE_ROUTES.forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    let stop: (() => void) | undefined;

    void loadScript(MOTION_SRC).then(() => {
      if (cancelled) {
        return;
      }

      const cleanup = window.__abdelhamidEffects?.[MOTION_SRC]?.();
      if (typeof cleanup === 'function') {
        stop = cleanup;
      }
    });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, [pathname]);

  return null;
}
