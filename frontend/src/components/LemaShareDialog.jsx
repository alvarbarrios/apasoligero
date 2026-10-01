import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, MessageCircle, Loader2, Square, RectangleHorizontal } from "lucide-react";
import { toast } from "sonner";
import { renderLemaCard } from "@/lib/lemaCard";

const XIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.9l-5.4-7.06L3.9 22H.64l8.02-9.17L.5 2h7.06l4.88 6.45L18.24 2Zm-1.21 18h1.8L7.05 3.9H5.12L17.03 20Z" />
  </svg>
);

const btn =
  "flex items-center gap-2 border border-olive-600 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage transition-colors hover:border-brass hover:text-brass disabled:opacity-40";

export default function LemaShareDialog({ open, onClose, lema }) {
  const [format, setFormat] = useState("square");
  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!open || !lema) return;
    let revoke;
    setBlob(null);
    renderLemaCard({ ...lema, format }).then((b) => {
      setBlob(b);
      revoke = URL.createObjectURL(b);
      setUrl(revoke);
    });
    return () => revoke && URL.revokeObjectURL(revoke);
  }, [open, lema, format]);

  if (!lema) return null;
  const fileName = `lema-del-dia-${lema.unit.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}.png`;
  const text = `«${lema.motto}»${lema.translation ? ` — ${lema.translation}` : ""} · ${lema.unit}. Lema del día en A Paso Ligero`;
  const siteUrl = `${window.location.origin}/lemas`;
  const enc = encodeURIComponent;

  const share = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Lema del día — A Paso Ligero", text });
      } catch {
        /* cancelled */
      }
    } else {
      toast.message("Su navegador no comparte imágenes directamente: descárguela y adjúntela en WhatsApp o X.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          data-testid="lema-share-overlay"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            role="dialog"
            aria-modal="true"
            aria-label="Compartir lema del día"
            className="relative w-full max-w-2xl border border-brass/50 bg-olive-950 p-5 sm:p-6"
            data-testid="lema-share-dialog"
          >
            <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-brass" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brass" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Compartir lema del día</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight text-parchment">Tarjeta lista para enviar</h3>
              </div>
              <button onClick={onClose} aria-label="Cerrar" data-testid="lema-share-close" className="text-sage hover:text-brass"><X size={16} /></button>
            </div>

            <div className="mt-4 flex gap-2" data-testid="lema-share-formats">
              <button onClick={() => setFormat("square")} data-testid="lema-share-format-square" className={`${btn} ${format === "square" ? "border-brass bg-brass/10 text-brass" : ""}`}><Square size={12} /> Cuadrada · WhatsApp</button>
              <button onClick={() => setFormat("wide")} data-testid="lema-share-format-wide" className={`${btn} ${format === "wide" ? "border-brass bg-brass/10 text-brass" : ""}`}><RectangleHorizontal size={12} /> Apaisada · X</button>
            </div>

            <div className={`mt-4 flex items-center justify-center border border-olive-600/70 bg-obsidian ${format === "wide" ? "aspect-[16/9]" : "aspect-square max-h-[48vh]"} mx-auto overflow-hidden`}>
              {url ? (
                <img src={url} alt="Tarjeta del lema del día" className="h-full w-full object-contain" data-testid="lema-share-preview" />
              ) : (
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-khaki"><Loader2 size={14} className="animate-spin" /> Generando tarjeta…</p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2" data-testid="lema-share-actions">
              <a href={url || "#"} download={fileName} className={`${btn} ${!url ? "pointer-events-none opacity-40" : ""}`} data-testid="lema-share-download"><Download size={12} /> Descargar PNG</a>
              <button onClick={share} disabled={!blob} className={btn} data-testid="lema-share-native"><Share2 size={12} /> Compartir imagen</button>
              <a href={`https://wa.me/?text=${enc(`${text} ${siteUrl}`)}`} target="_blank" rel="noopener noreferrer" className={btn} data-testid="lema-share-whatsapp"><MessageCircle size={12} /> WhatsApp</a>
              <a href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(siteUrl)}`} target="_blank" rel="noopener noreferrer" className={btn} data-testid="lema-share-x"><XIcon size={11} /> X</a>
            </div>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.15em] text-khaki">
              En móvil, «Compartir imagen» abre WhatsApp, X u otras apps con la tarjeta adjunta. En escritorio, descargue el PNG y adjúntelo.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
