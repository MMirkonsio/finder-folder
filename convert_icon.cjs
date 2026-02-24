const sharp = require('sharp');

const fs = require('fs');
const path = require('path');

const inputWebp = path.join(__dirname, 'public', 'img', 'LogoHHE 2.webp');
const tempPng = path.join(__dirname, 'public', 'img', 'temp_logo.png');
const outputIco = path.join(__dirname, 'public', 'img', 'icon.ico');

async function convert() {
  try {
    console.log('Converting WebP to PNG...');
    await sharp(inputWebp).toFile(tempPng);
    
    console.log('Converting PNG to ICO...');
    const pngToIco = (await import('png-to-ico')).default || await import('png-to-ico');
    const buf = await pngToIco(tempPng);
    fs.writeFileSync(outputIco, buf);
    
    console.log('Cleanup...');
    fs.unlinkSync(tempPng);
    
    console.log('Done! Generated:', outputIco);
  } catch (err) {
    console.error('Error:', err);
  }
}

convert();
