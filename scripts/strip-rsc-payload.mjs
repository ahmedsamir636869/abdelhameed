import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'out');

function walkHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function keepScript(tag) {
  const openTag = tag.match(/^<script\b[^>]*>/i)?.[0] || '';

  if (/type=["']application\/ld\+json["']/i.test(openTag)) {
    return true;
  }

  const srcMatch = openTag.match(/\ssrc=["']([^"']+)["']/i);
  if (!srcMatch) {
    return false;
  }

  const src = srcMatch[1];
  if (src.startsWith('/_next/')) {
    return false;
  }

  return src.startsWith('/assets/') || src.startsWith('http://') || src.startsWith('https://');
}

function keepLink(tag) {
  const hrefMatch = tag.match(/\shref=["']([^"']+)["']/i);
  if (!hrefMatch) {
    return true;
  }

  const href = hrefMatch[1];
  return !(href.startsWith('/_next/static/chunks/') && href.endsWith('.js'));
}

function injectJsonLd(html) {
  if (/type=["']application\/ld\+json["']/.test(html)) {
    return html;
  }

  const schemaPath = path.join(process.cwd(), 'public', 'organization.json');
  if (!fs.existsSync(schemaPath)) {
    return html;
  }

  const json = fs.readFileSync(schemaPath, 'utf8').trim();
  const tag = `<script type="application/ld+json">${json}</script>`;
  if (html.includes('</head>')) {
    return html.replace('</head>', `${tag}</head>`);
  }

  return html;
}

function injectPageScripts(html) {
  const scriptsAttr = html.match(/data-page-scripts="([^"]+)"/);
  if (!scriptsAttr) {
    return html;
  }

  const tags = scriptsAttr[1]
    .split(/\s+/)
    .filter(Boolean)
    .filter((src) => !html.includes(`src="${src}"`))
    .map((src) => `<script src="${src}" defer></script>`)
    .join('');

  if (!tags) {
    return html;
  }

  if (html.includes('</body>')) {
    return html.replace('</body>', `${tags}</body>`);
  }

  return html + tags;
}

function strip(html) {
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (tag) => (keepScript(tag) ? tag : ''));
  html = html.replace(/<script>self\.__next_f[\s\S]*?<\/script>/g, '');
  html = html.replace(/<script>\(self\.__next_f=self\.__next_f\|\|\[\]\)\.push\([\s\S]*?<\/script>/g, '');
  html = html.replace(/<link\b[^>]*>/gi, (tag) => (keepLink(tag) ? tag : ''));
  html = html.replace(/<!--\$-->/g, '');
  html = html.replace(/<!--\/\$-->/g, '');
  html = injectJsonLd(html);
  html = injectPageScripts(html);
  html = html.replace(/\n{3,}/g, '\n');
  return html;
}

const files = walkHtmlFiles(outDir);
if (!files.length) {
  console.error('No HTML files found in out/. Run next build first.');
  process.exit(1);
}

let saved = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = strip(before);
  fs.writeFileSync(file, after);
  saved += before.length - after.length;
  console.log(
    `${path.relative(outDir, file).padEnd(28)} ${(before.length / 1024).toFixed(1)} KB → ${(after.length / 1024).toFixed(1)} KB`,
  );
}

console.log(`Removed ${(saved / 1024).toFixed(1)} KB of duplicate React payload.`);
