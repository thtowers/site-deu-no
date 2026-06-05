import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to generate env.js for the vendas app
function writeEnvFile(username, password) {
  const content = `window.ENV = { DEFAULT_USERNAME: ${JSON.stringify(username || '')}, DEFAULT_PASSWORD: ${JSON.stringify(password || '')} };\n`;
  try {
    fs.writeFileSync(path.resolve(__dirname, 'vendas/env.js'), content);
    fs.writeFileSync(path.resolve(__dirname, 'public/vendas/env.js'), content);
  } catch (err) {
    console.error('Error writing env.js:', err);
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  writeEnvFile(env.VITE_DEFAULT_USERNAME, env.VITE_DEFAULT_PASSWORD)

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
