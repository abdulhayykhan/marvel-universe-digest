import { Link } from "@tanstack/react-router";
import { useFavorites, useCompare } from "../lib/favorites";

export function SiteNav() {
  const fav = useFavorites();
  const cmp = useCompare();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-marvel-black bg-marvel-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <Link
          to="/"
          className="brutal-border brutal-shadow-sm inline-block shrink-0 bg-marvel-red px-3 py-1.5"
        >
          <span className="font-display text-2xl uppercase italic tracking-tight text-marvel-white sm:text-3xl">
            MARVEL
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-3 md:flex">
          <Link
            to="/"
            className="font-display text-sm uppercase tracking-widest text-marvel-black hover:text-marvel-red"
            activeProps={{ className: "text-marvel-red underline decoration-4 underline-offset-4" }}
            activeOptions={{ exact: true }}
          >
            Browse
          </Link>
          <span className="text-marvel-black/30">/</span>
          <Link
            to="/favorites"
            className="font-display text-sm uppercase tracking-widest text-marvel-black hover:text-marvel-red"
            activeProps={{ className: "text-marvel-red underline decoration-4 underline-offset-4" }}
          >
            Favorites ({fav.ids.length})
          </Link>
          <span className="text-marvel-black/30">/</span>
          <Link
            to="/compare"
            className="font-display text-sm uppercase tracking-widest text-marvel-black hover:text-marvel-red"
            activeProps={{ className: "text-marvel-red underline decoration-4 underline-offset-4" }}
          >
            Compare ({cmp.ids.length}/2)
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link
            to="/compare"
            className="brutal-border brutal-shadow-sm bg-marvel-yellow px-2 py-1.5 font-display text-xs uppercase"
          >
            VS {cmp.ids.length}
          </Link>
          <Link
            to="/favorites"
            className="brutal-border brutal-shadow-sm bg-marvel-white px-2 py-1.5 font-display text-xs uppercase"
          >
            ★ {fav.ids.length}
          </Link>
        </div>
      </div>
    </header>
  );
}
