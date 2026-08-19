'use client';

import { useEffect } from 'react';
import { loadScript } from '@/lib/load-script';

export function PageScripts({ srcs }: { srcs: string[] }) {
  const srcList = srcs.join(' ');

  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    void (async () => {
      const list = srcList.split(/\s+/).filter(Boolean);
      await Promise.all(list.map((src) => loadScript(src).catch(() => undefined)));

      if (cancelled) {
        return;
      }

      for (const src of list) {
        const cleanup = window.__abdelhamidEffects?.[src]?.();

        if (cancelled) {
          if (typeof cleanup === 'function') {
            cleanup();
          }
          return;
        }

        if (typeof cleanup === 'function') {
          cleanups.push(cleanup);
        }
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [srcList]);

  return null;
}
