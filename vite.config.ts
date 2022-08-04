import { defineConfig } from 'vite'
import ssl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'assets',
  server: {
    https: true,
    fs: {
      strict: true,
      allow: ['.'],
    },
  },
  plugins: [
    ssl(),
  ],
  envPrefix: 'THREE',
  build: {
    minify: false,
  },
})
