import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Download, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import AudioButton from "@/components/AudioButton";
import useTitle from "@/hooks/useTitle";
import data from "@/data/archive";

export default function Audios() {
  useTitle("Archivo de Audio");
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data.audios.items;
    return data.audios.items.filter((i) => i.title.toLowerCase().includes(t));
  }, [q]);

  return (
    <div data-testid="audios-page">
      <PageHeader
        eyebrow="Audio Master HQ // Descarga directa"
        title="Listado de Archivos de Audio"
        intro={[
          "Todos los archivos de sonido del archivo, reunidos en un solo listado: himnos, canciones y marchas. Pulse play para escuchar o descargue el MP3.",
          "Los toques de corneta tienen su propia sección con el significado de cada toque.",
        ]}
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Audios" }]}
      >
        <Link
          to="/canciones/corneta"
          data-testid="audios-to-corneta"
          className="group mt-6 inline-flex items-center gap-2 border border-olive-500 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-sage transition-colors hover:border-brass hover:text-brass"
        >
          Ir a Toques de Corneta <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-khaki" data-testid="list-count">
            Archivos · {items.length} / {data.audios.items.length}
          </p>
          <label className="flex items-center gap-2 border border-olive-600 bg-olive-950 px-3 py-2">
            <Search size={14} className="text-khaki" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar audio…"
              data-testid="audio-search-input"
              className="w-48 bg-transparent font-mono text-xs uppercase tracking-widest text-parchment placeholder:text-khaki/60 focus:outline-none sm:w-64"
            />
          </label>
        </div>
        <div className="mt-6 divide-y divide-olive-600/50 border border-olive-600/70">
          {items.map((a, i) => (
            <Reveal key={a.file} delay={Math.min(i * 0.02, 0.3)} y={10}>
              <div className="group flex items-center gap-4 bg-olive-950/60 px-4 py-3 transition-colors hover:bg-olive-900 sm:px-6" data-testid={`audio-row-${i}`}>
                <span className="hidden w-8 shrink-0 font-mono text-[10px] tracking-widest text-khaki sm:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <AudioButton file={a.file} title={a.title} sub="Archivo de Audio" size="sm" testid={`audio-play-${i}`} />
                <span className="min-w-0 flex-1 truncate font-display text-lg font-bold uppercase tracking-wide text-sage transition-colors group-hover:text-brass">
                  {a.title}
                </span>
                <span className="hidden font-mono text-[9px] uppercase tracking-widest text-khaki md:block">
                  {a.file.split("/").pop()}
                </span>
                <a
                  href={a.file}
                  download
                  aria-label={`Descargar ${a.title}`}
                  data-testid={`audio-download-${i}`}
                  className="shrink-0 text-khaki transition-colors hover:text-brass"
                >
                  <Download size={15} />
                </a>
              </div>
            </Reveal>
          ))}
          {items.length === 0 && (
            <p className="px-6 py-10 text-center font-mono text-xs uppercase tracking-widest text-khaki" data-testid="no-results">
              Sin resultados para «{q}»
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
