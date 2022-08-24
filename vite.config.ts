import { defineConfig } from 'vite'
import ssl from '@vitejs/plugin-basic-ssl'
import vitePluginString from 'vite-plugin-string'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
  },
  envPrefix: 'THREE',
  plugins: [
    ssl(),
    vitePluginString.default({
      exclude: 'node_modules/**',
    }),
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
})
