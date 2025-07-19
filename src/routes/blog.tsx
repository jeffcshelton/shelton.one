import { Automaton, Box, Navigation } from "@/components";
import { CellState } from "@/components/Automaton";

type PostProps = {
  date: string,
};

function Post(props: PostProps) {
  return (
    <div class="w-full max-w-[100ch]">
      <Box title={props.date}>

      </Box>
    </div>
  );
}

export default function Blog() {
  return (
    <div class="flex flex-col">
      <Automaton
        class="absolute -z-10 inset-0 w-screen h-screen"
        render="decay"
        rule="conway"
      />

      <Navigation />

      <main class="flex flex-1 flex-col items-center">
        <div class="w-full max-w-[100ch]">
          <Box class="" title="2025-07-21">
            <div class="flex flex-row">
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
            </div>
          </Box>
        </div>
        <Box class="" title="2025-07-21">
          <div class="flex flex-col m-[2ch] gap-[1em]">
            <h1 class="font-bold text-xl">Writing a Linux Driver</h1>
            <p>On my home page,</p>
          </div>
        </Box>
      </main>
    </div>
  );
}
