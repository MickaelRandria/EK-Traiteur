const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');
const path = require('node:path');

async function main() {
  const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = await chromium.launch({ headless: true, executablePath: existsSync(chrome) ? chrome : undefined });
  const output = path.resolve('output/bao-exploded');
  await fs.mkdir(output, { recursive: true });
  try {
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = [];
      await page.addInitScript(() => sessionStorage.setItem('ek_intro_seen', 'true'));
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(process.env.BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Découvrir Bao moelleux', exact: false }).click();
      const detail = page.getByRole('dialog').last();
      const surface = detail.locator('.product-exploded-surface');
      await surface.waitFor();
      await surface.click();
      await page.waitForTimeout(1600);
      assert.equal(await surface.getAttribute('aria-expanded'), 'true');
      assert.equal(await detail.locator('.ingredient-label').count(), 6);
      assert.deepEqual(await detail.locator('.product-exploded img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src)), []);
      assert(await detail.evaluate(element => element.scrollWidth <= element.clientWidth), `Overflow at ${width}`);
      const labels = await detail.locator('.ingredient-label').evaluateAll(elements => elements.map(element => {
        const r = element.getBoundingClientRect();
        return { text: element.textContent, left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      }));
      for (const label of labels) assert(label.left >= 0 && label.right <= width, `Label outside screen: ${label.text}`);
      const toggleTop = await detail.locator('.product-exploded-toggle').evaluate(element => element.getBoundingClientRect().top);
      for (const label of labels) assert(label.bottom < toggleTop, `Label overlaps toggle: ${label.text}`);
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i], b = labels[j];
        assert(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top), `Overlapping labels: ${a.text}, ${b.text}`);
      }
      await page.screenshot({ path: path.join(output, `expanded-${width}.png`) });
      await detail.locator('.product-exploded-toggle').click();
      await page.waitForTimeout(1000);
      assert.equal(await surface.getAttribute('aria-expanded'), 'false');
      await surface.focus();
      await page.keyboard.press('Enter');
      assert.equal(await surface.getAttribute('aria-expanded'), 'true');
      await detail.getByRole('button', { name: 'Retour aux créations' }).click();
      await page.getByRole('button', { name: 'Découvrir Bao moelleux', exact: false }).click();
      assert.equal(await page.locator('.product-exploded-surface').getAttribute('aria-expanded'), 'false');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload({ waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Découvrir Bao moelleux', exact: false }).click();
      await page.locator('.product-exploded-surface').click();
      await page.waitForTimeout(100);
      assert.equal(await page.locator('.product-exploded-whole').evaluate(element => getComputedStyle(element).opacity), '0');
      assert.deepEqual(errors, []);
      console.log(`${width}px: images, labels, click, keyboard, reassembly, reopen and reduced motion OK`);
      await page.close();
    }
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
