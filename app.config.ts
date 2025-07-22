import { defineConfig } from "@solidjs/start/config";
import tailwind from "@tailwindcss/vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/* @ts-ignore */
import pkg from "@vinxi/plugin-mdx";

const { default: mdx } = pkg;

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
      mdx.withImports({})({
        jsx: true,
        jsxImportSource: "solid-js",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
        ],
        providerImportSource: "solid-mdx",
      }),
      tailwind(),
    ],
  },
});
