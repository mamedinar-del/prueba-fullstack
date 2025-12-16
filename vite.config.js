import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  base: "/prueba-fullstack", 

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})