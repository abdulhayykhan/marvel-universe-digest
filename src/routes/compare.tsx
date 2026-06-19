import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "../components/SiteNav";
import { CharacterPortrait } from "../components/CharacterPortrait";
import { PowerBadge } from "../components/PowerBadge";
import { characters, getCharacter, type Character } from "../data/characters";
import { useCompare } from "../lib/favorites";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare — Marvel Character Encyclopedia" },
      { name: "description", content: "Pit two Marvel characters head to head." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const cmp = useCompare();
  const [aId, bId] = cmp.ids;
  const a = aId ? getCharacter(aId) : undefined;
  const b = bId ? getCharacter(bId) : undefined;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="border-b-4 border-marvel-black bg-marvel-black">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-[3rem] uppercase leading-none text-marvel-white sm:text-[5rem]">
            <span className="text-marvel-yellow">VS.</span> Compare
          </h1>
          <p className="mt-2 font-display text-sm uppercase tracking-widest text-marvel-white">
            Pick up to 2 characters via the "VS" button on any card.
          </p>
          {cmp.ids.length > 0 && (
            <button
              onClick={cmp.clear}
              className="brutal-border brutal-shadow-sm mt-4 bg-marvel-red px-3 py-1.5 font-display text-xs uppercase tracking-widest text-marvel-white"
            >
              Clear comparison
            </button>
          )}
        </div>
      </section>

      <section className="route-fade mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {!a && !b ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Slot character={a} onRemove={() => a && cmp.toggle(a.id)} />
            <Slot character={b} onRemove={() => b && cmp.toggle(b.id)} />
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="brutal-border-4 brutal-shadow-lg mx-auto max-w-xl bg-marvel-white p-10 text-center">
      <p className="font-display text-5xl uppercase">No matchup yet</p>
      <p className="mt-4 font-sans text-sm uppercase tracking-widest">
        Tap "VS" on any character card to add them.
      </p>
      <Link
        to="/"
        className="brutal-border brutal-shadow-sm mt-6 inline-block bg-marvel-red px-4 py-2 font-display text-sm uppercase tracking-widest text-marvel-white"
      >
        Browse roster
      </Link>
      <p className="mt-8 font-display text-xs uppercase tracking-widest text-marvel-black/60">
        Try: {characters[0].alias} vs {characters[14].alias}
      </p>
    </div>
  );
}

function Slot({ character, onRemove }: { character?: Character; onRemove: () => void }) {
  if (!character) {
    return (
      <div className="brutal-border-4 grid min-h-[400px] place-items-center bg-marvel-bone p-6 text-center">
        <div>
          <p className="font-display text-4xl uppercase text-marvel-black/40">Empty slot</p>
          <p className="mt-2 font-sans text-sm uppercase tracking-widest text-marvel-black/60">
            Add a character from the roster
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="brutal-border-4 brutal-shadow bg-marvel-white">
      <CharacterPortrait alias={character.alias} id={character.id} name={character.name} size="hero" />
      <div className="border-t-4 border-marvel-black p-5">
        <div className="grid grid-cols-[1fr_auto] items-start gap-2">
          <div className="min-w-0">
            <h2 className="truncate font-display text-3xl uppercase leading-none">
              {character.alias}
            </h2>
            <p className="mt-1 truncate font-sans text-xs uppercase tracking-widest text-marvel-black/60">
              {character.name}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="brutal-border shrink-0 bg-marvel-red px-2 py-1 font-display text-xs uppercase text-marvel-white"
          >
            ✕
          </button>
        </div>

        <Row label="Category" value={character.category.join(", ")} />
        <Row label="Affiliation" value={character.affiliation.join(", ")} />
        <Row label="Allies" value={String(character.allies.length)} />
        <Row label="Enemies" value={String(character.enemies.length)} />
        <Row label="MCU Films" value={String(character.mcu_appearances.length)} />

        <div className="mt-4">
          <p className="font-display text-xs uppercase tracking-widest text-marvel-black/60">
            Abilities
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {character.powers.map((p) => (
              <PowerBadge key={p} label={p} />
            ))}
          </div>
        </div>

        <Link
          to="/characters/$characterId"
          params={{ characterId: character.id }}
          className="brutal-border brutal-shadow-sm mt-5 inline-block bg-marvel-black px-3 py-2 font-display text-xs uppercase tracking-widest text-marvel-white"
        >
          Full profile →
        </Link>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 grid grid-cols-[120px_1fr] gap-2 border-t-2 border-marvel-black pt-2">
      <span className="font-display text-xs uppercase tracking-widest text-marvel-black/60">
        {label}
      </span>
      <span className="font-sans text-sm">{value}</span>
    </div>
  );
}
