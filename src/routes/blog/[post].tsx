import { useParams } from "@solidjs/router";
import { Component } from "solid-js";
import "./post.css";

type MDXModule = {
  default: Component,
  frontmatter?: {
    title?: string,
    date?: string,
    description?: string,
  },
};

function toSlug(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
}

const posts = Object.fromEntries(
  Object
    .entries(import.meta.glob<MDXModule>("~/posts/*.mdx", { eager: true }))
    .map(([path, module]) =>
      [
        toSlug(path),
        {
          component: module.default,
          metadata: module.frontmatter,
        },
      ]
    )
);

/**
 * Wrapper component of all MDX-based posts to apply styling.
 */
export default function Post() {
  const params = useParams();
  const MDX = posts[params.post].component;

  return (
    <article>
      <MDX />
    </article>
  );
}
