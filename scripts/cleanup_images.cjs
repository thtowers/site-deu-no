const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const srcDir = path.join(rootDir, 'src');
const removeDir = path.join(rootDir, 'remove');

if (!fs.existsSync(removeDir)) {
    fs.mkdirSync(removeDir);
}

// 1. Coletar todos os arquivos de código
const codeExtensions = ['.js', '.jsx', '.html', '.css'];
let codeContents = '';

function collectCode(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            collectCode(fullPath);
        } else if (codeExtensions.some(ext => fullPath.endsWith(ext))) {
            codeContents += fs.readFileSync(fullPath, 'utf8') + '\n';
        }
    }
}
collectCode(srcDir);
if (fs.existsSync(path.join(rootDir, 'index.html'))) {
    codeContents += fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8') + '\n';
}

// 2. Coletar todas as imagens na pasta public
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];
const unusedImages = [];
let movedCount = 0;

function checkImages(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkImages(fullPath);
        } else if (imageExtensions.some(ext => fullPath.toLowerCase().endsWith(ext))) {
            const basename = encodeURIComponent(file).replace(/%20/g, ' ').replace(/'/g, "\\'");
            // Tenta procurar pelo nome do arquivo com decode e encode, e nome normal
            const name = file;
            const encodedName = encodeURI(file);
            const isUsed = codeContents.includes(name) || codeContents.includes(encodedName);
            
            if (!isUsed) {
                // Mover para pasta remove
                const relativePath = path.relative(publicDir, fullPath);
                const targetPath = path.join(removeDir, path.basename(file));
                
                // Evita sobrescrever se houver arquivos com nomes iguais em pastas distintas
                let finalTarget = targetPath;
                let counter = 1;
                while (fs.existsSync(finalTarget)) {
                    const ext = path.extname(file);
                    const base = path.basename(file, ext);
                    finalTarget = path.join(removeDir, `${base}_${counter}${ext}`);
                    counter++;
                }

                try {
                    fs.renameSync(fullPath, finalTarget);
                    console.log('Movido:', relativePath);
                    movedCount++;
                } catch (err) {
                    console.error('Erro ao mover:', relativePath, err);
                }
            }
        }
    }
}

checkImages(publicDir);
console.log(`\nLimpeza concluída! Total de imagens movidas para a pasta "remove": ${movedCount}`);
