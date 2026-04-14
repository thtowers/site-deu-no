const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'public', 'assets');
const srcDir = path.join(projectRoot, 'src');

function normalize(str) {
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[çÇ]/g, 'c')
        .replace(/\s+/g, '_') // Replace spaces with _
        .replace(/[^a-z0-9\._\/\\]/g, ''); // Keep common chars
}

const pathMap = {};

function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
}

// 1. Gather all asset files and create mapping
const allAssets = walkSync(assetsDir);
allAssets.forEach(oldFullPath => {
    const relativePart = path.relative(assetsDir, oldFullPath);
    const normalizedRelativePart = normalize(relativePart);
    
    if (relativePart !== normalizedRelativePart) {
        const newFullPath = path.join(assetsDir, normalizedRelativePart);
        pathMap[relativePart.replace(/\\/g, '/')] = normalizedRelativePart.replace(/\\/g, '/');
    }
});

console.log('Mapping identified:', JSON.stringify(pathMap, null, 2));

// 2. Rename files
Object.keys(pathMap).forEach(oldPath => {
    const oldFullPath = path.join(assetsDir, oldPath);
    const newFullPath = path.join(assetsDir, pathMap[oldPath]);
    
    // Create subdirectories if they don't exist
    const newDir = path.dirname(newFullPath);
    if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
    }
    
    // Rename
    if (fs.existsSync(oldFullPath) && oldFullPath !== newFullPath) {
        fs.renameSync(oldFullPath, newFullPath);
        console.log(`Renamed: ${oldPath} -> ${pathMap[oldPath]}`);
    }
});

// 3. Update code references
const dirsToUpdate = [srcDir, projectRoot];
const filesToUpdate = [];

function findCodeFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'public' && file !== 'dist') {
                findCodeFiles(fullPath);
            }
        } else if (/\.(js|jsx|css|html)$/.test(file)) {
            filesToUpdate.push(fullPath);
        }
    });
}
findCodeFiles(srcDir);
if (fs.existsSync(path.join(projectRoot, 'index.html'))) filesToUpdate.push(path.join(projectRoot, 'index.html'));

filesToUpdate.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Procura por qualquer string que pareça um caminho de asset e normaliza
    // Ex: /assets/Produtos/Imagem.webp -> /assets/produtos/imagem.webp
    content = content.replace(/\/assets\/[a-zA-Z0-9\._\/\-\% \u00C0-\u00FF]+/g, (match) => {
        // Remove espaços no final que o regex pode pegar
        const cleanMatch = match.trim();
        const normalized = normalize(cleanMatch);
        // Note: normalize remove o / inicial se não tomarmos cuidado, mas nosso normalize mantém / e \
        return normalized;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated paths in: ${filePath}`);
    }
});

console.log('Normalization complete.');
