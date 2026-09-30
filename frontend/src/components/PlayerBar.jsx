import { useState } from "react";
import { Play, Pause, X, Download, SkipForward, ListMusic } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import Waveform from "@/components/Waveform";
import QueuePanel from "@/components/QueuePanel";

const fmt = (s) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export default function PlayerBar() {
  const { track, playing, time, dur, queue, toggle, seek, close, next } = usePlayer();
  const [queueOpen, setQueueOpen] = useState(false);
  if (!track) return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-brass/40 bg-olive-950/95 backdrop-blur-md"
      data-testid="global-player-bar"
    >
      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <span className={`h-2 w-2 shrink-0 ${playing ? "bg-green-500 led-pulse" : "bg-khaki"}`} aria-hidden="true" />
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
        <button
          onClick={next}
          disabled={queue.length === 0}
          aria-label="Siguiente en la cola"
          data-testid="player-next-button"
          className="hidden h-9 w-9 shrink-0 items-center justify-center border border-olive-600 text-sage transition-colors enabled:hover:border-brass enabled:hover:text-brass disabled:opacity-30 sm:flex"
        >
          <SkipForward size={14} />
        </button>
        <span className="hidden font-mono text-[10px] text-khaki sm:block" data-testid="player-time-current">{fmt(time)}</span>
        <div className="relative h-10 min-w-0 flex-1">
          <Waveform />
          <input
            type="range"
            className="player-slider absolute inset-0 h-full w-full cursor-pointer opacity-0"
            min={0}
            max={dur || 0}
            step={0.1}
            value={Math.min(time, dur || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Progreso de reproducción"
            data-testid="player-progress-slider"
          />
        </div>
        <span className="hidden font-mono text-[10px] text-khaki sm:block" data-testid="player-time-total">{fmt(dur)}</span>
        <button
          onClick={() => setQueueOpen((o) => !o)}
          aria-label="Cola de reproducción"
          aria-expanded={queueOpen}
          data-testid="player-queue-button"
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${
            queueOpen ? "border-brass bg-brass text-obsidian" : "border-olive-600 text-sage hover:border-brass hover:text-brass"
          }`}
        >
          <ListMusic size={15} />
          {queue.length > 0 && (
            <span
              className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-brass px-1 font-mono text-[9px] font-bold text-obsidian"
              data-testid="player-queue-count"
            >
              {queue.length}
            </span>
          )}
        </button>
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
        <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
      </div>
    </div>
  );
}
