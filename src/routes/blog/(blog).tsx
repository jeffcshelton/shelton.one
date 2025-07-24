import { Automaton, Box, Navigation } from "@/components";
import { Component, For } from "solid-js";
import { posts } from "~/posts";

type PostProps = {
  metadata?: {
    date?: string,
    description?: string,
    title?: string,
  },
  slug: string,
  thumbnail?: Component,
};

/**
 * A card that represents a blog post, with a short description.
 *
 * @param props - The properties of the component.
 */
function PostCard(props: PostProps) {
  const { date, description, title } = props.metadata ?? {};

  return (
    <div class="w-full max-w-[100ch]">
      <Box href={`/blog/${props.slug}`} title={date}>
        <div class="flex flex-row">
          <div class="w-50 h-50">
            {props.thumbnail && <props.thumbnail />}
          </div>
          <div class="flex flex-col m-[2ch] gap-[1em]">
            {title && <h1 class="font-bold text-xl">{title}</h1>}
            {description && <p>{description}</p>}
          </div>
        </div>
      </Box>
    </div>
  );
}

/**
 * The page showing all blog posts in cards.
 */
export default function Blog() {
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
          <For each={Object.entries(posts)}>
            {([slug, { metadata, thumbnail }]) => (
              <PostCard
                metadata={metadata}
                slug={slug}
                thumbnail={thumbnail}
              />
            )}
          </For>
        </main>
      </div>
    </div>
  );
}
