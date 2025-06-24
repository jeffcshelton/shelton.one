import { JSX } from "solid-js";

type Props = {
  children: JSX.Element,
  class?: string,
  href?: string,
  rel?: string,
  target?: string,
};

export default function Button(props: Props) {
  const shadow = "shadow-[4px_4px_oklch(50%_0.134_242.749_/_0.2)]";
  const hover = "hover:shadow-[3px_3px_oklch(50%_0.134_242.749_/_0.2)] hover:translate-px";
  const active = "hover:active:shadow-[2px_2px_oklch(50%_0.134_242.749_/_0.2)] hover:active:translate-[2px]";

  return <a
    class={`bg-sky-700 font-mono font-bold text-white p-3 ${shadow} ${hover} ${active} ${props.class}`}
    href={props.href}
    rel={props.rel}
    target={props.target}
  >
    {props.children}
  </a>;
}
