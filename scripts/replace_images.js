const fs = require('fs');
const path = require('path');

const files = [
    'src/components/ProductsSection.jsx',
    'src/components/Hero.jsx',
    'src/components/Header.jsx',
    'src/components/QualitySection.jsx'
];

files.forEach(file => {
    const fullPath = path.resolve(file);
    if (!fs.existsSync(fullPath)) {
        console.error('File not found:', fullPath);
        return;
    }
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/\.png/gi, '.webp')
        .replace(/\.jpe?g/gi, '.webp');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
});
