const fs = require('fs');
const path = require('path');

const folders = ['Produtos', 'Mobile', 'Logo', 'Fontes', 'Cores'];
const publicAssets = path.join(__dirname, '../public/assets');

folders.forEach(folder => {
    const oldPath = path.join(publicAssets, folder);
    const newPath = path.join(publicAssets, folder.toLowerCase());
    
    if (fs.existsSync(oldPath)) {
        if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, { recursive: true });
        }
        
        // move all files
        const files = fs.readdirSync(oldPath);
        for (const file of files) {
            fs.renameSync(path.join(oldPath, file), path.join(newPath, file));
        }
        
        try {
            fs.rmdirSync(oldPath);
            console.log(`Moved contents of ${folder} to ${folder.toLowerCase()}`);
        } catch (e) {
            console.log(`Moved contents, but could not delete old directory ${folder}: ${e.message}`);
        }
    }
});
