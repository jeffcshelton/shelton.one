import { Button } from "@/components";

export default function Navigation() {
  const pages = ["me", "blog", "projects", "github"];

  return (
    <div class="flex flex-row justify-between p-10 font-mono">
      <div class="flex items-center">
        <a href="/">me</a>
      </div>
      <div class="flex flex-row gap-5 items-center text-white">
        <a href="/blog">blog</a>
        <a href="/projects">project</a>
        <a href="/github">github</a>
        <Button
          href="/resume.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >resume</Button>
      </div>
    </div>
  );
}
