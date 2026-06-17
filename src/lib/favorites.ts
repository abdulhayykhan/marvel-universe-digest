import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "marvel-favorites";
const CMP_KEY = "marvel-compare";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("marvel-storage", { detail: { key } }));
}

function useStoredList(key: string, max?: number) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read(key));
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string } | undefined;
      if (!detail || detail.key === key) setIds(read(key));
    };
    window.addEventListener("marvel-storage", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("marvel-storage", handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        let next: string[];
        if (prev.includes(id)) {
          next = prev.filter((x) => x !== id);
        } else {
          next = max ? [...prev, id].slice(-max) : [...prev, id];
        }
        write(key, next);
        return next;
      });
    },
    [key, max],
  );

  const clear = useCallback(() => {
    write(key, []);
    setIds([]);
  }, [key]);

  return { ids, toggle, clear, has: (id: string) => ids.includes(id) };
}

export const useFavorites = () => useStoredList(FAV_KEY);
export const useCompare = () => useStoredList(CMP_KEY, 2);
