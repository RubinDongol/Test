import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    https: false,
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  define: {
    global: {},
  },
})
