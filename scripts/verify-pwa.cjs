const { chromium } = require('playwright');
const { existsSync } = require('node:fs');
const assert = require('node:assert/strict');

async function main() {
  const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = await chromium.launch({ executablePath: process.env.ATELIER_BROWSER || (existsSync(chrome) ? chrome : undefined), headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.ATELIER_URL || 'http://127.0.0.1:3002', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await page.reload({ waitUntil: 'networkidle' });
    await context.setOffline(true);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.collection-product').count(), 6);
    await page.getByRole('button', { name: 'Découvrir Bao moelleux', exact: false }).click();
    const detail = page.getByRole('dialog').last();
    await detail.getByRole('heading', { name: 'Le bao laqué' }).waitFor();
    const image = detail.locator('img').first();
    await image.evaluate(element => element.decode());
    assert(await image.evaluate(element => element.naturalWidth > 0));
    assert.deepEqual(errors, []);
    console.log('Production PWA: service worker active, offline reload, 6 products and cutout detail OK.');
    await context.close();
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
