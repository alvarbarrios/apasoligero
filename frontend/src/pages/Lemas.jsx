import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import useTitle from "@/hooks/useTitle";
import data, { LEMAS_META } from "@/data/archive";

export default function Lemas() {
  useTitle("Lemas de Unidades");
  return (
    <div data-testid="lemas-page">
      <PageHeader
        eyebrow="Patio de Armas // Espíritu de Unidad"
        title="Lemas de Unidades"
        intro={[
          "Dentro de las Fuerzas Armadas, cada Unidad tiene una frase que refleja su espíritu y sus virtudes. En español o en latín, los componentes de estas Unidades no pueden evitar sentir un orgullo especial cuando las exclaman en el Patio de Armas.",
          "Aquí se recogen todos los que he podido encontrar de las Fuerzas Armadas Españolas; y próximamente incluiré una sección Internacional.",
        ]}
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Lemas" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data.lemasGroups.map((g, i) => {
            const meta = LEMAS_META[g.slug] || {};
            const short = g.slug.replace(/^l/, "");
            return (
              <Reveal key={g.slug} delay={i * 0.05}>
                <Link
                  to={`/lemas/${short}`}
                  data-testid={`lemas-group-${short}`}
                  className="group relative flex h-full flex-col items-start border border-olive-600/70 bg-olive-950 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/70"
                >
                  <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
                  <img
                    src={meta.emblem}
                    alt={`Escudo: ${meta.short || g.title}`}
                    className="h-20 w-20 border border-olive-600 bg-olive-900 object-contain p-1.5"
                  />
                  <h2 className="mt-4 font-display text-xl font-extrabold uppercase leading-tight tracking-tight text-parchment transition-colors group-hover:text-brass">
                    {meta.short || g.title}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">
                    {g.entries.length} {g.entries.length === 1 ? "lema" : "lemas"}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki transition-colors group-hover:text-brass">
                    Ver escudo <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
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
