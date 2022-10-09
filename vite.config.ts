import { defineConfig } from 'vite'
import ssl from '@vitejs/plugin-basic-ssl'
import env from './env'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ssl(),
  ],
  publicDir: 'assets',
  server: {
    fs: {
      allow: ['.'],
      strict: true,
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    https: true,
    port: 5172,
    strictPort: true,
  },
  define: env,
})
