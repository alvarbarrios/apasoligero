import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CornetaMark from "@/components/CornetaMark";
import useTitle from "@/hooks/useTitle";
import data, { HIMNOS_META } from "@/data/archive";

export default function Himnos() {
  useTitle("Himnos");
  return (
    <div data-testid="himnos-page">
      <PageHeader
        eyebrow="SEC_02 // Himnos militares"
        title="Himnos"
        image="/assets/img/himnos.JPG"
        intro={[
          "Un himno es una canción que representa a algo, y algunos de ellos, no sé muy bien si por su melodía y lo profundo de su música o quizás por lo que representan, pueden llenar de emoción al que los oye o canta si pone todo su sentimiento en ello.",
          "A continuación, muchas letras y algunos sonidos de los distintos Ejércitos de España.",
        ]}
        crumbs={[{ to: "/", label: "Inicio" }, { to: "/canciones", label: "Canciones" }, { label: "Himnos" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.himnosGroups.map((g, i) => {
            const meta = HIMNOS_META[g.slug] || {};
            return (
              <Reveal key={g.slug} delay={i * 0.05}>
                <Link
                  to={`/canciones/himnos/${g.slug}`}
                  data-testid={`himnos-group-${g.slug}`}
                  className="group relative flex h-full flex-col border border-olive-600/70 bg-olive-950 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/70"
                >
                  <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start justify-between">
                    {meta.emblem ? (
                      <img src={meta.emblem} alt={`Emblema: ${meta.short}`} className="h-16 w-16 border border-olive-600 object-contain bg-olive-900 p-1" />
                    ) : (
                      <CornetaMark size={64} />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">{meta.code || g.slug}</span>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-parchment transition-colors group-hover:text-brass">
                    {meta.short || g.title}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">
                    {g.items.length} {g.items.length === 1 ? "registro" : "registros"}
                  </p>
                  <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki transition-colors group-hover:text-brass">
                    Abrir sección <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
