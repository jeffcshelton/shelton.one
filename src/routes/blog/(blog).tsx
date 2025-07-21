import { Automaton, Box, Navigation } from "@/components";
import { CellState } from "@/components/Automaton";
import { JSX } from "solid-js";

type PostProps = {
  children: JSX.Element,
  date: string,
};

function Post(props: PostProps) {
  return (
    <div class="w-full max-w-[100ch]">
      <Box title={props.date}>
        <div class="flex flex-row">
          {props.children}
        </div>
      </Box>
    </div>
  );
}

export default function Blog() {
  return (
    <div class="flex flex-col w-full h-full">
      <Automaton
        class="absolute -z-10 inset-0 w-full h-full"
        render="decay"
        rule="conway"
      />

      <Navigation />

      <main class="flex flex-1 flex-col items-center">
        <Post date="2025-07-21">
          <Automaton
            class="w-50 h-50"
            colors={{
              [CellState.DEAD]: [0, 0, 0, 255],
              [CellState.ALIVE]: [255, 255, 255, 255],
            }}
            render="decay"
            rule="conway"
          />

          <div class="flex flex-col m-[2ch] gap-[1em]">
            <h1 class="font-bold text-xl">Cellular Automata</h1>
            <p>On my home page,</p>
          </div>
        </Post>
        <Post date="2025-07-21">
          <div class="flex flex-col m-[2ch] gap-[1em]">
            <h1 class="font-bold text-xl">Writing Your First Linux Kernel Driver</h1>
            <p>Recently, I wrote my first Linux kernel driver.<br />Read to find out how you can write one too...</p>
          </div>
        </Post>
      </main>
    </div>
  );
}
