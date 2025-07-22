import { useParams } from "@solidjs/router";
import { Component } from "solid-js";
import "./post.css";

type MDXModule = {
  default: Component,
  frontmatter?: {
    title?: string,
    author?: string,
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
  const { component: MDX, metadata } = posts[params.post];

  return (
    <main class="flex justify-center">
      <article>
        <header class="flex flex-col">
          {metadata?.title && <h1 class="title">{metadata.title}</h1>}

          <div class="flex flex-row justify-between">
            {metadata?.author && <span class="author">By {metadata.author}</span>}
            {metadata?.date && <span class="date">{metadata.date}</span>}
          </div>
        </header>
        <MDX />
      </article>
    </main>
  );
}
