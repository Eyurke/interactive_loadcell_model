import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standard Vite + React config. Output goes to ./dist for Vercel.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    // three.js is large; bumping the warning limit keeps the build output clean.
    chunkSizeWarningLimit: 1500,
  },
})
