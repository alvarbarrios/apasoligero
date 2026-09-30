import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Music2, Quote, FileAudio, LayoutGrid, CornerDownLeft, Play } from "lucide-react";
import { search, TYPE_LABEL, TYPE_ORDER } from "@/data/searchIndex";
import { usePlayer } from "@/context/PlayerContext";
import { STATS } from "@/data/archive";

const ICON = { cancion: Music2, lema: Quote, audio: FileAudio, pagina: LayoutGrid };

export default function SearchDialog({ open, onClose }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { play } = usePlayer();

  const results = useMemo(() => search(q), [q]);
  const grouped = useMemo(
    () => TYPE_ORDER.map((t) => ({ type: t, items: results.filter((r) => r.type === t) })).filter((g) => g.items.length),
    [results]
  );
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
      window.__lenis?.stop();
    } else window.__lenis?.start();
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (it) => {
    onClose();
    if (it.type === "audio") play({ file: it.file, title: it.title, sub: it.sub });
    else navigate(it.to);
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      choose(flat[active]);
    } else if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-obsidian/80 px-4 pt-[10vh] backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          data-testid="search-overlay"
        >
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Búsqueda global"
            className="relative w-full max-w-2xl border border-brass/50 bg-olive-950 shadow-2xl"
            data-testid="search-dialog"
          >
            <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-brass" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brass" />
            <div className="flex items-center gap-3 border-b border-olive-600/70 px-4 py-3">
              <Search size={16} className="shrink-0 text-brass" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder={`Buscar entre ${STATS.canciones} canciones, ${STATS.lemas} lemas y ${STATS.audios} audios…`}
                className="min-w-0 flex-1 bg-transparent font-mono text-sm tracking-wide text-parchment placeholder:text-khaki/70 focus:outline-none"
                data-testid="search-input"
              />
              <button onClick={onClose} aria-label="Cerrar búsqueda" className="text-sage hover:text-brass" data-testid="search-close">
                <X size={16} />
              </button>
            </div>
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto" data-testid="search-results">
              {q.trim().length < 2 && (
                <p className="px-5 py-8 font-mono text-[10px] uppercase tracking-[0.25em] text-khaki" data-testid="search-hint">
                  Escriba un título, un verso, un lema o una unidad. <span className="text-brass">↑↓</span> para moverse · <span className="text-brass">↵</span> para abrir
                </p>
              )}
              {q.trim().length >= 2 && flat.length === 0 && (
                <p className="px-5 py-8 font-mono text-[10px] uppercase tracking-[0.25em] text-khaki" data-testid="search-empty">
                  Sin resultados para «{q}»
                </p>
              )}
              {grouped.map((g) => {
                const Icon = ICON[g.type];
                return (
                  <div key={g.type} data-testid={`search-group-${g.type}`}>
                    <p className="sticky top-0 border-b border-olive-600/50 bg-olive-950 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-khaki">
                      {TYPE_LABEL[g.type]} · {g.items.length}
                    </p>
                    {g.items.map((it) => {
                      const idx = flat.indexOf(it);
                      const isActive = idx === active;
                      return (
                        <button
                          key={it.id}
                          data-idx={idx}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => choose(it)}
                          data-testid={`search-result-${idx}`}
                          className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                            isActive ? "bg-brass/10" : "hover:bg-olive-900/60"
                          }`}
                        >
                          <Icon size={14} className={isActive ? "text-brass" : "text-khaki"} />
                          <span className="min-w-0 flex-1">
                            <span className={`block truncate font-display text-base font-bold uppercase tracking-wide ${isActive ? "text-brass" : "text-parchment"}`}>
                              {it.title}
                            </span>
                            <span className="block truncate font-mono text-[9px] uppercase tracking-[0.2em] text-khaki">{it.sub}</span>
                          </span>
                          {isActive && (it.type === "audio" ? <Play size={12} className="text-brass" /> : <CornerDownLeft size={12} className="text-brass" />)}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {flat.length > 0 && (
              <p className="border-t border-olive-600/50 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.25em] text-khaki" data-testid="search-count">
                {flat.length} resultados · los audios se reproducen al instante
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
