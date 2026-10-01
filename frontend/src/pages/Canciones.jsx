import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import useTitle from "@/hooks/useTitle";
import data from "@/data/archive";

const SECTIONS = [
  { n: "01", title: "Paso Ligero", to: "/canciones/paso-ligero", img: "/assets/img/pasoligero.JPG", desc: data.pasoligero.intro.join(" "), count: `${data.pasoligero.items.length} canciones`, id: "pasoligero" },
  { n: "02", title: "Himnos", to: "/canciones/himnos", img: "/assets/img/himnos.JPG", desc: "Un himno es una canción que representa a algo. Letras y sonidos de los distintos Ejércitos de España.", count: `${data.himnosGroups.reduce((a, g) => a + g.items.length, 0)} himnos`, id: "himnos" },
  { n: "03", title: "Toques de Corneta", to: "/canciones/corneta", img: "/assets/img/corneta.jpg", desc: data.corneta.intro[0], count: `${data.corneta.calls.length} toques · ${data.cornetin.calls.length} de cornetín`, id: "corneta" },
  { n: "04", title: "Otras Canciones y Miscelánea", to: "/canciones/otras", img: "/assets/img/otras.JPG", desc: data.otras.intro[0], count: `${data.otras.items.length} canciones`, id: "otras" },
  { n: "05", title: "Cancionero Internacional", to: "/canciones/internacional", img: "/assets/img/internacional.jpg", desc: "Sección donde iré incluyendo distintas canciones de otros Ejércitos aportadas por distintos colaboradores.", count: "Próximamente", id: "internacional" },
];

export default function Canciones() {
  useTitle("Canciones");
  return (
    <div data-testid="canciones-page">
      <PageHeader
        eyebrow="Cancionero militar"
        title="Canciones"
        intro={[
          "Típicas canciones que se cantan corriendo todos juntos en Unidad, himnos de los distintos Ejércitos, toques de corneta y una variopinta mezcolanza de miscelánea castrense.",
        ]}
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Canciones" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <Link
                to={s.to}
                data-testid={`canciones-card-${s.id}`}
                className="group relative grid gap-6 overflow-hidden border border-olive-600/70 bg-olive-950 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/70 sm:grid-cols-[180px_1fr_auto] sm:items-center"
              >
                <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
                <img src={s.img} alt="" className="hidden h-28 w-full border border-olive-600 object-cover sm:block" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">SEC_{s.n} // {s.count}</p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight text-parchment transition-colors group-hover:text-brass sm:text-3xl">
                    {s.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sage">{s.desc}</p>
                </div>
                <span className="hidden h-10 w-10 items-center justify-center border border-olive-500 text-brass transition-colors group-hover:bg-brass group-hover:text-obsidian sm:flex">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
