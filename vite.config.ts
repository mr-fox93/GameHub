import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? "/GameHub/" : "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          'api-vendor': ['axios', 'react-query', 'zustand'],
          'utils-vendor': ['react-icons', '@chakra-ui/icons', 'ms', 'react-infinite-scroll-component']
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
});
