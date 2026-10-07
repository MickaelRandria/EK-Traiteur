const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');
const path = require('node:path');

const RECIPES = [
  { id: 'bao-poulet', name: 'Bao moelleux', count: 6 },
  { id: 'poulet-dynamite', name: 'Barquette de poulet dynamite', count: 5 },
  { id: 'plateau-signature', name: 'Plateau dégustation', count: 4 },
  { id: 'verrine-graines-germees', name: 'Verrine crémeuse', count: 4 },
  { id: 'mignardises-sucrees', name: 'Duo tartelettes', count: 5 },
  { id: 'number-cake', name: 'Number cake artisanal', count: 5 },
];

async function main() {
  const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = await chromium.launch({ headless: true, executablePath: existsSync(chrome) ? chrome : undefined });
  const output = path.resolve(__dirname, '../output/recipe-exploded');
  await fs.mkdir(output, { recursive: true });
  try {
    for (const viewport of [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
      const mobile = viewport.width < 900;
      const page = await browser.newPage({ viewport, hasTouch: mobile, isMobile: mobile });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => sessionStorage.setItem('ek_intro_seen', 'true'));
      await page.goto(process.env.BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
      for (const recipe of RECIPES) {
        const open = page.getByRole('button', { name: new RegExp('^Découvrir ' + recipe.name) });
        await open.click();
        const detail = page.getByRole('dialog').last();
        const scene = detail.locator(`[data-product-id="${recipe.id}"]`);
        await scene.waitFor();
        const surface = scene.locator('.product-exploded-surface');
        const toggle = scene.locator('.product-exploded-toggle');
        assert.equal(await surface.getAttribute('aria-expanded'), 'false');
        if (mobile) await toggle.tap(); else await toggle.click();
        await page.waitForTimeout(1500);
        assert.equal(await surface.getAttribute('aria-expanded'), 'true');
        assert.equal(await scene.locator('.ingredient-label').count(), recipe.count);
        assert.deepEqual(await scene.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src)), []);
        const ingredients = await scene.locator('.product-exploded-part img').evaluateAll(images => images.map(image => new URL(image.src).pathname));
        assert(ingredients.every(src => src.startsWith(`/products/exploded/${recipe.id}/`)), 'Wrong recipe images');
        const labels = await scene.locator('.ingredient-label').evaluateAll(elements => elements.map(element => {
          const box = element.getBoundingClientRect();
          const note = element.querySelector('span');
          return { title: element.querySelector('strong').textContent, note: note.textContent, shown: getComputedStyle(note).display !== 'none', left: box.left, right: box.right, top: box.top, bottom: box.bottom };
        }));
        const toggleTop = await toggle.evaluate(element => element.getBoundingClientRect().top);
        for (const label of labels) {
          assert(label.title && label.note && label.shown, 'Missing name or visible description');
          assert(label.left >= 0 && label.right <= viewport.width, 'Label outside viewport');
          assert(label.bottom < toggleTop, `Label overlaps control: ${recipe.id}/${label.title}`);
        }
        for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i], b = labels[j];
          assert(!(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top), `Overlapping captions: ${recipe.id}`);
        }
        assert(await detail.evaluate(element => element.scrollWidth <= element.clientWidth), 'Horizontal overflow');
        await page.screenshot({ path: path.join(output, `${recipe.id}-${viewport.width}.png`) });
        if (recipe.id === 'number-cake') assert(await detail.getByRole('button', { name: 'Ajouter une demande sur mesure' }).count() === 1, 'Quote action missing');
        if (mobile) await toggle.tap(); else await toggle.click();
        await page.waitForTimeout(900);
        assert.equal(await surface.getAttribute('aria-expanded'), 'false');
        await surface.focus();
        await page.keyboard.press('Enter');
        assert.equal(await surface.getAttribute('aria-expanded'), 'true');
        await detail.getByRole('button', { name: 'Retour aux créations' }).click();
        await page.waitForTimeout(400);
        console.log(`${viewport.width}px ${recipe.id}: ingredients, captions, touch/keyboard and reassembly OK`);
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload({ waitUntil: 'networkidle' });
      await page.getByRole('button', { name: /^Découvrir Number cake artisanal/ }).click();
      await page.locator('.product-exploded-toggle').click();
      await page.waitForTimeout(100);
      assert.equal(await page.locator('.product-exploded-whole').evaluate(element => getComputedStyle(element).opacity), '0');
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
