import type { Category } from "../data/characters";
import { CATEGORIES } from "../data/characters";

interface Props {
  selected: Set<Category>;
  onToggle: (c: Category) => void;
  onClear: () => void;
}

export function CategoryFilter({ selected, onToggle, onClear }: Props) {
  const all = selected.size === 0;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onClear}
        className="brutal-border brutal-shadow-sm px-3 py-1.5 font-display text-xs uppercase tracking-wider transition-transform hover:-translate-y-0.5"
        style={{
          backgroundColor: all ? "#0D0D0D" : "#FFFFFF",
          color: all ? "#FFFFFF" : "#0D0D0D",
        }}
      >
        All
      </button>
      {CATEGORIES.map((c) => {
        const on = selected.has(c);
        return (
          <button
            key={c}
            type="button"
            onClick={() => onToggle(c)}
            className="brutal-border brutal-shadow-sm px-3 py-1.5 font-display text-xs uppercase tracking-wider transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: on ? "#ED1D24" : "#FFFFFF",
              color: on ? "#FFFFFF" : "#0D0D0D",
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
