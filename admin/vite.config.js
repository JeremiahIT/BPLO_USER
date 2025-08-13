import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
  mainpage: path.resolve(__dirname, 'src/mainpage'),
  permits: path.resolve(__dirname, 'src/permits'),
  config: path.resolve(__dirname, 'src/config'),
  assets: path.resolve(__dirname, 'src/assets'),
  '@': path.resolve(__dirname, 'src'),
}

  }
})
