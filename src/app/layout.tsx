import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abdelhamid Engineering Industries',
  description: 'Precision wire and metal components for household appliances, retail displays, and industrial applications.',
};

const extensionHydrationGuard = `
(() => {
  const isExtensionAttribute = (name) =>
    name.startsWith('bis_') ||
    (name.startsWith('__processed_') && name.endsWith('__'));

  const clean = (node) => {
    if (!(node instanceof Element)) return;

    for (const attribute of [...node.attributes]) {
      if (isExtensionAttribute(attribute.name)) node.removeAttribute(attribute.name);
    }

    node.querySelectorAll('*').forEach((child) => {
      for (const attribute of [...child.attributes]) {
        if (isExtensionAttribute(attribute.name)) child.removeAttribute(attribute.name);
      }
    });
  };

  clean(document.documentElement);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && isExtensionAttribute(mutation.attributeName || '')) {
        clean(mutation.target);
      }

      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(clean);
      }
    }
  }).observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script id="browser-extension-hydration-guard" strategy="beforeInteractive">
          {extensionHydrationGuard}
        </Script>
        <link rel="icon" href="/assets/logos/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/pages/capabilities-redesign.css" />
        <link rel="stylesheet" href="/assets/css/pages/product-directory-redesign.css" />
        <link rel="stylesheet" href="/assets/css/pages/manufacturing-certifications-redesign.css" />
      </head>
      <body suppressHydrationWarning className="bg-ink-950 font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
