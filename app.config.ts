import { defineConfig } from "@solidjs/start/config";
import tailwind from "@tailwindcss/vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@/components": resolve(__dirname, "./src/components"),
        "@/routes": resolve(__dirname, "./src/routes"),
      },
    },
    plugins: [tailwind()],
  },
});
