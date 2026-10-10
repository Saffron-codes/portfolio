import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Honour PORT when a tool assigns one; otherwise Vite's default.
    port: Number(process.env.PORT) || 5173,
  },
});
