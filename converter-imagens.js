import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

    console.log(`Buscando arquivos em: ${targetDir}...`);
    
    // Lê os arquivos do diretório
    const files = await fs.readdir(targetDir);
    
    // Filtra para pegar apenas arquivos jpg, jpeg, png e também pdf
    const targetFiles = files.filter(file => 
      /\.(png|jpe?g|pdf)$/i.test(file)
    );

    if (targetFiles.length === 0) {
      console.log('✨ Nenhuma imagem ou PDF encontrado para converter.');
      return;
    }

    console.log(`Encontrados ${targetFiles.length} arquivos. Iniciando conversão para WebP...`);

    let successCount = 0;

    for (const file of targetFiles) {
      const filePath = path.join(targetDir, file);
      const isPdf = /\.pdf$/i.test(file);
      // Remove a extensão antiga e coloca .webp
      const outputName = path.parse(file).name + '.webp';
      const outputPath = path.join(targetDir, outputName);

      try {
        let fileToConvert = filePath;
        let tempPng = null;

        // Caso seja PDF, usamos a ferramenta do sistema pdftoppm para extrair a 1ª página em imagem temporária
        if (isPdf) {
          const tempPrefix = path.join(targetDir, `temp_${path.parse(file).name}`);
          
          try {
            // Extrai a página 1 (-f 1 -l 1) garantindo nome de arquivo sem numeração extra (-singlefile)
            await execAsync(`pdftoppm -f 1 -l 1 -singlefile -png "${filePath}" "${tempPrefix}"`);
            tempPng = `${tempPrefix}.png`;
            fileToConvert = tempPng;
          } catch (pdfErr) {
             throw new Error(`Erro no pdftoppm (Certifique-se de que poppler-utils está instalado). Detalhes: ${pdfErr.message}`);
          }
        }

        // Usa o Sharp para transformar em WebP a partir da imagem (ou da imagem temporária extraída do PDF)
        await sharp(fileToConvert)
          .webp({ quality: 80 }) // Qualidade compressão 80
          .toFile(outputPath);
        
        console.log(`✅ Convertido: ${file} -> ${outputName}`);
        successCount++;
        
        // Apaga a imagem temporária caso tenha vido de um pdf
        if (tempPng) {
          await fs.unlink(tempPng).catch(() => {});
        }

        // Apaga o arquivo original (JPEG, PNG ou PDF)
        await fs.unlink(filePath);
        console.log(`🗑️  Original apagado: ${file}`);
      } catch (err) {
        console.error(`❌ Erro ao converter ${file}:`, err.message);
      }
    }
    
    console.log(`\n🎉 Conversão concluída! ${successCount}/${targetFiles.length} arquivos convertidos com sucesso.`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Diretório não encontrado: ${targetDir}`);
    } else {
      console.error('❌ Erro inesperado:', error.message);
    }
  }
}

convertToWebp();
