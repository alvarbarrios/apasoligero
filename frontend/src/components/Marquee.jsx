export default function Marquee({ items, className = "" }) {
  const row = items.join("\u2003//\u2003");
  return (
    <div className={`marquee-mask overflow-hidden border-y border-olive-600/60 bg-olive-950 py-4 ${className}`} data-testid="editorial-marquee">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((n) => (
          <span
            key={n}
            aria-hidden={n === 1}
            className="pr-8 font-display text-2xl font-bold uppercase tracking-[0.12em] text-khaki/70"
          >
            {row}
            <span className="text-brass">{"\u2003"}///{"\u2003"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
