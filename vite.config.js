import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to generate env.js for the vendas app
function writeEnvFile(username, password, supabaseUrl, supabaseKey) {
  const content = `window.ENV = { 
    DEFAULT_USERNAME: ${JSON.stringify(username || '')}, 
    DEFAULT_PASSWORD: ${JSON.stringify(password || '')},
    SUPABASE_URL: ${JSON.stringify(supabaseUrl || '')},
    SUPABASE_KEY: ${JSON.stringify(supabaseKey || '')}
  };\n`;
  try {
    fs.writeFileSync(path.resolve(__dirname, 'vendas/env.js'), content);
    fs.writeFileSync(path.resolve(__dirname, 'public/vendas/env.js'), content);
  } catch (err) {
    console.error('Error writing env.js:', err);
  }
}

// Function to update cache busters based on file modification times
function updateHtmlCacheBuster() {
  const folders = ['vendas', 'public/vendas'];
  folders.forEach(folder => {
    const htmlPath = path.resolve(__dirname, folder, 'index.html');
    if (!fs.existsSync(htmlPath)) return;

    try {
      let content = fs.readFileSync(htmlPath, 'utf8');
      const files = ['style.css', 'env.js', 'db.js', 'charts.js', 'app.js'];
      
      files.forEach(file => {
        const filePath = path.resolve(__dirname, folder, file);
        if (fs.existsSync(filePath)) {
          // Use the modification timestamp (in seconds) of the file as the cache-buster version
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

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  writeEnvFile(env.VITE_DEFAULT_USERNAME, env.VITE_DEFAULT_PASSWORD, env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
  updateHtmlCacheBuster()

  return {
    plugins: [react(), tailwindcss()],
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
