import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "../components/SiteNav";
import { CharacterCard } from "../components/CharacterCard";
import { CategoryFilter } from "../components/CategoryFilter";
import { characters, type Category } from "../data/characters";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marvel Character Encyclopedia — Browse Every Hero & Villain" },
      {
        name: "description",
        content:
          "Browse 40+ Marvel heroes and villains. Search, filter by team, bookmark favorites, and compare characters side-by-side.",
      },
      { property: "og:title", content: "Marvel Character Encyclopedia" },
      {
        property: "og:description",
        content:
          "A neobrutalist Marvel character database — Avengers, X-Men, Guardians, villains and more.",
      },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<Category>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return characters.filter((c) => {
      const matchQ =
        !q || c.name.toLowerCase().includes(q) || c.alias.toLowerCase().includes(q);
      const matchCat = selected.size === 0 || c.category.some((cat) => selected.has(cat));
      return matchQ && matchCat;
    });
  }, [query, selected]);

  const toggleCat = (c: Category) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const random = () => {
    const c = characters[Math.floor(Math.random() * characters.length)];
    navigate({ to: "/characters/$characterId", params: { characterId: c.id } });
  };

  return (
    <div className="min-h-screen">
      <SiteNav />

      <section className="border-b-4 border-marvel-black bg-marvel-red">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="brutal-border brutal-shadow-sm inline-block bg-marvel-yellow px-2 py-1 font-display text-xs uppercase tracking-widest">
            Vol. 1 · Issue #001
          </p>
          <h1 className="mt-4 font-display text-[3rem] uppercase leading-[0.9] text-marvel-white sm:text-[5rem] md:text-[7rem]">
            The Marvel
            <br />
            <span className="inline-block bg-marvel-black px-3 text-marvel-yellow">
              Encyclopedia
            </span>
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base text-marvel-white sm:text-lg">
            40 heroes, villains, gods, mutants and cosmic weirdos. Search, filter, favorite,
            and pit them against each other.
          </p>
        </div>
      </section>

      <section className="sticky top-[68px] z-30 border-b-4 border-marvel-black bg-marvel-bone">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_auto_auto]">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH NAME OR ALIAS…"
              className="brutal-border brutal-shadow-sm w-full bg-marvel-white px-4 py-3 font-display text-base uppercase tracking-wider text-marvel-black placeholder:text-marvel-black/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={random}
              className="brutal-border brutal-shadow-sm bg-marvel-yellow px-4 py-3 font-display text-sm uppercase tracking-wider transition-transform hover:-translate-y-0.5"
            >
              🎲 <span className="hidden sm:inline">Random</span>
            </button>
            {(query || selected.size > 0) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelected(new Set());
                }}
                className="brutal-border brutal-shadow-sm col-span-2 bg-marvel-black px-4 py-3 font-display text-sm uppercase tracking-wider text-marvel-white sm:col-span-1"
              >
                Clear
              </button>
            )}
          </div>
          <CategoryFilter
            selected={selected}
            onToggle={toggleCat}
            onClear={() => setSelected(new Set())}
          />
          <p className="font-display text-xs uppercase tracking-widest text-marvel-black/70">
            {filtered.length} {filtered.length === 1 ? "Character" : "Characters"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {filtered.length === 0 ? (
          <div className="brutal-border-4 brutal-shadow-lg mx-auto max-w-xl bg-marvel-black p-10 text-center">
            <p className="font-display text-6xl uppercase text-marvel-red">NO HEROES</p>
            <p className="font-display text-6xl uppercase text-marvel-yellow">FOUND</p>
            <p className="mt-4 font-sans text-sm uppercase tracking-widest text-marvel-white">
              Try a different search or clear the filters.
            </p>
          </div>
        ) : (
          <div className="route-fade grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t-4 border-marvel-black bg-marvel-black px-4 py-8 text-center sm:px-6">
        <p className="font-display text-sm uppercase tracking-widest text-marvel-white">
          Fan-made encyclopedia · Not affiliated with Marvel Entertainment
        </p>
      </footer>
    </div>
  );
}
