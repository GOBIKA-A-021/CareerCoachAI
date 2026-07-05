import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,          // always try 5173 first
    strictPort: false,   // if 5173 is busy, auto-increment (5174, 5175, …)
    proxy: {
      // Every /api/* call from the browser is forwarded to Express.
      // Because this is server-to-server, no Origin header is sent,
      // so CORS never triggers — this is the cleanest dev setup.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Log proxy activity so you can see requests being forwarded
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
