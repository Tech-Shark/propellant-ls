import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    // port: 8080,
    port: 3000,
    // proxy: {
    //   '/api': {
    //     target: 'https://PropellantHR.fly.dev',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '/api'),
    //     secure: true,
    //   },
    // },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
