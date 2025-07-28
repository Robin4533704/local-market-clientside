import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1500, // ওয়ার্নিং লিমিট বাড়িয়ে দেওয়া হয়েছে

    rollupOptions: {
      output: {
        manualChunks: {
          // React-সম্পর্কিত প্যাকেজ আলাদা chunk-এ যাবে
          react: ['react', 'react-dom'],
          // Leaflet map এর লাইব্রেরি আলাদা chunk-এ যাবে
          leaflet: ['leaflet', 'react-leaflet'],
          // অন্যান্য ভারী লাইব্রেরিগুলো চাইলে এখানে যুক্ত করতে পারেন
        },
      },
    },
  },
})
