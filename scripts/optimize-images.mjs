import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDir = join(__dirname, '../src/assets/constructor-categories');

async function optimizeImage(inputPath) {
  try {
    const stats = await stat(inputPath);
    const originalSize = stats.size;
    const tempPath = inputPath + '.tmp';
    
    await sharp(inputPath)
      .resize(300, 300, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
      })
      .toFile(tempPath);
    
    const newStats = await stat(tempPath);
    const newSize = newStats.size;
    
    // Replace original with optimized
    await rename(tempPath, inputPath);
    
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`${inputPath.split('/').pop()}: ${(originalSize / 1024).toFixed(2)} KB → ${(newSize / 1024).toFixed(2)} KB (${reduction}% reduction)`);
    
    return { originalSize, newSize };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  try {
    const files = await readdir(imagesDir);
    const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    
    console.log(`Found ${imageFiles.length} images to optimize...\n`);
    
    let totalOriginal = 0;
    let totalNew = 0;
    
    for (const file of imageFiles) {
      const inputPath = join(imagesDir, file);
      
      const result = await optimizeImage(inputPath);
      if (result) {
        totalOriginal += result.originalSize;
        totalNew += result.newSize;
      }
    }
    
    console.log(`\nTotal: ${(totalOriginal / 1024).toFixed(2)} KB → ${(totalNew / 1024).toFixed(2)} KB (${((1 - totalNew / totalOriginal) * 100).toFixed(1)}% reduction)`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
