import { defineConfig } from 'vite';
import { builtinModules } from 'module';
import path from 'path';

/**
 * Vite configuration for Electron main process
 */
export default defineConfig({
  build: {
    outDir: 'dist-electron',
    emptyOutDir: true,
    target: 'node16',
    lib: {
      entry: 'main/main.ts',
      formats: ['cjs'],
      fileName: () => '[name].js',
    },
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules.flatMap(m => [m, `node:${m}`]),
        // Exclude all native modules
        'better-sqlite3',
        'sqlite3',
        'fsevents'
      ],
      output: {
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './app'),
      '@main': path.resolve(__dirname, './main'),
      '@db': path.resolve(__dirname, './db'),
      '@services': path.resolve(__dirname, './services'),
    },
  },
  // Add optimizeDeps to exclude native modules from Vite's processing
  optimizeDeps: {
    exclude: ['better-sqlite3', 'sqlite3', 'fsevents']
  }
}); 