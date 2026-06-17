import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteNav } from "../components/SiteNav";
import { CharacterPortrait } from "../components/CharacterPortrait";
import { PowerBadge } from "../components/PowerBadge";
import { RelatedCharacterCard } from "../components/RelatedCharacterCard";
import { getCharacter } from "../data/characters";
import { useFavorites, useCompare } from "../lib/favorites";

export const Route = createFileRoute("/characters/$characterId")({
  loader: ({ params }): import("../data/characters").Character => {
    const character = getCharacter(params.characterId);
    if (!character) throw notFound();
    return character;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = `${loaderData.alias} — Marvel Character Encyclopedia`;
    const description = loaderData.bio.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-display text-7xl uppercase text-marvel-red">404</p>
        <p className="mt-2 font-display text-3xl uppercase">Character not found</p>
        <Link
          to="/"
          className="brutal-border brutal-shadow-sm mt-6 inline-block bg-marvel-black px-4 py-2 font-display text-sm uppercase tracking-widest text-marvel-white"
        >
          ← Back to roster
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-display text-5xl uppercase text-marvel-red">Snap!</p>
        <p className="mt-2 font-sans">Something went wrong loading this profile.</p>
        <button
          onClick={reset}
          className="brutal-border brutal-shadow-sm mt-6 bg-marvel-yellow px-4 py-2 font-display text-sm uppercase"
        >
          Try again
        </button>
      </div>
    </div>
  ),
  component: CharacterPage,
});

function CharacterPage() {
  const c = Route.useLoaderData();
  const fav = useFavorites();
  const cmp = useCompare();
  const isFav = fav.has(c.id);
  const inCmp = cmp.has(c.id);

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="route-fade">
        <div className="border-b-4 border-marvel-black bg-marvel-bone">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <Link
              to="/"
              className="brutal-border brutal-shadow-sm inline-block bg-marvel-white px-3 py-1.5 font-display text-xs uppercase tracking-widest"
            >
              ← Back to roster
            </Link>
          </div>
        </div>

        <section className="border-b-4 border-marvel-black bg-marvel-red">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] md:gap-10 md:py-12">
            <div className="min-w-0">
              <p className="brutal-border brutal-shadow-sm inline-block bg-marvel-yellow px-2 py-1 font-display text-xs uppercase tracking-widest">
                {c.category.join(" · ")}
              </p>
              <h1 className="mt-4 break-words font-display text-[3rem] uppercase leading-[0.85] text-marvel-white sm:text-[5rem] md:text-[7rem]">
                {c.alias}
              </h1>
              <p className="mt-4 font-display text-2xl uppercase tracking-wide text-marvel-yellow">
                A.K.A. {c.name}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => fav.toggle(c.id)}
                  className="brutal-border brutal-shadow-sm bg-marvel-white px-4 py-2 font-display text-sm uppercase tracking-widest"
                >
                  {isFav ? "★ Favorited" : "☆ Favorite"}
                </button>
                <button
                  onClick={() => cmp.toggle(c.id)}
                  className="brutal-border brutal-shadow-sm px-4 py-2 font-display text-sm uppercase tracking-widest"
                  style={{
                    backgroundColor: inCmp ? "#F5C518" : "#FFFFFF",
                    color: "#0D0D0D",
                  }}
                >
                  {inCmp ? "✓ In compare" : "VS Add to compare"}
                </button>
              </div>
            </div>
            <div className="brutal-border-4 brutal-shadow-lg w-full overflow-hidden bg-marvel-black md:w-80">
              <CharacterPortrait alias={c.alias} id={c.id} size="hero" />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div className="brutal-border-4 brutal-shadow bg-marvel-white p-6 md:col-span-2">
            <h2 className="font-display text-3xl uppercase">Bio</h2>
            <div className="mt-2 h-1 w-16 bg-marvel-red" />
            <p className="mt-4 font-sans text-base leading-relaxed">{c.bio}</p>
            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Real Name" value={c.name} />
              <Field label="Alias" value={c.alias} />
              <Field label="Affiliations" value={c.affiliation.join(", ")} />
              <Field label="Category" value={c.category.join(", ")} />
            </dl>
          </div>
          <div className="brutal-border-4 brutal-shadow bg-marvel-black p-6">
            <h2 className="font-display text-3xl uppercase text-marvel-yellow">Abilities</h2>
            <div className="mt-2 h-1 w-16 bg-marvel-red" />
            <div className="mt-4 flex flex-wrap gap-2">
              {c.powers.map((p) => (
                <PowerBadge key={p} label={p} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <div className="brutal-border-4 brutal-shadow bg-marvel-white p-6">
            <h2 className="font-display text-3xl uppercase">MCU Appearances</h2>
            <div className="mt-2 h-1 w-16 bg-marvel-red" />
            {c.mcu_appearances.length === 0 ? (
              <p className="mt-4 font-sans text-sm uppercase tracking-widest text-marvel-black/60">
                No live-action MCU appearances yet.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse font-sans">
                  <thead>
                    <tr className="bg-marvel-black text-marvel-white">
                      <Th>Title</Th>
                      <Th>Year</Th>
                      <Th>Role</Th>
                      <Th>Actor</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.mcu_appearances.map((m, i) => (
                      <tr
                        key={`${m.title}-${i}`}
                        className="border-b-2 border-marvel-black last:border-b-0"
                      >
                        <Td>{m.title}</Td>
                        <Td>{m.year}</Td>
                        <Td>
                          <span
                            className="brutal-border inline-block px-2 py-0.5 font-display text-xs uppercase"
                            style={{
                              backgroundColor:
                                m.role === "Lead"
                                  ? "#ED1D24"
                                  : m.role === "Supporting"
                                  ? "#F5C518"
                                  : "#FFFFFF",
                              color: m.role === "Lead" ? "#FFFFFF" : "#0D0D0D",
                            }}
                          >
                            {m.role}
                          </span>
                        </Td>
                        <Td>{m.actor}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 sm:px-6 md:grid-cols-2">
          <div className="brutal-border-4 brutal-shadow bg-marvel-bone p-6">
            <h2 className="font-display text-3xl uppercase">Allies</h2>
            <div className="mt-2 h-1 w-16 bg-marvel-yellow" />
            <div className="mt-4 grid grid-cols-1 gap-3">
              {c.allies.length === 0 ? (
                <p className="font-sans text-sm uppercase tracking-widest text-marvel-black/60">
                  Lone wolf.
                </p>
              ) : (
                c.allies.map((id) => <RelatedCharacterCard key={id} id={id} kind="ally" />)
              )}
            </div>
          </div>
          <div className="brutal-border-4 brutal-shadow bg-marvel-bone p-6">
            <h2 className="font-display text-3xl uppercase">Enemies</h2>
            <div className="mt-2 h-1 w-16 bg-marvel-red" />
            <div className="mt-4 grid grid-cols-1 gap-3">
              {c.enemies.length === 0 ? (
                <p className="font-sans text-sm uppercase tracking-widest text-marvel-black/60">
                  No known archenemies.
                </p>
              ) : (
                c.enemies.map((id) => <RelatedCharacterCard key={id} id={id} kind="enemy" />)
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="brutal-border bg-marvel-bone p-3">
      <dt className="font-display text-[10px] uppercase tracking-widest text-marvel-black/60">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-sm font-semibold">{value}</dd>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="border-b-2 border-marvel-black px-3 py-2 text-left font-display text-xs uppercase tracking-widest">
      {children}
    </th>
  );
}
function Td({ children }: { children: ReactNode }) {
  return <td className="px-3 py-2 font-sans text-sm">{children}</td>;
}
