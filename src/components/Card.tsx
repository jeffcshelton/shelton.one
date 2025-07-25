import { Box } from "@/components";
import { addClass } from "~/util";
import { Component } from "solid-js";

export type Props = {
  class?: string,
  date?: string,
  description?: string,
  href?: string,
  subtitle?: string,
  title?: string,
  thumbnail?: Component,
};

/**
 * A terminal-style card with a thumbnail, title, and description.
 * A card that represents a blog post, with a short description.
 *
 * @param props - The properties of the component.
 */
export default function Card(props: Props) {
  return (
    <div class={addClass("w-full max-w-[100ch]", props.class)}>
      <Box href={props.href} title={props.date}>
        <div class="flex flex-row">
          {props.thumbnail && (
            <div class="w-50 h-50">
              <props.thumbnail />
            </div>
          )}
          <div class="flex flex-col m-[2ch] gap-[1em]">
            {props.title && <h1 class="font-bold text-xl">{props.title}</h1>}
            {props.subtitle && <h2>{props.subtitle}</h2>}
            {props.description && <p>{props.description}</p>}
          </div>
        </div>
      </Box>
    </div>
  );
}
