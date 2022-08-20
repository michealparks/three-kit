import { defineConfig } from 'vite'
import ssl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'assets',
  server: {
    port: 5172,
    strictPort: true,
    https: true,
    fs: {
      strict: true,
      allow: ['.'],
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  plugins: [
    ssl(),
  ],
  envPrefix: 'THREE',
  build: {
    minify: 'terser',
  },
})
