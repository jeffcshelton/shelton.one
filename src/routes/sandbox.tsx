import { Automata } from "@/components";

export default function Sandbox() {
  return (
    <main>
      <Automata class="w-screen h-screen" render="decay" rule="conway" />
    </main>
  );
}
