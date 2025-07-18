import { Automata, Box, Navigation } from "@/components";
import { CellState } from "@/components/Automata";

export default function Blog() {
  return (
    <div class="flex flex-col">
      <Automata
        class="absolute -z-10 inset-0 w-screen h-screen"
        render="decay"
        rule="conway"
      />

      <Navigation />

      <main class="flex flex-1 flex-col items-center">
        <Box class="flex flex-row" title="2025-07-21">
          <Automata
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
        </Box>
      </main>
    </div>
  );
}
