import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ✅ Ye zaroori hai: Iska matlab "Allow All IPs"
    port: 5173, // Port fix kar diya
  }
})