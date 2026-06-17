import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "../components/SiteNav";
import { CharacterCard } from "../components/CharacterCard";
import { getCharacter } from "../data/characters";
import { useFavorites } from "../lib/favorites";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Marvel Character Encyclopedia" },
      { name: "description", content: "Your bookmarked Marvel characters." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const fav = useFavorites();
  const items = fav.ids.map(getCharacter).filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="border-b-4 border-marvel-black bg-marvel-yellow">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-[3rem] uppercase leading-none sm:text-[5rem]">
            ★ Favorites
          </h1>
          <p className="mt-2 font-display text-sm uppercase tracking-widest">
            {items.length} bookmarked
          </p>
        </div>
      </section>

      <section className="route-fade mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {items.length === 0 ? (
          <div className="brutal-border-4 brutal-shadow-lg mx-auto max-w-xl bg-marvel-black p-10 text-center">
            <p className="font-display text-5xl uppercase text-marvel-red">No Favorites</p>
            <p className="mt-4 font-sans text-sm uppercase tracking-widest text-marvel-white">
              Tap the star on any character card to bookmark them.
            </p>
            <Link
              to="/"
              className="brutal-border brutal-shadow-sm mt-6 inline-block bg-marvel-yellow px-4 py-2 font-display text-sm uppercase tracking-widest"
            >
              Browse roster
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((c) => (
              <CharacterCard key={c.id} character={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
