const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [16, 32, 48, 128];
const icons = ['badger_icon', 'badger_icon_active'];

async function convertSvgToPng() {
  for (const icon of icons) {
    const svgPath = path.join(__dirname, 'images', `${icon}.svg`);
    const svgBuffer = await fs.readFile(svgPath);

    for (const size of sizes) {
      const pngPath = path.join(__dirname, 'images', `${icon}.png`);
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(pngPath.replace('.png', `_${size}.png`));
      console.log(`Converted ${icon} to ${size}x${size} PNG`);
    }
  }
}

convertSvgToPng().catch(console.error); 