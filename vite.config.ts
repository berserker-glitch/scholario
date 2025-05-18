import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process
        entry: 'main/main.ts',
        onstart(options) {
          options.startup()
        }
      },
      {
        // Preload script
        entry: 'main/preload.ts',
      },
    ]),
  ],
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
    rollupOptions: {
      input: {
        app: path.resolve(__dirname, 'index.html'),
      },
    },
    outDir: 'dist',
  },
  // Prevent Vite from clearing the console during rebuilds
  clearScreen: false,
  // Prevent typechecking twice
  optimizeDeps: {
    // Exclude all node built-ins
    exclude: ['electron'],
  },
})
