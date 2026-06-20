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
      thumbnail?: { source?: string; width?: number; height?: number };
      originalimage?: { source?: string; width?: number; height?: number };
    };
    if (json?.type === "disambiguation") return null;
    // Reject collages / multi-panel grids by aspect ratio of the source image
    const orig = json?.originalimage;
    if (orig?.width && orig?.height) {
      const ratio = orig.width / orig.height;
      if (ratio < 0.5 || ratio > 1.6) return null;
    }
    const src = json?.thumbnail?.source || json?.originalimage?.source || null;
    return src ?? null;
  } catch {
    return null;
  }
}

async function resolveImage(alias: string, name?: string): Promise<string | null> {
  const key = `${alias}|${name ?? ""}`;
  if (imageCache.has(key)) return imageCache.get(key)!;
  if (inflight.has(key)) return inflight.get(key)!;

  const terms = [
    `${alias} (Marvel Cinematic Universe)`,
    `${alias} (Marvel Comics)`,
    `${alias} (Marvel Comics character)`,
    `${alias} (character)`,
    `${alias} (comics)`,
    alias,
    ...(name ? [name] : []),
  ];

  const p = (async () => {
    for (const t of terms) {
      const src = await fetchOne(t);
      if (src) {
        imageCache.set(key, src);
        return src;
      }
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
  const text = initials(alias);
  const cacheKey = `${alias}|${name ?? ""}`;
  const cached = imageCache.has(cacheKey) ? imageCache.get(cacheKey)! : undefined;

  const [imgSrc, setImgSrc] = useState<string | null>(cached ?? null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    cached === undefined ? "loading" : cached ? "loaded" : "error"
  );

  useEffect(() => {
    let cancelled = false;
    if (imageCache.has(cacheKey)) {
      const v = imageCache.get(cacheKey)!;
      setImgSrc(v);
      setStatus(v ? "loaded" : "error");
      return;
    }
    setStatus("loading");
    setImgSrc(null);
    resolveImage(alias, name).then((src) => {
      if (cancelled) return;
      if (src) {
        setImgSrc(src);
        setStatus("loaded");
      } else {
        setImgSrc(null);
        setStatus("error");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [alias, name, cacheKey]);

  const dims =
    size === "hero"
      ? "h-64 sm:h-80 md:h-96 text-[6rem] sm:text-[8rem] md:text-[10rem]"
      : size === "sm"
      ? "h-full text-3xl"
      : "h-40 sm:h-48 text-6xl sm:text-7xl";

  const pattern = `radial-gradient(${palette.accent} 1.5px, transparent 1.5px)`;

  const renderFallback = () => (
    <>
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
    </>
  );

  return (
    <div
      className={`relative w-full overflow-hidden ${dims} ${className}`}
      style={{ backgroundColor: status === "loaded" ? "#0D0D0D" : palette.bg }}
      aria-hidden="true"
    >
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-neutral-700" />
      )}
      {status === "loaded" && imgSrc && (
        <img
          src={imgSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => {
            imageCache.set(cacheKey, null);
            setImgSrc(null);
            setStatus("error");
          }}
        />
      )}
      {status === "error" && renderFallback()}
    </div>
  );
}
