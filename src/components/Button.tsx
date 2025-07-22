import { JSX } from "solid-js";
import { addClass } from "../util";

type Props = {
  children: JSX.Element,
  class?: string,
  href?: string,
  rel?: string,
  target?: string,
};

export default function Button(props: Props) {
  const style = "bg-sky-700 font-mono font-bold text-white p-3";

  const shadow = "shadow-[4px_4px] shadow-sky-900";
  const hover = "hover:shadow-[3px_3px] hover:translate-px";
  const active = "hover:active:shadow-[2px_2px] hover:active:translate-[2px]";

  return <a
    class={addClass(style, shadow, hover, active, props.class)}
    href={props.href}
    rel={props.rel}
    target={props.target}
  >
    {props.children}
  </a>;
}
