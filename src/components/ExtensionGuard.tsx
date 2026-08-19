'use client';

import { useEffect } from 'react';
import { loadScript } from '@/lib/load-script';

export function ExtensionGuard() {
  useEffect(() => {
    void loadScript('/assets/js/extension-guard.js');
  }, []);

  return null;
}
