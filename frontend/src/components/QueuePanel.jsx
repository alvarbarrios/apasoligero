import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Trash2, ListMusic } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

export default function QueuePanel({ open, onClose }) {
  const { queue, playFromQueue, removeFromQueue, clearQueue } = usePlayer();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-full right-0 mb-2 w-[min(28rem,calc(100vw-2rem))] border border-brass/40 bg-olive-950/95 backdrop-blur-md shadow-2xl"
          data-testid="queue-panel"
        >
          <div className="flex items-center justify-between border-b border-olive-600/70 px-4 py-3">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
              <ListMusic size={12} /> Cola de reproducción · {queue.length}
            </p>
            <div className="flex items-center gap-3">
              {queue.length > 0 && (
                <button
                  onClick={clearQueue}
                  data-testid="queue-clear-button"
                  className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki transition-colors hover:text-signal"
                >
                  <Trash2 size={11} /> Vaciar
                </button>
              )}
              <button onClick={onClose} aria-label="Cerrar cola" data-testid="queue-close-button" className="text-sage hover:text-brass">
                <X size={14} />
              </button>
            </div>
          </div>
          <ul className="max-h-72 overflow-y-auto" data-testid="queue-list">
            {queue.length === 0 && (
              <li className="px-4 py-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-khaki" data-testid="queue-empty">
                Cola vacía — añada audios con el botón «+»
              </li>
            )}
            {queue.map((t, i) => (
              <li key={t.file} className="group flex items-center gap-3 border-b border-olive-600/40 px-4 py-2.5 last:border-0 hover:bg-olive-900/60" data-testid={`queue-item-${i}`}>
                <span className="w-5 font-mono text-[10px] text-khaki">{String(i + 1).padStart(2, "0")}</span>
                <button
                  onClick={() => playFromQueue(t.file)}
                  aria-label={`Reproducir ${t.title}`}
                  data-testid={`queue-play-${i}`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center border border-olive-500 text-brass transition-colors hover:border-brass hover:bg-brass hover:text-obsidian"
                >
                  <Play size={11} className="ml-0.5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold uppercase tracking-wide text-parchment">{t.title}</p>
                  {t.sub && <p className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-khaki">{t.sub}</p>}
                </div>
                <button
                  onClick={() => removeFromQueue(t.file)}
                  aria-label={`Quitar ${t.title} de la cola`}
                  data-testid={`queue-remove-${i}`}
                  className="text-khaki opacity-0 transition-all hover:text-signal group-hover:opacity-100 focus:opacity-100"
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
