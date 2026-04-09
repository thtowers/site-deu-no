const fs = require('fs');
const path = require('path');

const publicAssets = path.join(__dirname, '../public/assets');
const srcDir = path.join(__dirname, '../src');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const allAssets = getFiles(publicAssets);
const renameMap = [];

console.log('--- Step 1: Renaming Files ---');
allAssets.forEach(oldPath => {
  const dir = path.dirname(oldPath);
  const base = path.basename(oldPath);
  
  if (/[A-Z]/.test(base)) {
    const newBase = base.toLowerCase();
    const newPath = path.join(dir, newBase);
    
    // Check for collision (case-insensitive file systems like Windows might flag this)
    if (oldPath.toLowerCase() !== newPath.toLowerCase() || !fs.existsSync(newPath) || oldPath !== newPath) {
        try {
            // On Windows, renaming Rastro.webp to rastro.webp might fail if we don't use a temp name
            const tempPath = oldPath + '.tmp_rename';
            fs.renameSync(oldPath, tempPath);
            fs.renameSync(tempPath, newPath);
            
            console.log(`Renamed: ${base} -> ${newBase}`);
            renameMap.push({ oldBase: base, newBase: newBase });
        } catch (err) {
            console.error(`Error renaming ${base}: ${err.message}`);
        }
    }
  }
});

console.log('\n--- Step 2: Updating References in Source ---');
const srcFiles = getFiles(srcDir);

srcFiles.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    renameMap.forEach(({ oldBase, newBase }) => {
      // Use regex to find occurrences of the old filename. 
      // We look for common path delimiters or quotes around it to be safer.
      const regex = new RegExp(oldBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newBase);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated references in: ${path.relative(srcDir, file)}`);
    }
  }
});

console.log('\nDone!');
