import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true
  },
  cacheDir: '/tmp/vite',
  optimizeDeps: {
    noDiscovery: true,
    include: []
  },
  build: {
    sourcemap: false
  },
  define: {
    'process.env': {}
  }
})
