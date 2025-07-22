import { Automaton, Navigation } from "@/components";

export default function Index() {
  return (
    <div class="w-screen h-screen flex flex-col">
      <Automaton
        class="absolute -z-10 inset-0 w-screen h-screen"
        render="decay"
        rule="conway"
      />

      <Navigation />

      <main class="flex flex-1 flex-row items-center justify-center overflow-auto">
        <img class="h-2/3 shadow-[12px_12px]" src="/portrait.jpg" />
        <p class="px-20 text-white text-xl font-mono">
          hi, i'm <b>jeff shelton</b>:<br />

          <span class="text-red-400 font-bold">+</span> cofounder, ceo @&nbsp;
          <span class="text-blue-500 font-bold">portal labs</span><br />

          <span class="text-orange-300 font-bold">+</span> m.s. computer science @&nbsp;
          <span class="text-yellow-300 font-bold">georgia tech</span><br />

          <span class="text-lime-300 font-bold">+</span> director of avionics @&nbsp;
          <span class="text-yellow-300 font-bold">yjsp</span><br />

          <span class="text-cyan-300 font-bold">+</span> intern @ [
            <span class="text-white font-bold">spacex</span>,&nbsp;
            <span class="text-blue-500 font-bold">northrop grumman</span>,&nbsp;
            <span class="text-lime-500 font-bold">silvervine</span>
          ]<br />

          <span class="text-violet-400 font-bold">+</span> musician
        </p>
      </main>
    </div>
  );
}
