import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Optimizaciones de construcción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'react-icons', 'react-slick']
        }
      }
    },
    // Deshabilitar sourcemaps en producción
    sourcemap: false,
    // Optimizar el tamaño del bundle
    chunkSizeWarningLimit: 1000,
    // Habilitar compresión
    brotliSize: true,
    // Optimizar el tamaño de los assets
    assetsInlineLimit: 4096
  }
});