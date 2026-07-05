import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "./",   // ✅ FIX: CSS + JS loads correctly on Render

  plugins: [react()],

  server: {
    port: 5173,
    strictPort: false,

    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,

        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('[vite-proxy] error:', err.message)
          })

          proxy.on('proxyReq', (_, req) => {
            console.log('[vite-proxy] →', req.method, req.url)
          })
        }
      }
    }
  }
})
