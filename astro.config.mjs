
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react({
      jsxImportSource: 'react'
    })
  ],
  vite: {
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react'
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion']
    },
    // Añadir esto para mejor manejo de tipos
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }
});