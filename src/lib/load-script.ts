declare global {
  interface Window {
    __abdelhamidEffects?: Record<string, () => void | (() => void)>;
  }
}

/** Load a public script once, then reuse it across client navigations. */
export function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-abdelhamid-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true' || window.__abdelhamidEffects?.[src]) {
        resolve();
        return;
      }

      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(src)), { once: true });
      return;
    }

    const el = document.createElement('script');
    el.src = src;
    el.dataset.abdelhamidSrc = src;
    el.addEventListener(
      'load',
      () => {
        el.dataset.loaded = 'true';
        resolve();
      },
      { once: true },
    );
    el.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.body.appendChild(el);
  });
}
