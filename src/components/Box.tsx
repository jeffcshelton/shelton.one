import { JSX } from "solid-js";

export type Props = {
  children?: JSX.Element,
  class?: string,
  title?: string,
};

export default function Box(props: Props) {
  return (
    <div class="relative outline outline-white hover:outline-blue-500 cursor-pointer p-[2em] m-[2em] max-w-[100ch] text-white font-mono bg-neutral-800">
      {props.title &&
        <span class="absolute bg-neutral-800 top-0 translate-y-[-50%] left-[2ch]">
          &nbsp;{props.title}&nbsp;
        </span>
      }

      <div class={props.class}>
        {props.children}
      </div>
    </div>
  );
}
