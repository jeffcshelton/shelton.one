import { Component } from "solid-js";

/**
 * The type of an import of an MDX post file.
 */
type PostModule = {
  default: Component,
  frontmatter?: {
    title?: string,
    subtitle?: string,
    author?: string,
    date?: string,
    description?: string,
  },
  thumbnail?: Component,
};

/**
 * Extracts the slug of a blog path from its path, which is the file name
 * without extension.
 *
 * @param path - A relative or absolute path to a post's markdown file.
 */
function toSlug(path: string): string {
  return path.slice(
    path.lastIndexOf("/") + 1,
    path.lastIndexOf("."),
  );
}

const postImports = import.meta.glob<PostModule>(
  "~/posts/*.mdx",
  { eager: true },
);

/**
 * The collection of all blog posts, including the rendered JDX component and
 * frontmatter.
 */
export const posts = Object.fromEntries(
  Object
    .entries(postImports)
    .map(([path, module]) => [
      toSlug(path),
      {
        component: module.default,
        metadata: module.frontmatter,
        thumbnail: module.thumbnail,
      },
    ])
);
