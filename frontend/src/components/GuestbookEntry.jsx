import { motion } from "framer-motion";
import { MapPin, Shield } from "lucide-react";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "").toUpperCase();

export default function GuestbookEntry({ entry, index, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border border-olive-600/60 bg-olive-950/70 p-5 transition-colors hover:border-brass/50 sm:p-6"
      data-testid={`guestbook-entry-${entry.id}`}
    >
      <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] tracking-widest text-khaki">#{String(index).padStart(3, "0")}</span>
          <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-parchment" data-testid="entry-nombre">
            {entry.nombre}
          </h3>
        </div>
        <time className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass" data-testid="entry-date">
          {fmtDate(entry.created_at)}
        </time>
      </div>
      {(entry.lugar || entry.uco) && (
        <p className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">
          {entry.lugar && (
            <span className="flex items-center gap-1" data-testid="entry-lugar">
              <MapPin size={10} /> {entry.lugar}
            </span>
          )}
          {entry.uco && (
            <span className="flex items-center gap-1" data-testid="entry-uco">
              <Shield size={10} /> {entry.uco}
            </span>
          )}
        </p>
      )}
      <p className="mt-4 whitespace-pre-line font-serified text-base leading-relaxed text-sage" data-testid="entry-mensaje">
        {entry.mensaje}
      </p>
    </motion.article>
  );
}
