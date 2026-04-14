import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeLargeWebp(dir) {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!file.endsWith('.webp')) continue;
      
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      
      // Se > 500KB, comprime
      if (stat.size > 500 * 1024) {
        console.log(`Otimizando imagem pesada: ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
        const buffer = await fs.readFile(filePath);
        await sharp(buffer)
          .webp({ quality: 80, effort: 6 })
          .toFile(filePath);
        const newStat = await fs.stat(filePath);
        console.log(`✅ Concluído: novo tamanho = ${(newStat.size / 1024).toFixed(2)} KB`);
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('Erro:', err);
  }
}

async function run() {
  const assetsDir = path.join(__dirname, 'public', 'assets');
  const mobileDir = path.join(__dirname, 'public', 'assets', 'mobile');
  
  await optimizeLargeWebp(assetsDir);
  await optimizeLargeWebp(mobileDir);
}

run();
