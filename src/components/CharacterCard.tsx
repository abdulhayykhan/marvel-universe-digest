import { Link } from "@tanstack/react-router";
import type { Character } from "../data/characters";
import { CharacterPortrait } from "./CharacterPortrait";
import { useFavorites, useCompare } from "../lib/favorites";

export function CharacterCard({ character }: { character: Character }) {
  const fav = useFavorites();
  const cmp = useCompare();
  const isFav = fav.has(character.id);
  const inCmp = cmp.has(character.id);

  return (
    <article className="brutal-border-4 brutal-shadow brutal-hover relative flex flex-col bg-marvel-black">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          fav.toggle(character.id);
        }}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        className="brutal-border absolute right-2 top-2 z-10 h-9 w-9 bg-marvel-white text-lg font-black leading-none transition-transform hover:scale-110"
        style={{ color: isFav ? "#ED1D24" : "#0D0D0D" }}
      >
        {isFav ? "★" : "☆"}
      </button>

      <CharacterPortrait alias={character.alias} id={character.id} name={character.name} />

      <div className="flex flex-1 flex-col gap-2 border-t-4 border-marvel-black bg-marvel-black p-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-2xl uppercase leading-none text-marvel-white">
            {character.alias}
          </h3>
          <p className="mt-1 truncate font-sans text-xs uppercase tracking-widest text-marvel-yellow">
            {character.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {character.category.slice(0, 2).map((c) => (
            <span
              key={c}
              className="brutal-border bg-marvel-red px-1.5 py-0.5 font-display text-[10px] uppercase tracking-wide text-marvel-white"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <Link
            to="/characters/$characterId"
            params={{ characterId: character.id }}
            className="brutal-border brutal-shadow-sm bg-marvel-red px-3 py-2 text-center font-display text-sm uppercase tracking-wider text-marvel-white transition-transform hover:-translate-y-0.5"
          >
            View Profile
          </Link>
          <button
            type="button"
            onClick={() => cmp.toggle(character.id)}
            aria-label={inCmp ? "Remove from compare" : "Add to compare"}
            className="brutal-border brutal-shadow-sm shrink-0 px-3 py-2 font-display text-sm uppercase tracking-wider transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: inCmp ? "#F5C518" : "#FFFFFF",
              color: "#0D0D0D",
            }}
            title="Add to comparison"
          >
            VS
          </button>
        </div>
      </div>
    </article>
  );
}
