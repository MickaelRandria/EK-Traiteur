const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generate() {
  const sourcePath = path.join(__dirname, '../public/CARTE EK.png');
  const publicDir = path.join(__dirname, '../public');

  console.log('Reading source image from:', sourcePath);
  const trimmedBuffer = await sharp(sourcePath).trim().png().toBuffer();
  const trimmedMeta = await sharp(trimmedBuffer).metadata();
  console.log('Trimmed dimensions:', trimmedMeta.width, 'x', trimmedMeta.height);

  const aspectRatio = trimmedMeta.width / trimmedMeta.height;

  // Helper to composite logo on dark background #161914
  async function createIcon(size, targetLogoWidth, outputPath) {
    const targetLogoHeight = Math.round(targetLogoWidth / aspectRatio);
    const resizedLogo = await sharp(trimmedBuffer)
      .resize(targetLogoWidth, targetLogoHeight, { fit: 'inside' })
      .toBuffer();

    const resizedMeta = await sharp(resizedLogo).metadata();
    const left = Math.round((size - resizedMeta.width) / 2);
    const top = Math.round((size - resizedMeta.height) / 2);

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 22, g: 25, b: 20, alpha: 1 } // #161914
      }
    })
    .composite([{ input: resizedLogo, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

    console.log(`Generated ${path.basename(outputPath)} (${size}x${size}, logo: ${resizedMeta.width}x${resizedMeta.height})`);
  }

  // 1. Standard 512x512
  await createIcon(512, 440, path.join(publicDir, 'pwa-512x512.png'));

  // 2. Standard 192x192
  await createIcon(192, 165, path.join(publicDir, 'pwa-192x192.png'));

  // 3. Maskable 512x512 (Safe area circle radius = 40% = 205px, width 350px fits strictly inside)
  await createIcon(512, 350, path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 4. Apple Touch Icon 180x180
  await createIcon(180, 154, path.join(publicDir, 'apple-touch-icon.png'));

  // 5. Favicon 64x64
  await createIcon(64, 56, path.join(publicDir, 'favicon.png'));

  // 6. SVG icons with embedded base64 of the trimmed logo
  const logoBase64 = trimmedBuffer.toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  // Regular SVG (512x512)
  const logoW = 440;
  const logoH = Math.round(logoW / aspectRatio);
  const logoX = Math.round((512 - logoW) / 2);
  const logoY = Math.round((512 - logoH) / 2);

  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#161914" />
  <image href="${logoDataUri}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
  console.log('Generated icon.svg');

  // Maskable SVG (no rx, larger margin)
  const maskLogoW = 350;
  const maskLogoH = Math.round(maskLogoW / aspectRatio);
  const maskLogoX = Math.round((512 - maskLogoW) / 2);
  const maskLogoY = Math.round((512 - maskLogoH) / 2);

  const iconMaskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#161914" />
  <image href="${logoDataUri}" x="${maskLogoX}" y="${maskLogoY}" width="${maskLogoW}" height="${maskLogoH}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), iconMaskableSvg);
  console.log('Generated icon-maskable.svg');

  console.log('All PWA icons generated successfully from CARTE EK.png!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
