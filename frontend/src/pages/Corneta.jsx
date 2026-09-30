import { Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import AudioButton from "@/components/AudioButton";
import QueueButton from "@/components/QueueButton";
import useTitle from "@/hooks/useTitle";
import data from "@/data/archive";

export default function Corneta() {
  useTitle("Toques de Corneta");
  const { calls } = data.corneta;
  const withAudio = calls.filter((c) => c.file).length;
  return (
    <div data-testid="corneta-page">
      <PageHeader
        eyebrow="SEC_03 // Señales acústicas reglamentarias"
        title="Toques de Corneta"
        image="/assets/img/corneta.jpg"
        intro={data.corneta.intro}
        crumbs={[{ to: "/", label: "Inicio" }, { to: "/canciones", label: "Canciones" }, { label: "Corneta" }]}
      />
      <div className="dot-matrix mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-khaki" data-testid="corneta-count">
          Lista de toques · {withAudio} con audio / {calls.length} registrados
        </p>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {calls.map((c, i) => (
            <Reveal key={i} delay={Math.min(i * 0.03, 0.35)} y={12}>
              <div
                className="group flex items-center gap-4 border border-olive-600/70 bg-olive-950 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/70"
                data-testid={`toque-${i}`}
              >
                <span className="w-8 shrink-0 font-mono text-[10px] tracking-widest text-khaki">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-xl font-bold uppercase tracking-wide text-parchment transition-colors group-hover:text-brass">
                    {c.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-sage">{c.desc}</p>
                </div>
                {c.file ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={c.file}
                      download
                      aria-label={`Descargar ${c.name}`}
                      data-testid={`toque-download-${i}`}
                      className="hidden text-khaki transition-colors hover:text-brass sm:block"
                    >
                      <Download size={15} />
                    </a>
                    <AudioButton file={c.file} title={`Toque de ${c.name}`} sub="Toques de Corneta" size="sm" testid={`toque-play-${i}`} />
                    <QueueButton file={c.file} title={`Toque de ${c.name}`} sub="Toques de Corneta" testid={`toque-queue-${i}`} />
                  </div>
                ) : (
                  <span className="shrink-0 border border-olive-600 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-khaki" data-testid={`toque-noaudio-${i}`}>
                    Sin audio
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
