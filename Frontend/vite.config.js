import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: './postcss.config.js',
    tailwindcss: './tailwind.config.js',
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: { 
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['lucide-react', 'framer-motion'],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: ['lucide-react', 'framer-motion'],
  },
})
