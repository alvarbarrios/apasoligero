import { Play, Pause, X, Download } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

const fmt = (s) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export default function PlayerBar() {
  const { track, playing, time, dur, toggle, seek, close } = usePlayer();
  if (!track) return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-brass/40 bg-olive-950/95 backdrop-blur-md"
      data-testid="global-player-bar"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <div className="flex items-end gap-[3px]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[3px] bg-brass ${playing ? "eq-bar" : "scale-y-[0.3]"}`}
              style={{ height: 16, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1 sm:flex-none sm:basis-56">
          <p className="truncate font-display text-sm font-bold uppercase tracking-wide text-parchment" data-testid="player-track-title">
            {track.title}
          </p>
          {track.sub && (
            <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">{track.sub}</p>
          )}
        </div>
        <button
          onClick={toggle}
          aria-label={playing ? "Pausar" : "Reproducir"}
          data-testid="player-toggle-button"
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-brass text-brass transition-colors hover:bg-brass hover:text-obsidian"
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <span className="hidden font-mono text-[10px] text-khaki sm:block" data-testid="player-time-current">{fmt(time)}</span>
        <input
          type="range"
          className="player-slider min-w-0 flex-1"
          min={0}
          max={dur || 0}
          step={0.1}
          value={Math.min(time, dur || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Progreso de reproducción"
          data-testid="player-progress-slider"
        />
        <span className="hidden font-mono text-[10px] text-khaki sm:block" data-testid="player-time-total">{fmt(dur)}</span>
        <a
          href={track.file}
          download
          aria-label="Descargar audio"
          data-testid="player-download-button"
          className="hidden shrink-0 text-sage transition-colors hover:text-brass sm:block"
        >
          <Download size={16} />
        </a>
        <button
          onClick={close}
          aria-label="Cerrar reproductor"
          data-testid="player-close-button"
          className="shrink-0 text-sage transition-colors hover:text-signal"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
