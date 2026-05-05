import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [solid(), tailwindcss()],
})
