import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://187.127.132.81:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://187.127.132.81:8080',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
