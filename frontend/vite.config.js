import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use environment variable to support both GitHub Pages and Cloudflare Pages
  // GitHub Pages: VITE_BASE_PATH=/vehicle-breakdown-assistance/
  // Cloudflare Pages: VITE_BASE_PATH=/ (or leave unset)
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 3000
  }
})