import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: resolve(__dirname, "dist"),
    minify: 'terser',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'DevtoolsDetecter',
      fileName: (format) => ((format == "umd") ? 'DevtoolsDetecter.js' : `DevtoolsDetecter.${format}.js`),
      formats: ["es", "umd", "iife"]
    },
    sourcemap: true,
  }
})