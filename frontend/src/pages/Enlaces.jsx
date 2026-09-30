import { ExternalLink, Award } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import useTitle from "@/hooks/useTitle";
import data from "@/data/archive";

export default function Enlaces() {
  useTitle("Enlaces");
  const links = [];
  const seen = new Set();
  for (const b of data.enlaces.blocks) {
    for (const l of b.links || []) {
      if (l.kind === "external" && l.text && !seen.has(l.href)) {
        seen.add(l.href);
        links.push(l);
      }
    }
  }
  return (
    <div data-testid="enlaces-page">
      <PageHeader
        eyebrow="Red de páginas amigas"
        title="Enlaces y Páginas Amigas"
        intro={["Selección de sitios de interés sobre temas militares, coleccionismo y música castrense."]}
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Enlaces" }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-khaki">Links · {links.length}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {links.map((l, i) => (
            <Reveal key={l.href} delay={Math.min(i * 0.04, 0.3)} y={10}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`enlace-${i}`}
                className="group flex items-center gap-4 border border-olive-600/70 bg-olive-950 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/70"
              >
                <span className="w-8 shrink-0 font-mono text-[10px] tracking-widest text-khaki">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-bold uppercase tracking-wide text-sage transition-colors group-hover:text-brass">
                    {l.text}
                  </span>
                  <span className="block truncate font-mono text-[10px] tracking-widest text-khaki">{l.href}</span>
                </span>
                <ExternalLink size={15} className="shrink-0 text-olive-500 transition-colors group-hover:text-brass" />
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15}>
          <div className="mt-12 flex items-center gap-4 border border-brass/40 bg-olive-900/40 p-6" data-testid="premios-block">
            <Award size={28} className="shrink-0 text-brass" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Premios</p>
              <p className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight text-parchment">
                Sello de Calidad EYM
              </p>
              <p className="mt-1 text-sm text-sage">Reconocimiento otorgado por la comunidad «Ejército y Militares».</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
