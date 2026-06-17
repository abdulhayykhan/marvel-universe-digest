import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-marvel-bone px-4">
      <div className="brutal-border-4 brutal-shadow-lg max-w-md bg-marvel-white p-8 text-center">
        <h1 className="font-display text-[6rem] uppercase leading-none text-marvel-red">404</h1>
        <h2 className="mt-2 font-display text-2xl uppercase">Page not found</h2>
        <p className="mt-2 font-sans text-sm text-marvel-black/70">
          This page got snapped out of existence.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="brutal-border brutal-shadow-sm inline-block bg-marvel-red px-4 py-2 font-display text-sm uppercase tracking-widest text-marvel-white"
          >
            ← Back to roster
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-marvel-bone px-4">
      <div className="brutal-border-4 brutal-shadow-lg max-w-md bg-marvel-white p-8 text-center">
        <h1 className="font-display text-4xl uppercase text-marvel-red">Snap!</h1>
        <p className="mt-2 font-sans text-sm">
          Something went wrong. Try again or head back to the roster.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="brutal-border brutal-shadow-sm bg-marvel-yellow px-4 py-2 font-display text-sm uppercase tracking-widest"
          >
            Try again
          </button>
          <a
            href="/"
            className="brutal-border brutal-shadow-sm bg-marvel-black px-4 py-2 font-display text-sm uppercase tracking-widest text-marvel-white"
          >
            Roster
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Marvel Character Encyclopedia" },
      {
        name: "description",
        content:
          "A neobrutalist Marvel character database — browse, search, favorite, and compare 40+ heroes and villains.",
      },
      { name: "theme-color", content: "#ED1D24" },
      { property: "og:title", content: "Marvel Character Encyclopedia" },
      {
        property: "og:description",
        content: "Browse 40+ Marvel heroes and villains in a bold neobrutalist database.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23ED1D24'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-family='Impact,Anton,sans-serif' font-size='44' fill='%23fff' font-weight='900'%3EM%3C/text%3E%3C/svg%3E",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
