/**
 * Emits src/components/pages/<Name>Content.tsx from the converted JSX.
 *
 * The shared <header> and the back-to-top <button> are dropped here because
 * they now live in SiteHeader/BackToTop components.
 *
 * Run: node scripts/emit-page-components.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const PAGES = [
  { name: 'home', component: 'HomeContent' },
  { name: 'about', component: 'AboutContent' },
  { name: 'products', component: 'ProductsContent' },
  { name: 'manufacturing', component: 'ManufacturingContent' },
  { name: 'contact', component: 'ContactContent' },
  { name: 'quote', component: 'QuoteContent' },
];

/** Removes the leading comment block and shared <header>…</header>. */
function stripHeader(source) {
  const start = source.indexOf('<header className="header">');
  if (start === -1) throw new Error('header not found');
  const end = source.indexOf('</header>', start);
  if (end === -1) throw new Error('header end not found');
  return source.slice(0, start) + source.slice(end + '</header>'.length);
}

/** Removes the page-specific back-to-top button. */
function stripBackToTop(source) {
  const pattern = /<button\s+type="button"\s+className="[a-z]+-back-to-top"[\s\S]*?<\/button>/;
  return source.replace(pattern, '');
}

/** Drops decorative comment blocks that only labelled the old file layout. */
function tidy(source) {
  return source
    .replace(/\{\/\*\s*=+[\s\S]*?=+\s*\*\/\}/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

mkdirSync('src/components/pages', { recursive: true });

for (const { name, component } of PAGES) {
  const converted = readFileSync(`scripts/generated/${name}.jsx.txt`, 'utf8');
  const body = tidy(stripBackToTop(stripHeader(converted)));

  const file = `/* Migrated from the legacy src/content/${name}.html fragment. */

export function ${component}() {
  return (
    <>
${body
  .split('\n')
  .map((line) => (line.trim() ? `      ${line}` : ''))
  .join('\n')}
    </>
  );
}
`;

  const path = `src/components/pages/${component}.tsx`;
  writeFileSync(path, file, 'utf8');
  console.log(`wrote ${path} (${file.length} chars)`);
}
