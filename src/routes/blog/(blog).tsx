import { Automaton, Card, Navigation } from "@/components";
import { posts } from "~/posts";
import { For } from "solid-js";

/**
 * The page showing all blog posts in cards.
 */
export default function Blog() {
  const visiblePosts = Object
    .entries(posts)
    .filter(([slug, _]) => !slug.startsWith("_"));

  return (
    <div class="relative min-w-screen min-h-screen">
      <Automaton
        class="absolute w-full h-full -z-1"
        render="decay"
        rule="conway"
      />
      <div class="flex flex-col w-full h-full">
        <Navigation />

        <main class="flex flex-1 flex-col items-center">
          {visiblePosts.length > 0
            ? (
              <For each={visiblePosts}>
                {([slug, { metadata, thumbnail }]) => (
                  <Card
                    date={metadata?.date}
                    description={metadata?.description}
                    href={`/blog/${slug}`}
                    subtitle={metadata?.subtitle}
                    title={metadata?.title}
                    thumbnail={thumbnail}
                  />
                )}
              </For>
            ) : (
              <h1 class="font-mono text-white text-2xl mt-20">
                Some posts will be here soon :)
              </h1>
            )
          }
        </main>
      </div>
    </div>
  );
}
