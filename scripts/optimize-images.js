const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.join(__dirname, '..', 'images');
const OUTPUT_DIR = INPUT_DIR;
const sizes = [400, 800, 1600];

async function processImage(file){
  const inputPath = path.join(INPUT_DIR, file);
  const base = path.parse(file).name;

  for(const w of sizes){
    const outName = `${base}-${w}.jpg`;
    await sharp(inputPath)
      .resize({ width: w })
      .jpeg({ quality: 78, progressive: true })
      .toFile(path.join(OUTPUT_DIR, outName));
    console.log(`Wrote ${outName}`);
  }

  const webpName = `${base}.webp`;
  await sharp(inputPath)
    .webp({ quality: 78 })
    .toFile(path.join(OUTPUT_DIR, webpName));
  console.log(`Wrote ${webpName}`);
}

(async () => {
  const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(jpe?g|png)$/i.test(f));
  for(const f of files){
    try{
      await processImage(f);
    }catch(err){
      console.error(`Feil ved prosessering av ${f}:`, err);
    }
  }
  console.log('Ferdig med bildeoptimalisering');
})();
