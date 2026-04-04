const fs = require('fs');
const file = 'c:/Users/thtow/OneDrive/Desktop/Documentos/site-deu-no-main/src/components/ProductsSection.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/colorOptions=\{\['azul_marinho', 'bordo'\]\}/g, "colorOptions={['azul_marinho', 'bordo', 'bege_natural', 'marrom', 'turquesa', 'preto']}");
fs.writeFileSync(file, content);
