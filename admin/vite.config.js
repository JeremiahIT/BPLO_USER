import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
  resolve: {
    alias: [
      { find: '/mainpage', replacement: path.resolve(__dirname, 'src/mainpage') },
      { find: '/permits', replacement: path.resolve(__dirname, 'src/permits') },
      { find: '/config', replacement: path.resolve(__dirname, 'src/config') },
      { find: '/assets', replacement: path.resolve(__dirname, 'src/assets') },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
})
