import { addClass } from "../util";
import { JSX } from "solid-js";

export type Props = {
  children?: JSX.Element,
  class?: string,
  title?: string,
};

export default function Box(props: Props) {
  return (
    <div class={addClass("relative outline outline-white hover:outline-blue-500 cursor-pointer p-[2em] m-[2em] text-white font-mono bg-neutral-800", props.class)}>
      {props.title &&
        <span class="absolute bg-neutral-800 outline top-0 translate-y-[-50%] left-[2ch]">
          &nbsp;{props.title}&nbsp;
        </span>
      }

      <div>
        {props.children}
      </div>
    </div>
  );
}
