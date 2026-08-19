/** Every public route. Prefetched on first paint so return visits skip a new `_rsc` fetch. */
export const SITE_ROUTES = [
  '/',
  '/index.php',
  '/about.php',
  '/products.php',
  '/manufacturing.php',
  '/contact.php',
  '/quote.php',
] as const;
