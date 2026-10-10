import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The lazily loaded 3D chunk is large by nature (three.js); the gzipped budget is checked separately.
    chunkSizeWarningLimit: 1100,
  },
  server: {
    // Honour PORT when a tool assigns one; otherwise Vite's default.
    port: Number(process.env.PORT) || 5173,
  },
});
