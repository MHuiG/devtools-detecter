import { defineConfig } from 'vite'
import { resolve } from 'path'
import babel from '@rollup/plugin-babel';

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
    rollupOptions: {
      plugins: [
        babel({
          presets: [[
            "@babel/preset-env",
            {
              "corejs": 3,
              "useBuiltIns": "entry",
              "targets": {
                "chrome":"56",
                "ie": "10",
                "safari": "5",
              }
            }
          ]]
        })
      ],
    }
  }
})