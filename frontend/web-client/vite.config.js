import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),   // ✅ Tailwind V4 plugin
        autoprefixer(),  // ✅ ES module formatı
      ],
    },
  },
});
