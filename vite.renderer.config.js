const path = require('path');
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

/**
 * Vite configuration for Electron renderer process
 */
module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './app'),
      '@main': path.resolve(__dirname, './main'),
      '@db': path.resolve(__dirname, './db'),
      '@services': path.resolve(__dirname, './services'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        app: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  // Clear screen configuration
  clearScreen: false,
}); 