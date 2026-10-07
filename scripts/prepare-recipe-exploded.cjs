const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

// Measured cell bounds after inspecting each generated atlas.
const recipes = {
  'poulet-dynamite': [
    ['volaille', 0, 0, 735, 450], ['sauce', 735, 0, 519, 450],
    ['sesame', 0, 450, 627, 375], ['pousses', 627, 450, 627, 375],
    ['barquette', 0, 825, 710, 429],
  ],
  'plateau-signature': [
    ['navette', 0, 0, 627, 530], ['wrap', 627, 0, 627, 530],
    ['briochettes', 0, 530, 627, 470], ['mousseline', 627, 530, 627, 470],
  ],
  'verrine-graines-germees': [
    ['veloute', 0, 0, 627, 435], ['graines', 627, 0, 627, 435],
    ['burger', 0, 435, 627, 465], ['huile', 627, 435, 627, 465],
  ],
  'mignardises-sucrees': [
    ['sable', 0, 0, 627, 420], ['fruits', 627, 0, 627, 420],
    ['mascarpone', 0, 420, 627, 415], ['caramel', 627, 420, 627, 415],
    ['speculoos', 0, 835, 627, 419],
  ],
  'number-cake': [
    ['sable', 0, 0, 627, 450], ['ganache', 627, 0, 627, 450],
    ['fruits', 0, 450, 627, 395], ['macarons', 627, 450, 627, 395],
    ['fleurs', 0, 845, 627, 409],
  ],
};

async function main() {
  for (const [product, cells] of Object.entries(recipes)) {
    const source = path.resolve(__dirname, '../assets/product-exploded', product, 'ingredients-atlas.png');
    const destination = path.resolve(__dirname, '../public/products/exploded', product);
    await fs.mkdir(destination, { recursive: true });
    const metadata = await sharp(source).metadata();
    if (!metadata.hasAlpha) throw new Error(product + ': atlas has no transparency');
    for (const [id, left, top, width, height] of cells) {
      const cell = await sharp(source).extract({ left, top, width, height }).png().toBuffer();
      const output = path.join(destination, id + '.webp');
      await sharp(cell).trim({ threshold: 15 }).resize({ width: 560, withoutEnlargement: true })
        .webp({ quality: 88, alphaQuality: 100 }).toFile(output);
      if (!(await sharp(output).metadata()).hasAlpha) throw new Error(product + '/' + id + ': lost alpha');
    }
    console.log(product + ': ' + cells.length + ' transparent ingredient assets');
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
