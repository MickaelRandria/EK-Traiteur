const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const source = path.resolve('assets/product-exploded/bao-poulet/ingredients-atlas.png');
  const destination = path.resolve('public/products/exploded/bao-poulet');
  await fs.mkdir(destination, { recursive: true });
  // Cell boundaries measured on the generated atlas; objects do not overlap.
  const cells = [
    ['bao', 0, 0, 627, 525], ['poulet', 627, 0, 627, 525],
    ['concombre', 0, 525, 627, 335], ['carottes', 627, 525, 627, 335],
    ['sauce', 0, 860, 627, 394], ['buns', 627, 860, 627, 394],
  ];
  for (const [id, left, top, width, height] of cells) {
    const cell = await sharp(source).extract({ left, top, width, height }).png().toBuffer();
    await sharp(cell).trim({ threshold: 15 }).resize({ width: 560, withoutEnlargement: true })
      .webp({ quality: 88 }).toFile(path.join(destination, `${id}.webp`));
  }
  console.log('Prepared 6 transparent ingredient assets.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
