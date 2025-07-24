import { useParams } from "@solidjs/router";
import { Button } from "@/components";
import { posts } from "~/posts";
import "./post.css";

/**
 * Wrapper component of all MDX-based posts to apply styling.
 */
export default function Post() {
  const params = useParams();
  const { component: MDX, metadata } = posts[params.post];

  return (
    <div class="relative min-h-screen bg-neutral-50 dark:bg-neutral-800">
      <Button class="absolute top-4 left-4" href="/blog" style="flat">
        &lt;- Blog
      </Button>
      <main class="flex justify-center">
        <article>
          <header class="flex flex-col mt-4">
            {metadata?.title && <h1 class="title">{metadata.title}</h1>}

            <div class="flex flex-row justify-between">
              {
                metadata?.author
                && <span class="author">By {metadata.author}</span>
              }
              {
                metadata?.date
                && <span class="date">{metadata.date}</span>
              }
            </div>
            <hr />
          </header>
          <MDX />
        </article>
      </main>
    </div>
  );
}
