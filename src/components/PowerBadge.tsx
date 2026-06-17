export function PowerBadge({ label }: { label: string }) {
  return (
    <span className="brutal-border brutal-shadow-sm inline-block bg-marvel-yellow px-3 py-1.5 font-display text-sm uppercase tracking-wide text-marvel-black">
      {label}
    </span>
  );
}
