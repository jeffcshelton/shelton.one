import { useLocation } from "@solidjs/router";
import { Button } from "@/components";

const PAGES = {
  "me": "/",
  "blog": "/blog",
  "projects": "/projects",
  "github": "https://github.com/jeffcshelton",
};

export default function Navigation() {
  const location = useLocation();
  const baseURL = `/${location.pathname.split("/")[1]}`;
  const title = Object.entries(PAGES)
    .find(([_, url]) => url === baseURL)
    ?.[0];

  return (
    <div class="flex flex-row justify-between p-10 font-mono font-bold text-white">
      <div class="flex items-center">
        <a class="text-4xl" href="/">
          <span class="text-blue-400">#</span>{title}
        </a>
      </div>
      <div class="flex flex-row gap-10 items-center">
        {Object.entries(PAGES)
          .filter(([t, _]) => t !== title)
          .map(([title, url]) =>
            <a class="w-25 text-center" href={url}>{title}</a>
          )
        }
        <Button
          href="/resume.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >resume</Button>
      </div>
    </div>
  );
}
