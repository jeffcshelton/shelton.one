import { A } from "@solidjs/router";
import { addClass } from "../util";
import { JSX } from "solid-js";

export type Props = {
  children?: JSX.Element,
  class?: string,
  href?: string,
  title?: string,
};

export default function Box(props: Props) {
  const boxBaseStyle = `
    block
    relative
    outline-2
    outline-white
    hover:outline-blue-500
    cursor-pointer
    p-[2em]
    m-[2em]
    text-white
    font-mono
    bg-neutral-800
  `;

  const boxStyle = addClass(boxBaseStyle, props.class);

  const titleStyle = `
    absolute
    bg-neutral-800
    outline-2
    top-0
    translate-y-[-50%]
    left-[2ch]
  `;

  const content = <>
    {props.title &&
      <span class={titleStyle}>
        &nbsp;{props.title}&nbsp;
      </span>
    }

    <div>
      {props.children}
    </div>
  </>;

  return props.href ? (
    <A class={boxStyle} href={props.href}>{content}</A>
  ) : (
    <div class={boxStyle}>{content}</div>
  );
}
