import { useEffect, useState } from "react";

interface Props {
  alias: string;
  id: string;
  name?: string;
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

const imageCache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

const BAD_KEYWORDS = [
  "fan art",
  "fan-art",
  "cosplay",
  "collage",
  "montage",
  "compilation",
  "various incarnations",
  "various versions",
  "multiple versions",
  "gallery of",
];

const GENERIC_TITLE_KEYWORDS = ["topics referred to by", "list of", "disambiguation"];

const BAD_FILENAME_TOKENS = [
  "grid",
  "collage",
  "montage",
  "compilation",
  "incarnations",
  "_various",
  "-various",
  "variants",
  "gallery",
  "_vs_",
  "-vs-",
  "_vs.",
  "logo",
  "poster",
];

const DIRECT_IMAGE_OVERRIDES: Record<string, string> = {
  // The Loki comics page thumbnail is a multi-panel collage; use the MCU infobox portrait directly.
  Loki:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Tom_Hiddleston_by_Gage_Skidmore.jpg/330px-Tom_Hiddleston_by_Gage_Skidmore.jpg",
  // She-Hulk Wikipedia thumbnails are either a show logo or a "various incarnations" collage —
  // use a Tatiana Maslany portrait directly.
  "She-Hulk":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tatiana_Maslany_at_IGN_Live_2026.jpg/330px-Tatiana_Maslany_at_IGN_Live_2026.jpg",
};

function filenameLooksBad(url: string) {
  try {
    const path = decodeURIComponent(new URL(url).pathname).toLowerCase();
    const file = path.split("/").pop() || path;
    return BAD_FILENAME_TOKENS.some((tok) => file.includes(tok));
  } catch {
    const lower = url.toLowerCase();
    return BAD_FILENAME_TOKENS.some((tok) => lower.includes(tok));
  }
}

async function fetchOne(term: string): Promise<string | null> {
  try {
    const slug = encodeURIComponent(term.replace(/\s+/g, "_"));
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      type?: string;
      extract?: string;
      description?: string;
      title?: string;
      thumbnail?: { source?: string; width?: number; height?: number };
      originalimage?: { source?: string; width?: number; height?: number };
    };
    if (json?.type === "disambiguation") return null;

    const titleText = `${json?.title ?? ""} ${json?.description ?? ""}`.toLowerCase();
    if (GENERIC_TITLE_KEYWORDS.some((k) => titleText.includes(k))) return null;

    const dims =
      json?.originalimage?.width && json?.originalimage?.height
        ? json.originalimage
        : json?.thumbnail;
    if (dims?.width && dims?.height) {
      const ratio = dims.width / dims.height;
      // Allow portraits and cinematic stills, while rejecting obvious banners/grids.
      if (ratio < 0.45 || ratio > 1.95) return null;
    }

    const text = `${json?.extract ?? ""} ${json?.description ?? ""}`.toLowerCase();
    if (BAD_KEYWORDS.some((k) => text.includes(k))) return null;

    const src = json?.thumbnail?.source || null;
    if (!src) return null;
    if (filenameLooksBad(src)) return null;
    return src;
  } catch {
    return null;
  }
}

// Direct Wikipedia page titles for characters where the generic cascade fails
// or returns collages. These are tried FIRST.
const QUERY_OVERRIDES: Record<string, string[]> = {
  "Iron Man": ["Tony Stark (Marvel Cinematic Universe)", "Iron Man (Marvel Cinematic Universe)"],
  "Captain America": ["Steve Rogers (Marvel Cinematic Universe)"],
  Thor: ["Thor (Marvel Cinematic Universe)"],
  Hulk: ["Bruce Banner (Marvel Cinematic Universe)", "Hulk (Marvel Cinematic Universe)"],
  "Black Widow": [
    "Natasha Romanoff (Marvel Cinematic Universe)",
    "Black Widow (Natasha Romanova)",
  ],
  Hawkeye: ["Clint Barton (Marvel Cinematic Universe)"],
  "Spider-Man": ["Peter Parker (Marvel Cinematic Universe)"],
  "Doctor Strange": ["Stephen Strange (Marvel Cinematic Universe)"],
  "Black Panther": ["T'Challa (Marvel Cinematic Universe)"],
  "Captain Marvel": ["Carol Danvers (Marvel Cinematic Universe)"],
  "Ant-Man": ["Scott Lang (Marvel Cinematic Universe)"],
  "Scarlet Witch": ["Wanda Maximoff (Marvel Cinematic Universe)"],
  Vision: ["Vision (Marvel Cinematic Universe)", "Vision (Marvel Comics)"],
  Loki: ["Loki (Marvel Cinematic Universe)"],
  Thanos: ["Thanos (Marvel Cinematic Universe)"],
  Wolverine: ["Logan (film character)", "Wolverine (character)"],
  Deadpool: ["Wade Wilson (film character)", "Deadpool", "Deadpool (film)"],
  Storm: ["Storm (film character)", "Storm (Marvel Comics)"],
  Magneto: ["Magneto (film character)", "Erik Lehnsherr (film character)"],
  "Professor X": ["Charles Xavier (film character)", "Professor X", "Charles Xavier"],
  Gamora: ["Gamora (Marvel Cinematic Universe)", "Gamora"],
  "Rocket Raccoon": ["Rocket Raccoon (Marvel Cinematic Universe)", "Rocket (Marvel Cinematic Universe)", "Rocket Raccoon"],
  Groot: ["Groot (Marvel Cinematic Universe)", "Groot"],
  "Star-Lord": ["Star-Lord (Marvel Cinematic Universe)", "Peter Quill (Marvel Cinematic Universe)", "Star-Lord", "Peter Quill"],
  "Nick Fury": ["Nick Fury (Marvel Cinematic Universe)", "Nick Fury"],
  "Shang-Chi": ["Shang-Chi (Marvel Cinematic Universe)", "Shang-Chi"],
  Daredevil: ["Matt Murdock (Marvel Cinematic Universe)", "Daredevil (Marvel Comics character)", "Matt Murdock"],
  "Moon Knight": ["Marc Spector (Marvel Cinematic Universe)", "Moon Knight"],
  "She-Hulk": ["She-Hulk: Attorney at Law", "Jennifer Walters"],
  "Ms. Marvel": ["Kamala Khan (Marvel Cinematic Universe)", "Ms. Marvel (Kamala Khan)", "Kamala Khan"],
  Nebula: ["Nebula (Marvel Cinematic Universe)", "Nebula (character)"],
  "War Machine": ["War Machine (Marvel Cinematic Universe)", "James Rhodes (Marvel Cinematic Universe)", "War Machine"],
  "Falcon / Captain America": ["Sam Wilson (Marvel Cinematic Universe)"],
  "Winter Soldier": ["Bucky Barnes (Marvel Cinematic Universe)", "Bucky Barnes", "Winter Soldier (comics)"],
  Kingpin: ["Wilson Fisk (Marvel Cinematic Universe)", "Kingpin (character)"],
  "Green Goblin": ["Norman Osborn (2002 film series character)", "Green Goblin"],
};

async function resolveImage(alias: string, name?: string): Promise<string | null> {
  const key = `${alias}|${name ?? ""}`;
  const direct = DIRECT_IMAGE_OVERRIDES[alias];
  if (direct) {
    imageCache.set(key, direct);
    return direct;
  }
  if (imageCache.has(key)) return imageCache.get(key)!;
  if (inflight.has(key)) return inflight.get(key)!;

  const overrides = QUERY_OVERRIDES[alias] ?? [];
  const terms = [
    ...overrides,
    `${alias} (Marvel Cinematic Universe)`,
    `${alias} (Marvel Comics)`,
    `${alias} (comics)`,
    `${alias} (character)`,
    alias,
    ...(name ? [name] : []),
  ];

  const p = (async () => {
    try {
      for (const t of terms) {
        const src = await fetchOne(t);
        if (src) {
          imageCache.set(key, src);
          return src;
        }
      }
    } catch {
      // swallow
    }
    imageCache.set(key, null);
    return null;
  })().finally(() => {
    inflight.delete(key);
  });
  inflight.set(key, p);
  return p;
}

export function CharacterPortrait({ alias, id, name, size = "card", className = "" }: Props) {
  const palette = PALETTES[hash(id) % PALETTES.length];
  const text = initials(alias) || "??";
  const cacheKey = `${alias}|${name ?? ""}`;
  const directOverride = DIRECT_IMAGE_OVERRIDES[alias];
  const cached = directOverride ?? (imageCache.has(cacheKey) ? imageCache.get(cacheKey)! : undefined);

  const [imgSrc, setImgSrc] = useState<string | null>(cached ?? null);
  const [imgOk, setImgOk] = useState<boolean>(!!cached);

  useEffect(() => {
    let cancelled = false;
    if (directOverride) {
      setImgSrc(directOverride);
      setImgOk(true);
      return;
    }
    if (imageCache.has(cacheKey)) {
      const v = imageCache.get(cacheKey)!;
      setImgSrc(v);
      setImgOk(!!v);
      return;
    }
    setImgSrc(null);
    setImgOk(false);
    resolveImage(alias, name)
      .then((src) => {
        if (cancelled) return;
        setImgSrc(src);
        setImgOk(!!src);
      })
      .catch(() => {
        if (cancelled) return;
        setImgSrc(null);
        setImgOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [alias, name, cacheKey, directOverride]);

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
      {/* GUARANTEED FALLBACK — always painted underneath everything. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: palette.bg,
          backgroundImage: pattern,
          backgroundSize: "14px 14px",
          opacity: 0.55,
        }}
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

      {/* Image overlay — only shown if a real source resolved AND loads without error */}
      {imgSrc && imgOk && (
        <img
          src={imgSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center top", backgroundColor: "#0D0D0D" }}
          onError={() => {
            imageCache.set(cacheKey, null);
            setImgOk(false);
            setImgSrc(null);
          }}
        />
      )}
    </div>
  );
}
