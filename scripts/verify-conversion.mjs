/**
 * Fidelity check for the HTML -> JSX migration.
 * Compares visible text and every asset/link reference between the legacy
 * fragment and the converted JSX so nothing is silently dropped.
 *
 * Run: node scripts/verify-conversion.mjs
 */

import { readFileSync } from 'node:fs';

const PAGES = ['home', 'about', 'products', 'manufacturing', 'contact', 'quote'];

function stripComments(source) {
  return source
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
}

/** Visible text with all markup and whitespace differences removed. */
function visibleText(source) {
  return stripComments(source)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{'([{}])'\}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function references(source) {
  const found = [];
  const pattern = /(?:src|srcSet|srcset|href)\s*=\s*(?:"([^"]*)"|\{"((?:[^"\\]|\\.)*)"\})/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const value = match[1] ?? JSON.parse(`"${match[2]}"`);
    // The converter makes root-relative paths explicit.
    found.push(value.replace(/(^|\s)\/assets\//g, '$1assets/'));
  }
  return found.sort();
}

function tagCounts(source) {
  const counts = new Map();
  const pattern = /<([a-zA-Z][-a-zA-Z0-9]*)/g;
  let match;
  while ((match = pattern.exec(stripComments(source))) !== null) {
    const tag = match[1].toLowerCase();
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return counts;
}

let failures = 0;

for (const page of PAGES) {
  const original = readFileSync(`src/content/${page}.html`, 'utf8');
  const converted = readFileSync(`scripts/generated/${page}.jsx.txt`, 'utf8');

  const problems = [];

  const originalText = visibleText(original);
  const convertedText = visibleText(converted);
  if (originalText !== convertedText) {
    let at = 0;
    while (at < originalText.length && originalText[at] === convertedText[at]) at += 1;
    problems.push(
      `text differs at char ${at}\n    original : ...${originalText.slice(Math.max(0, at - 60), at + 60)}...\n    converted: ...${convertedText.slice(Math.max(0, at - 60), at + 60)}...`,
    );
  }

  const originalRefs = references(original);
  const convertedRefs = references(converted);
  if (originalRefs.length !== convertedRefs.length) {
    problems.push(`reference count ${originalRefs.length} -> ${convertedRefs.length}`);
  } else {
    const mismatch = originalRefs.findIndex((value, index) => value !== convertedRefs[index]);
    if (mismatch !== -1) {
      problems.push(`reference differs: ${originalRefs[mismatch]} -> ${convertedRefs[mismatch]}`);
    }
  }

  const originalTags = tagCounts(original);
  const convertedTags = tagCounts(converted);
  for (const [tag, count] of originalTags) {
    const other = convertedTags.get(tag) ?? 0;
    if (other !== count) problems.push(`<${tag}> count ${count} -> ${other}`);
  }

  if (problems.length) {
    failures += 1;
    console.log(`FAIL ${page}`);
    problems.forEach((problem) => console.log(`  - ${problem}`));
  } else {
    console.log(`OK   ${page}  (${originalRefs.length} refs, ${originalText.length} chars of text)`);
  }
}

process.exit(failures ? 1 : 0);
