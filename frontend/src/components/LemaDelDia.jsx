import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Shuffle, ArrowRight, Languages, Share2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import LemaShareDialog from "@/components/LemaShareDialog";
import data, { LEMAS_META } from "@/data/archive";

const ALL = data.lemasGroups.flatMap((g) => g.entries.map((e) => ({ ...e, group: g.slug })));

const dayIndex = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000) + now.getFullYear() * 366;
};

const fmtDay = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function LemaDelDia() {
  const base = useMemo(() => dayIndex() % ALL.length, []);
  const [offset, setOffset] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const lema = ALL[(base + offset) % ALL.length];
  const meta = LEMAS_META[lema.group] || {};

  return (
    <section className="border-y border-olive-600/60 bg-olive-950" data-testid="lema-del-dia">
      <LemaShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        lema={{ motto: lema.motto, translation: lema.translation, unit: lema.unit, groupShort: meta.short, emblem: meta.emblem, dateLabel: fmtDay }}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-3">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass" data-testid="lema-eyebrow">Lema del día</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki" data-testid="lema-fecha">{fmtDay}</p>
          <p className="mt-6 text-sm leading-relaxed text-sage">
            Cada día, un lema distinto de los {ALL.length} que guardan las unidades de los Ejércitos de España.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setOffset((o) => o + 1)}
              data-testid="lema-otro"
              className="flex items-center gap-2 border border-olive-500 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-sage transition-colors hover:border-brass hover:text-brass"
            >
              <Shuffle size={12} /> Otro lema
            </button>
            <button
              onClick={() => setShareOpen(true)}
              data-testid="lema-compartir"
              className="flex items-center gap-2 border border-olive-500 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-sage transition-colors hover:border-brass hover:text-brass"
            >
              <Share2 size={12} /> Compartir
            </button>
            <Link
              to="/lemas"
              data-testid="lema-ver-todos"
              className="group flex items-center gap-2 border border-brass/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brass transition-colors hover:bg-brass hover:text-obsidian"
            >
              Todos los lemas <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="relative lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={`${lema.group}-${lema.motto}`}
              initial={{ opacity: 0, y: 18, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative border border-olive-600/70 bg-olive-900/40 p-8 sm:p-12"
              data-testid="lema-card"
            >
              <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-brass" />
              <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-brass" />
              <Quote size={28} className="text-brass/70" />
              <p className="mt-5 font-serified text-2xl italic leading-snug text-parchment sm:text-4xl lg:text-5xl" data-testid="lema-motto">
                {lema.motto}
              </p>
              {lema.translation && (
                <p className="mt-4 flex items-start gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brass sm:text-sm" data-testid="lema-translation">
                  <Languages size={14} className="mt-0.5 shrink-0" /> {lema.translation}
                </p>
              )}
              <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-olive-600/60 pt-5">
                <div className="flex items-center gap-4">
                  {meta.emblem && (
                    <img src={meta.emblem} alt="" className="h-12 w-12 border border-olive-600 bg-olive-900 object-contain p-1" data-testid="lema-emblem" />
                  )}
                  <div>
                    <p className="font-display text-lg font-bold uppercase leading-tight tracking-wide text-parchment" data-testid="lema-unit">{lema.unit}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">{meta.short || lema.group}</p>
                  </div>
                </div>
                <Link
                  to={`/lemas/${lema.group.replace(/^l/, "")}`}
                  data-testid="lema-group-link"
                  className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-sage transition-colors hover:text-brass"
                >
                  Lemas · {meta.code || ""} <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
