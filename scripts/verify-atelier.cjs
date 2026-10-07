const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');
const path = require('node:path');

const output = path.resolve(__dirname, '../output/atelier');
const url = process.env.ATELIER_URL || 'http://localhost:3001';
const installedChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browserPath = process.env.ATELIER_BROWSER || (existsSync(installedChrome) ? installedChrome : undefined);

async function settle(page) {
  await page.waitForTimeout(650);
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: browserPath, headless: true });
  const errors = [];
  const report = [];
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 320, height: 740 }]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce', timezoneId: 'Europe/Paris' });
      await context.addInitScript(() => {
        sessionStorage.setItem('ek_intro_seen', 'true');
        window.open = url => { window.__testWhatsAppUrl = url; return null; };
      });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.locator('.hero-product').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await settle(page);
      assert.equal(await page.locator('.collection-product').count(), 6);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${viewport.width}`);
      await page.screenshot({ path: path.join(output, `home-${viewport.width}.png`) });
      for (const article of await page.locator('.collection-product').all()) { await article.scrollIntoViewIfNeeded(); await settle(page); }
      const brokenImages = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src));
      assert.deepEqual(brokenImages, [], `Broken images at ${viewport.width}`);
      await page.locator('#carte').evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 100, behavior: 'instant' }));
      await settle(page);
      await page.screenshot({ path: path.join(output, `collection-${viewport.width}.png`) });
      await page.getByRole('button', { name: 'Découvrir Bao moelleux', exact: false }).click();
      const detail = page.getByRole('dialog').last();
      await detail.getByRole('heading', { name: 'Le bao laqué' }).waitFor();
      await settle(page);
      await page.screenshot({ path: path.join(output, `product-${viewport.width}.png`) });
      assert(await detail.evaluate(element => element.scrollWidth <= element.clientWidth), 'Product overflow');
      await detail.getByRole('button', { name: 'Choisir pour ma réception' }).focus();
      await page.keyboard.press('Tab');
      assert(await detail.getByRole('button', { name: 'Retour aux créations' }).evaluate(element => document.activeElement === element), 'Keyboard focus escaped product dialog');
      await detail.getByRole('button', { name: 'Retirer 10 pièces' }).isDisabled().then(disabled => assert(disabled));
      await detail.getByRole('button', { name: 'Ajouter 10 pièces' }).click();
      await detail.getByRole('button', { name: 'Choisir pour ma réception' }).click();
      await page.getByRole('button', { name: 'Votre réception, 30 pièces' }).click();
      const selection = page.getByRole('dialog', { name: 'Votre réception', exact: true });
      await selection.getByRole('heading', { name: 'Votre réception.' }).waitFor();
      await settle(page);
      await page.screenshot({ path: path.join(output, `reception-${viewport.width}.png`) });
      assert(await selection.evaluate(element => element.scrollWidth <= element.clientWidth), 'Reception overflow');
      await selection.getByRole('button', { name: /Combien d'invités/ }).click();
      const composer = page.getByRole('dialog', { name: 'Composer ma réception' });
      for (let step = 0; step < 3; step++) await composer.getByRole('button', { name: "Moins d'invités" }).click();
      await composer.getByRole('button', { name: 'Choisir mes créations' }).click();
      await selection.getByText('15', { exact: true }).waitFor();
      await settle(page);
      await page.screenshot({ path: path.join(output, `reception-${viewport.width}.png`) });
      await selection.getByRole('button', { name: 'Préparer ma demande' }).click();
      const checkout = page.getByRole('dialog', { name: 'Finaliser ma commande' });
      await checkout.getByLabel('Nom complet ou société').fill('Test Atelier');
      await checkout.getByLabel('Téléphone', { exact: true }).fill('0612345678');
      const date = await checkout.locator('#checkout-date').getAttribute('min');
      await checkout.locator('#checkout-date').fill(date);
      await checkout.getByRole('radio', { name: /Retrait/ }).click();
      await checkout.getByRole('button', { name: 'Envoyer sur WhatsApp' }).click();
      const whatsApp = await page.evaluate(() => window.__testWhatsAppUrl);
      assert(whatsApp && decodeURIComponent(whatsApp).includes('30 × Bao'), 'Incorrect order payload');
      assert(decodeURIComponent(whatsApp).includes('48,00'), 'Incorrect order total');
      assert(decodeURIComponent(whatsApp).includes('15 invités'), 'Event plan missing from order');
      report.push(`${viewport.width}px: 6 products, no overflow, images loaded, product → 30 pieces → reception → checkout → intercepted WhatsApp payload OK`);
      await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Europe/Paris' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800);
    await page.getByRole('button', { name: 'Plateaux Salés', exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll('.collection-product').length === 1);
    assert(await page.locator('.collection-product').innerText().then(text => text.includes('Les pièces signature')));
    await page.getByRole('button', { name: 'Toutes les créations', exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll('.collection-product').length === 6);
    await page.getByRole('button', { name: /Enregistrer Bao moelleux/ }).click();
    await page.getByRole('button', { name: /Retirer Bao moelleux.*des favoris/ }).waitFor();
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Retirer Bao moelleux.*des favoris/ }).waitFor();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('button', { name: 'Mes favoris (1)' }).click();
    const favorites = page.getByRole('dialog', { name: 'Mes favoris', exact: true });
    await favorites.getByText('Le bao laqué').waitFor();
    await favorites.getByRole('button', { name: 'Fermer', exact: true }).click();
    await page.getByRole('button', { name: 'Rechercher une création', exact: true }).click();
    const search = page.getByRole('dialog', { name: 'Rechercher une création', exact: true });
    await search.getByRole('searchbox').fill('caramel');
    await search.getByText('1 création', { exact: true }).waitFor();
    assert(await search.evaluate(element => element.scrollWidth <= element.clientWidth), 'Search overflow');
    await search.getByRole('button', { name: /L’instant sucré/ }).click();
    const sweet = page.locator('.product-dialog');
    await sweet.getByRole('heading', { name: 'L’instant sucré' }).waitFor();
    await sweet.getByRole('button', { name: 'Retour aux créations' }).click();
    await search.getByRole('button', { name: 'Fermer la recherche' }).click();
    await page.getByRole('button', { name: 'Filtrer', exact: true }).click();
    const filter = page.getByRole('dialog', { name: 'Vos envies, en détail' });
    await filter.getByRole('button', { name: 'Volaille & Viandes', exact: true }).click();
    await filter.getByRole('button', { name: 'Voir 2 créations' }).click();
    await page.waitForFunction(() => document.querySelectorAll('.collection-product').length === 2);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Filtered collection overflow');
    await context.close();
    report.push('Normal motion on mobile: categories, saved favorites, favorites panel, search, product navigation and dietary filters OK.');
    assert.deepEqual(errors, [], 'Browser runtime errors');
    console.log(report.join('\n'));
    await fs.writeFile(path.join(output, 'verification.txt'), report.join('\n') + '\nNo runtime errors. No message sent.\n');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
