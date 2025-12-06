import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Changed from '/vehicle-breakdown-assistance/' for Cloudflare Pages
  server: {
    port: 3000
  }
})