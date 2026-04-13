const fs = require('fs');
const path = require('path');

const publicAssets = path.join(__dirname, '../public/assets');

function getFiles(dir, fileList = []) {
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

const allFiles = getFiles(publicAssets);
const uppercaseFiles = allFiles.filter(f => /[A-Z]/.test(path.basename(f)));

console.log('Files to rename:');
uppercaseFiles.forEach(f => {
    const relativePath = path.relative(publicAssets, f).replace(/\\/g, '/');
    console.log(`${relativePath} -> ${relativePath.toLowerCase()}`);
});
