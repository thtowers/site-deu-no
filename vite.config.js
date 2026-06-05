import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to update cache busters based on file modification times
function updateHtmlCacheBuster() {
  const folders = ['vendas', 'public/vendas'];
  folders.forEach(folder => {
    const htmlPath = path.resolve(__dirname, folder, 'index.html');
    if (!fs.existsSync(htmlPath)) return;

    try {
      let content = fs.readFileSync(htmlPath, 'utf8');
      const files = ['style.css', 'db.js', 'charts.js', 'app.js'];
      
      files.forEach(file => {
        const filePath = path.resolve(__dirname, folder, file);
        if (fs.existsSync(filePath)) {
          const mtime = Math.round(fs.statSync(filePath).mtimeMs / 1000);
          const escapedFile = file.replace('.', '\\.');
          const regex = new RegExp(`${escapedFile}(\\?v=[^"]*)?`, 'g');
          content = content.replace(regex, `${file}?v=${mtime}`);
        }
      });
      
      fs.writeFileSync(htmlPath, content, 'utf8');
      console.log(`✓ Cache busters updated in ${folder}/index.html`);
    } catch (err) {
      console.error(`Error updating cache buster in ${htmlPath}:`, err);
    }
  });
}

// Plugin que injeta window.ENV inline nos HTMLs da pasta vendas
function injectEnvPlugin(env) {
  const envScript = `<script>
window.ENV = {
  DEFAULT_USERNAME: ${JSON.stringify(env.VITE_DEFAULT_USERNAME || '')},
  DEFAULT_PASSWORD: ${JSON.stringify(env.VITE_DEFAULT_PASSWORD || '')},
  SUPABASE_URL: ${JSON.stringify(env.VITE_SUPABASE_URL || '')},
  SUPABASE_KEY: ${JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')}
};
</script>`;

  return {
    name: 'inject-env-inline',
    // Escreve env.js para compatibilidade com dev local (está no .gitignore)
    buildStart() {
      const content = `window.ENV = {\n  DEFAULT_USERNAME: ${JSON.stringify(env.VITE_DEFAULT_USERNAME || '')},\n  DEFAULT_PASSWORD: ${JSON.stringify(env.VITE_DEFAULT_PASSWORD || '')},\n  SUPABASE_URL: ${JSON.stringify(env.VITE_SUPABASE_URL || '')},\n  SUPABASE_KEY: ${JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')}\n};\n`;
      try {
        fs.writeFileSync(path.resolve(__dirname, 'vendas/env.js'), content);
        fs.writeFileSync(path.resolve(__dirname, 'public/vendas/env.js'), content);
      } catch (err) {
        console.error('Error writing env.js:', err);
      }
    },
    // Substitui a tag <script src="env.js"> pela versão inline no HTML
    closeBundle() {
      const folders = ['vendas', 'public/vendas'];
      folders.forEach(folder => {
        const htmlPath = path.resolve(__dirname, folder, 'index.html');
        if (!fs.existsSync(htmlPath)) return;
        try {
          let content = fs.readFileSync(htmlPath, 'utf8');
          content = content.replace(
            /<script[^>]*src="[^"]*env\.js[^"]*"[^>]*><\/script>/,
            envScript
          );
          fs.writeFileSync(htmlPath, content, 'utf8');
          console.log(`✓ window.ENV injetado inline em ${folder}/index.html`);
        } catch (err) {
          console.error(`Erro ao injetar ENV em ${htmlPath}:`, err);
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  updateHtmlCacheBuster()

  return {
    plugins: [react(), tailwindcss(), injectEnvPlugin(env)],
    server: {
      port: 5173,
      host: true,
      strictPort: false,
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
  }
})
