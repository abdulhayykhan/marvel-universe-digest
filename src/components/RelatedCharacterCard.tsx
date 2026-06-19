import { Link } from "@tanstack/react-router";
import { getCharacter } from "../data/characters";
import { CharacterPortrait } from "./CharacterPortrait";

export function RelatedCharacterCard({ id, kind }: { id: string; kind: "ally" | "enemy" }) {
  const c = getCharacter(id);
  const accent = kind === "ally" ? "#F5C518" : "#ED1D24";

  if (!c) {
    return (
      <div
        className="brutal-border brutal-shadow-sm flex items-center gap-3 bg-marvel-white p-3"
        title="Profile coming soon"
      >
        <div
          className="grid h-14 w-14 shrink-0 place-items-center font-display text-xl uppercase"
          style={{ backgroundColor: accent, color: "#0D0D0D" }}
        >
          ?
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg uppercase leading-none capitalize">
            {id.replace(/-/g, " ")}
          </p>
          <p className="text-xs uppercase tracking-widest text-marvel-black/60">Profile soon</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      to="/characters/$characterId"
      params={{ characterId: c.id }}
      className="brutal-border brutal-shadow-sm brutal-hover flex items-center gap-3 bg-marvel-white p-3"
    >
      <div className="brutal-border h-14 w-14 shrink-0 overflow-hidden" style={{ borderWidth: 2 }}>
        <CharacterPortrait alias={c.alias} id={c.id} name={c.name} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg uppercase leading-none">{c.alias}</p>
        <p className="truncate text-xs uppercase tracking-widest text-marvel-black/60">{c.name}</p>
      </div>
      <span
        className="brutal-border shrink-0 px-2 py-0.5 font-display text-[10px] uppercase"
        style={{ backgroundColor: accent, color: "#0D0D0D" }}
      >
        {kind}
      </span>
    </Link>
  );
}
