import { chromium } from 'playwright';

const BASE = process.argv[2] || 'https://abdelhameed-ten.vercel.app';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleMessages = [];
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  }
});
page.on('pageerror', (err) => {
  consoleMessages.push(`[pageerror] ${err.message}`);
});

console.log(`Loading ${BASE}/ ...`);
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
console.log('Initial URL:', page.url());
console.log('Initial H1:', (await page.locator('h1').first().textContent())?.trim().slice(0, 60));

const clicks = [
  ['About', 'about.php'],
  ['Products', 'products.php'],
  ['Manufacturing', 'manufacturing.php'],
  ['Contact', 'contact.php'],
  ['Home', ''],
];

for (const [label, expected] of clicks) {
  const link = page.locator(`.nav-links a:has-text("${label}")`).first();
  const visible = await link.isVisible().catch(() => false);
  if (!visible) {
    console.log(`${label}: LINK NOT VISIBLE`);
    continue;
  }
  const box = await link.boundingBox();
  const covered = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    return el ? `${el.tagName}.${el.className}`.slice(0, 80) : 'null';
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });

  await link.click({ timeout: 5000 }).catch((e) => console.log(`${label}: CLICK FAILED - ${e.message.split('\n')[0]}`));
  await page.waitForTimeout(2500);
  const url = page.url();
  const ok = expected ? url.includes(expected) : (url === `${BASE}/` || url === `${BASE}`);
  console.log(`${label}: ${ok ? 'OK' : 'FAILED'} -> ${url} (elementAtPoint: ${covered})`);
}

console.log('\n--- console errors/warnings ---');
console.log(consoleMessages.length ? consoleMessages.join('\n') : '(none)');

await browser.close();
