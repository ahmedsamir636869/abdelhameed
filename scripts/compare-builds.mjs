/**
 * Compares the pre-migration build (out-baseline) with the current build (out)
 * so the HTML-to-TSX move can be proven not to change what users see.
 *
 * Run: node scripts/compare-builds.mjs
 */

import { readFileSync, statSync } from 'node:fs';

const PAGES = [
  'index', 'index.php', 'about.php', 'products.php',
  'manufacturing.php', 'contact.php', 'quote.php',
];

/** Only the rendered document body matters; scripts and RSC payload are noise. */
function bodyOnly(html) {
  const start = html.indexOf('<body');
  return html.slice(start === -1 ? 0 : start).replace(/<script[\s\S]*?<\/script>/g, ' ');
}

/** React emits literal characters where the legacy HTML used numeric entities. */
function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function visibleText(html) {
  return decodeEntities(bodyOnly(html).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function assets(html) {
  const found = [];
  // Attribute names are case-insensitive in HTML; React emits srcSet verbatim.
  const pattern = /(?:src|srcset)\s*=\s*"([^"]+)"/gi;
  let match;
  while ((match = pattern.exec(bodyOnly(html))) !== null) {
    const value = match[1];
    if (value.startsWith('/_next/')) continue;
    // The migration made root-relative paths explicit.
    found.push(decodeEntities(value).replace(/^\/assets\//, 'assets/'));
  }
  return found.sort();
}

function classNames(html) {
  const found = new Set();
  const pattern = /class="([^"]*)"/g;
  let match;
  while ((match = pattern.exec(bodyOnly(html))) !== null) {
    match[1].split(/\s+/).filter(Boolean).forEach((name) => found.add(name));
  }
  return [...found].sort();
}

let failures = 0;

for (const page of PAGES) {
  const before = readFileSync(`out-baseline/${page}.html`, 'utf8');
  const after = readFileSync(`out/${page}.html`, 'utf8');
  const problems = [];

  const textBefore = visibleText(before);
  const textAfter = visibleText(after);
  if (textBefore !== textAfter) {
    let at = 0;
    while (at < textBefore.length && textBefore[at] === textAfter[at]) at += 1;
    problems.push(
      `visible text differs at char ${at}\n      before: ...${textBefore.slice(Math.max(0, at - 70), at + 70)}...\n      after : ...${textAfter.slice(Math.max(0, at - 70), at + 70)}...`,
    );
  }

  const assetsBefore = assets(before);
  const assetsAfter = assets(after);
  if (assetsBefore.join('|') !== assetsAfter.join('|')) {
    const missing = assetsBefore.filter((a) => !assetsAfter.includes(a));
    const added = assetsAfter.filter((a) => !assetsBefore.includes(a));
    problems.push(`assets changed — missing ${missing.length}, added ${added.length}`);
    missing.slice(0, 5).forEach((a) => problems.push(`    missing: ${a}`));
    added.slice(0, 5).forEach((a) => problems.push(`    added:   ${a}`));
  }

  const classesBefore = classNames(before);
  const classesAfter = classNames(after);
  const lostClasses = classesBefore.filter((c) => !classesAfter.includes(c));
  if (lostClasses.length) problems.push(`class names lost: ${lostClasses.join(', ')}`);

  const sizeBefore = statSync(`out-baseline/${page}.html`).size;
  const sizeAfter = statSync(`out/${page}.html`).size;
  const delta = (((sizeAfter - sizeBefore) / sizeBefore) * 100).toFixed(1);

  if (problems.length) {
    failures += 1;
    console.log(`FAIL ${page}`);
    problems.forEach((p) => console.log(`  - ${p}`));
  } else {
    console.log(
      `OK   ${page.padEnd(18)} text+assets+classes identical  |  ${(sizeBefore / 1024).toFixed(1)} KB → ${(sizeAfter / 1024).toFixed(1)} KB (${delta > 0 ? '+' : ''}${delta}%)`,
    );
  }
}

process.exit(failures ? 1 : 0);
