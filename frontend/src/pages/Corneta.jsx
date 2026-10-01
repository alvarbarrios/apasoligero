import { Link } from "react-router-dom";
import { Download, ListMusic } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import AudioButton from "@/components/AudioButton";
import QueueButton from "@/components/QueueButton";
import useTitle from "@/hooks/useTitle";
import { usePlayer } from "@/context/PlayerContext";
import data from "@/data/archive";

const VARIANTS = {
  corneta: {
    eyebrow: "SEC_03 // Señales acústicas reglamentarias",
    title: "Toques de Corneta",
    sub: "Toques de Corneta",
    image: "/assets/img/corneta.jpg",
    crumb: "Corneta",
    testid: "corneta-page",
    get source() { return data.corneta; },
  },
  cornetin: {
    eyebrow: "SEC_03.1 // Voces de mando del orden cerrado",
    title: "Cornetín",
    sub: "Toques de Cornetín",
    image: "/assets/img/corneta.jpg",
    crumb: "Cornetín",
    testid: "cornetin-page",
    get source() { return data.cornetin; },
  },
};

const TABS = [
  ["corneta", "Toques de Corneta", "/canciones/corneta"],
  ["cornetin", "Cornetín", "/canciones/corneta/cornetin"],
];

export default function Corneta({ variant = "corneta" }) {
  const v = VARIANTS[variant];
  useTitle(v.title);
  const { playAll } = usePlayer();
  const { calls, intro } = v.source;
  const withAudio = calls.filter((c) => c.file);
  const crumbs = [{ to: "/", label: "Inicio" }, { to: "/canciones", label: "Canciones" }];
  if (variant === "cornetin") crumbs.push({ to: "/canciones/corneta", label: "Corneta" });
  crumbs.push({ label: v.crumb });

  return (
    <div data-testid={v.testid}>
      <PageHeader eyebrow={v.eyebrow} title={v.title} image={v.image} intro={intro} crumbs={crumbs} />
      <div className="dot-matrix mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2" data-testid="corneta-tabs">
            {TABS.map(([k, label, to]) => (
              <Link
                key={k}
                to={to}
                data-testid={`corneta-tab-${k}`}
                aria-current={k === variant ? "page" : undefined}
                className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  k === variant ? "border-brass bg-brass/10 text-brass" : "border-olive-600 text-sage hover:border-olive-500 hover:text-parchment"
                }`}
              >
                {label} · {data[k].calls.length}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-khaki" data-testid="corneta-count">
              Lista de toques · {withAudio.length} con audio / {calls.length} registrados
            </p>
            <button
              onClick={() => playAll(withAudio.map((c) => ({ file: c.file, title: `Toque de ${c.name}`, sub: v.sub })))}
              disabled={withAudio.length === 0}
              data-testid="corneta-play-all"
              className="flex items-center gap-2 border border-brass bg-brass/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brass transition-colors hover:bg-brass hover:text-obsidian disabled:opacity-40"
            >
              <ListMusic size={13} /> Reproducir todo
            </button>
          </div>
        </div>
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
                    <AudioButton file={c.file} title={`Toque de ${c.name}`} sub={v.sub} size="sm" testid={`toque-play-${i}`} />
                    <QueueButton file={c.file} title={`Toque de ${c.name}`} sub={v.sub} testid={`toque-queue-${i}`} />
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
