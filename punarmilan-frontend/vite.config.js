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
        target: 'https://lovenzea.online',
        changeOrigin: true,
      },
      '/ws': {
        target: 'wss://lovenzea.online',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
