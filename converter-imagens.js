import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Pega o diretório atual do script para suportar Módulos ES (type: "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho alvo: public/assets/produtos
const targetDir = path.join(__dirname, 'public', 'assets', 'produtos');

async function convertToWebp() {
  try {
    // Importa o pacote sharp (necessário estar instalado)
    let sharp;
    try {
      sharp = (await import('sharp')).default;
    } catch (e) {
      console.error('❌ O pacote "sharp" não foi encontrado.');
      console.error('👉 Por favor, instale-o rodando: npm install sharp --save-dev');
      process.exit(1);
    }

    console.log(`Buscando imagens em: ${targetDir}...`);
    
    // Lê os arquivos do diretório
    const files = await fs.readdir(targetDir);
    
    // Filtra para pegar apenas arquivos jpg, jpeg e png
    const imageFiles = files.filter(file => 
      /\.(png|jpe?g)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log('✨ Nenhuma imagem PNG, JPG ou JPEG encontrada para converter.');
      return;
    }

    console.log(`Encontradas ${imageFiles.length} imagens. Iniciando conversão para WebP...`);

    let successCount = 0;

    for (const file of imageFiles) {
      const filePath = path.join(targetDir, file);
      // Remove a extensão antiga e coloca .webp
      const outputName = path.parse(file).name + '.webp';
      const outputPath = path.join(targetDir, outputName);

      try {
        await sharp(filePath)
          .webp({ quality: 80 }) // Você pode ajustar a qualidade (0-100)
          .toFile(outputPath);
        
        console.log(`✅ Convertido: ${file} -> ${outputName}`);
        successCount++;
        
        // Descomente a linha abaixo se quiser apagar a imagem original automaticamente
        // await fs.unlink(filePath);
      } catch (err) {
        console.error(`❌ Erro ao converter ${file}:`, err.message);
      }
    }
    
    console.log(`\n🎉 Conversão concluída! ${successCount}/${imageFiles.length} imagens convertidas com sucesso.`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Diretório não encontrado: ${targetDir}`);
    } else {
      console.error('❌ Erro inesperado:', error.message);
    }
  }
}

convertToWebp();
