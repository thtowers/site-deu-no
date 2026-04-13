const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const componentsDir = path.join(srcDir, 'components');
const dataDir = path.join(srcDir, 'data');

const dirsToScan = [componentsDir, dataDir];

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Expressões regulares para garantir que estamos subsituindo o caminho corretamente
    const original = content;
    content = content.replace(/\/Produtos\//g, '/produtos/')
                     .replace(/\/Mobile\//g, '/mobile/')
                     .replace(/\/Logo\//g, '/logo/')
                     .replace(/\/Fontes\//g, '/fontes/')
                     .replace(/\/Cores\//g, '/cores/');
                     
    // Caso especial para Logo/Shopee.png que pode não ter a barra inicial (e.g. src="/Logo/Shopee.png")
    // Note que ali tem a barra inicial, mas apenas por segurança, se tiver algo que comece com aspas e depois Logo
    content = content.replace(/(["'`])Logo\//g, '$1logo/')
                     .replace(/(["'`])Produtos\//g, '$1produtos/')
                     .replace(/(["'`])Mobile\//g, '$1mobile/')
                     .replace(/(["'`])Cores\//g, '$1cores/');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated paths in ${path.basename(filePath)}`);
    }
}

dirsToScan.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (!fs.statSync(fullPath).isDirectory() && fullPath.match(/\.(js|jsx)$/)) {
                replaceInFile(fullPath);
            }
        });
    }
});
