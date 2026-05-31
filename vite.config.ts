import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  build: {
    sourcemap: false, // 🔥 fixes CSP eval issue on Vercel
    minify: 'esbuild', // safer default minifier
  },

  esbuild: {
    legalComments: 'none',
  },
});