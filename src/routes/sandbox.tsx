import { Automaton } from "@/components";

export default function Sandbox() {
  return (
    <main>
      <Automaton class="w-screen h-screen" render="decay" rule="conway" />
    </main>
  );
}
