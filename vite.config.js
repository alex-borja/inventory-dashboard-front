import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@context': resolve(__dirname, 'src/context')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
