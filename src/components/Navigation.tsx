import { useLocation } from "@solidjs/router";
import { Button } from "@/components";

const PAGES = {
  "me": "/",
  "blog": "/blog",
  "github": "https://github.com/jeffcshelton",
};

export default function Navigation() {
  const location = useLocation();
  const baseURL = `/${location.pathname.split("/")[1]}`;
  const title = Object.entries(PAGES)
    .find(([_, url]) => url === baseURL)
    ?.[0];

  return (
    <nav class="flex flex-row justify-between p-10 font-mono text-white">
      <div class="flex items-center">
        <a class="text-4xl font-bold" href="/">
          <span class="text-blue-400">#</span>{title}
        </a>
      </div>
      <div class="flex flex-row gap-10 items-center">
        {Object.entries(PAGES)
          .map(([page, url]) => {
            const selected = page === title ? "font-bold" : "";

            return (
              <a
                class={`w-25 text-center hover:underline decoration-2 ${selected}`}
                href={url}
              >
                {page}
              </a>
            );
          })
        }
        <Button
          href="/resume.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >resume</Button>
      </div>
    </nav>
  );
}
