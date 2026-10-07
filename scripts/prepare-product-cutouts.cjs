const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const products = ['bao-poulet', 'poulet-dynamite', 'plateau-signature', 'verrine-graines-germees', 'mignardises-sucrees', 'number-cake'];
const directory = path.join(__dirname, '../public/products/cutouts');

async function main() {
  for (const product of products) {
    const source = path.join(directory, `${product}-isolated.png`);
    const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let transparent = 0;
    let visible = 0;
    for (let index = 3; index < data.length; index += 4) {
      if (data[index] === 0) transparent++;
      if (data[index] > 0) visible++;
    }
    if (!transparent || !visible) throw new Error(`${product}: invalid transparency`);
    const destination = path.join(directory, `${product}-isolated.webp`);
    await sharp(source).resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100 }).toFile(destination);
    const metadata = await sharp(destination).metadata();
    if (!metadata.hasAlpha) throw new Error(`${product}: alpha lost during conversion`);
    console.log(`${product}: ${info.width}x${info.height}, ${Math.round(100 * transparent / (info.width * info.height))}% transparent, ${Math.round((await fs.stat(destination)).size / 1024)} KB WebP`);
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
