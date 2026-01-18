const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'images');

// Configuration
const config = {
  maxWidth: 1920,
  maxHeight: 1080,
  jpegQuality: 85,
  webpQuality: 85
};

async function optimizeImages() {
  console.log('Starting image optimization...');
  console.log(`Images directory: ${imagesDir}`);

  // Check if images directory exists
  if (!fs.existsSync(imagesDir)) {
    console.error(`Images directory not found: ${imagesDir}`);
    process.exit(1);
  }

  // Get all JPG files
  const files = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg)$/i.test(file));

  if (files.length === 0) {
    console.log('No JPG images found to optimize.');
    return;
  }

  console.log(`Found ${files.length} image(s) to optimize:\n`);

  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const baseName = path.basename(file, path.extname(file));
    const webpPath = path.join(imagesDir, `${baseName}.webp`);

    console.log(`Processing: ${file}`);

    try {
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      console.log(`  Original size: ${metadata.width}x${metadata.height}`);

      // Calculate resize dimensions if needed
      let width = metadata.width;
      let height = metadata.height;

      if (width > config.maxWidth || height > config.maxHeight) {
        const ratio = Math.min(config.maxWidth / width, config.maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        console.log(`  Resizing to: ${width}x${height}`);
      } else {
        console.log('  No resize needed');
      }

      // Optimize original JPG
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: config.jpegQuality })
        .toFile(inputPath + '.tmp');

      // Replace original with optimized version
      fs.renameSync(inputPath + '.tmp', inputPath);
      console.log(`  ✓ Optimized JPG`);

      // Create WebP version
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: config.webpQuality })
        .toFile(webpPath);

      // Get file sizes
      const jpgSize = fs.statSync(inputPath).size;
      const webpSize = fs.statSync(webpPath).size;
      const savings = ((1 - webpSize / jpgSize) * 100).toFixed(1);

      console.log(`  ✓ Created WebP version`);
      console.log(`  JPG size: ${(jpgSize / 1024).toFixed(1)} KB`);
      console.log(`  WebP size: ${(webpSize / 1024).toFixed(1)} KB (${savings}% smaller)`);
      console.log('');

    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
      console.log('');
    }
  }

  console.log('Image optimization complete!');
}

// Run the optimization
optimizeImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
