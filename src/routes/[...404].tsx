import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <main class="flex justify-center items-center w-screen h-screen">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="text-white font-mono font-bold text-3xl">Page Not Found (404)</h1>
    </main>
  );
}
