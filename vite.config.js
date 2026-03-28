import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/xrpc': {
        target: 'https://public.api.bsky.app',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
