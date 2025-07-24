import { JSX } from "solid-js";
import { addClass } from "../util";

type Props = {
  children: JSX.Element,
  class?: string,
  href?: string,
  rel?: string,
  style?: "flat" | "raised",
  target?: string,
};

export default function Button(props: Props) {
  const base = "font-mono font-bold p-3";
  const flat = `
    inline-flex
    border-3
    hover:[background-image:repeating-radial-gradient(circle_at_center,transparent_0%_1px,#0003_1px_4px)]
    hover:[background-size:2px_2px]
    dark:text-white
    dark:border-white
    dark:hover:[background-image:repeating-radial-gradient(circle_at_center,transparent_0%_1px,#FFF3_1px_4px)]
  `;

  const raised = `
    bg-sky-700
    text-white
    shadow-[4px_4px]
    shadow-sky-900
    hover:shadow-[3px_3px]
    hover:translate-px
    hover:active:shadow-[2px_2px]
    hover:active:translate-[2px]
  `;

  const style = addClass(
    base,
    props.style === "flat" ? flat : raised,
    props.class,
  );

  return <a
    class={style}
    href={props.href}
    rel={props.rel}
    target={props.target}
  >
    {props.children}
  </a>;
}
