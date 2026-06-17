interface Props {
  alias: string;
  id: string;
  size?: "card" | "hero" | "sm";
  className?: string;
}

const PALETTES: Array<{ bg: string; fg: string; accent: string }> = [
  { bg: "#ED1D24", fg: "#FFFFFF", accent: "#0D0D0D" },
  { bg: "#0D0D0D", fg: "#F5C518", accent: "#ED1D24" },
  { bg: "#F5C518", fg: "#0D0D0D", accent: "#ED1D24" },
  { bg: "#0D0D0D", fg: "#FFFFFF", accent: "#ED1D24" },
  { bg: "#ED1D24", fg: "#0D0D0D", accent: "#F5C518" },
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(alias: string) {
  const cleaned = alias.replace(/\(.*?\)/g, "").trim();
  const parts = cleaned.split(/[\s/-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function CharacterPortrait({ alias, id, size = "card", className = "" }: Props) {
  const palette = PALETTES[hash(id) % PALETTES.length];
  const text = initials(alias);
  const dims =
    size === "hero"
      ? "h-64 sm:h-80 md:h-96 text-[6rem] sm:text-[8rem] md:text-[10rem]"
      : size === "sm"
      ? "h-full text-3xl"
      : "h-40 sm:h-48 text-6xl sm:text-7xl";

  const pattern = `radial-gradient(${palette.accent} 1.5px, transparent 1.5px)`;

  return (
    <div
      className={`relative w-full overflow-hidden ${dims} ${className}`}
      style={{ backgroundColor: palette.bg }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: pattern, backgroundSize: "14px 14px" }}
      />
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rotate-45"
        style={{ backgroundColor: palette.accent }}
      />
      <div
        className="absolute -left-4 -bottom-4 h-16 w-16"
        style={{ backgroundColor: palette.accent }}
      />
      <div className="relative flex h-full w-full items-center justify-center">
        <span
          className="font-display font-black leading-none tracking-tight"
          style={{ color: palette.fg, WebkitTextStroke: `2px ${palette.accent}` }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
