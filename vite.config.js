import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_DEPLOY_TARGET === 'github-pages' ? '/PS-Eccomerce/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      strict: false, // Esto permite a Vite servir archivos fuera de la carpeta src
    },
  }
})
