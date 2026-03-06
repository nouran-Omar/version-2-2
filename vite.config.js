import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import flowbiteReact from "flowbite-react/plugin/vite"

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    flowbiteReact()
  ],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    // السطر ده هيخفي التحذير بتاع الـ Chunks الكبيرة اللي ظهرلك في الـ Terminal
    chunkSizeWarningLimit: 1600, 
  }
})