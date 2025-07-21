import { defineConfig } from "@solidjs/start/config";
import tailwind from "@tailwindcss/vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import mdx from "@mdx-js/rollup";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  extensions: ["md", "mdx"],
  vite: {
    resolve: {
      alias: {
        "@/components": resolve(__dirname, "./src/components"),
        "@/routes": resolve(__dirname, "./src/routes"),
      },
    },
    plugins: [
      mdx({
        jsx: true,
        jsxImportSource: "solid-jsx",
        providerImportSource: "solid-mdx",
      }),
      tailwind(),
    ],
  },
});
