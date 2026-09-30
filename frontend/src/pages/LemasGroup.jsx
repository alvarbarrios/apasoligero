import { useParams } from "react-router-dom";
import { Quote } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import useTitle from "@/hooks/useTitle";
import NotFound from "@/pages/NotFound";
import { LEMAS_META, getLemasGroup } from "@/data/archive";

export default function LemasGroup() {
  const { group } = useParams();
  const g = getLemasGroup(group);
  const meta = LEMAS_META[g?.slug] || {};
  useTitle(g ? `Lemas · ${meta.short || g.title}` : "Lemas");

  if (!g) return <NotFound />;

  return (
    <div data-testid={`lemas-group-${group}`}>
      <PageHeader
        eyebrow={`Patio de Armas // ${meta.code || group}`}
        title={g.title}
        intro={g.intro.filter((l) => l.length > 30)}
        image={meta.emblem}
        crumbs={[{ to: "/", label: "Inicio" }, { to: "/lemas", label: "Lemas" }, { label: meta.short || g.title }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-khaki" data-testid="list-count">
          Lemas registrados · {g.entries.length}
        </p>
        <div className="mt-6 space-y-3">
          {g.entries.map((e, i) => (
            <Reveal key={i} delay={Math.min(i * 0.02, 0.3)} y={10}>
              <div
                className="group relative border border-olive-600/70 bg-olive-950 p-5 pl-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/70"
                data-testid={`lema-${i}`}
              >
                <span className="absolute left-0 top-0 h-full w-0.5 bg-olive-600 transition-colors group-hover:bg-brass" />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">{e.unit}</p>
                    <p className="mt-2 flex items-start gap-2 font-serif-ed text-xl italic leading-snug text-brass sm:text-2xl">
                      <Quote size={14} className="mt-1.5 shrink-0 text-brass/50" />
                      <span>{e.motto}</span>
                    </p>
                    {e.translation && (
                      <p className="mt-2 pl-6 text-sm text-sage">({e.translation})</p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-[10px] tracking-widest text-olive-500">
                    Nº {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
