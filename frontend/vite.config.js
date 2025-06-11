import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    allowedHosts: [
      '8e08-2800-340-52-144-507f-64ee-67ce-5f7e.ngrok-free.app',
      'ba4b-181-231-152-22.ngrok-free.app',
      '2995-181-231-152-22.ngrok-free.app'
    ]
  }
})
