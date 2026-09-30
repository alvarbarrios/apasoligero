import { ExternalLink, PenLine } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import useTitle from "@/hooks/useTitle";
import data from "@/data/archive";

export default function Libro() {
  useTitle("Libro de Visitas");
  return (
    <div data-testid="libro-page">
      <PageHeader
        eyebrow="GuestBook de A Paso Ligero .com"
        title="Libro de Visitas"
        intro={[
          "He dado pie a este pequeño apartado para que puedan dejar su huella en este lugar, especialmente si han disfrutado con su contenido.",
          "Para mí sirve de gran aliciente el saber que hay gente para la que es útil todo el esfuerzo que dedico a mantener esta web; y otros con tanta afición en los temas castrenses como yo.",
          "El libro se encuentra en una página externa siguiendo el enlace de más abajo. ¡Dejen su firma!",
        ]}
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Libro de Visitas" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="relative mx-auto max-w-2xl border border-olive-600 bg-olive-950 p-10 text-center" data-testid="guestbook-card">
            <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-brass" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brass" />
            <PenLine size={28} className="mx-auto text-brass" />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-khaki">Registro de visitantes</p>
            <a
              href={data.meta.guestbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="guestbook-external-link"
              className="group mt-6 inline-flex items-center gap-3 bg-brass px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-obsidian transition-colors hover:bg-parchment"
            >
              Libro de Visitas <ExternalLink size={14} />
            </a>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-khaki">
              Se abre en una página externa
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
