import { useState } from "react";
import { Link2, Check, MessageCircle, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";

const XIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.9l-5.4-7.06L3.9 22H.64l8.02-9.17L.5 2h7.06l4.88 6.45L18.24 2Zm-1.21 18h1.8L7.05 3.9H5.12L17.03 20Z" />
  </svg>
);

export default function ShareButtons({ url, text, compact = false, idPrefix = "share" }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Enlace copiado.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace.");
    }
  };

  const native = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "A Paso Ligero — Libro de Visitas", text, url });
      } catch {
        /* cancelled */
      }
    } else copy();
  };

  const btn = compact
    ? "flex h-7 w-7 items-center justify-center border border-olive-600 text-khaki transition-colors hover:border-brass hover:text-brass"
    : "flex items-center gap-2 border border-olive-600 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage transition-colors hover:border-brass hover:text-brass";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "" : "mt-6"}`} data-testid={`${idPrefix}-buttons`}>
      <button onClick={copy} className={btn} aria-label="Copiar enlace" title="Copiar enlace" data-testid={`${idPrefix}-copy`}>
        {copied ? <Check size={12} /> : <Link2 size={12} />} {!compact && (copied ? "Copiado" : "Copiar enlace")}
      </button>
      <a href={`https://wa.me/?text=${enc(`${text} ${url}`)}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="WhatsApp" title="WhatsApp" data-testid={`${idPrefix}-whatsapp`}>
        <MessageCircle size={12} /> {!compact && "WhatsApp"}
      </a>
      <a href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="X" title="X" data-testid={`${idPrefix}-x`}>
        <XIcon size={11} /> {!compact && "X"}
      </a>
      <a href={`mailto:?subject=${enc("Firma en el Libro de Visitas de A Paso Ligero")}&body=${enc(`${text}\n\n${url}`)}`} className={btn} aria-label="Correo" title="Correo" data-testid={`${idPrefix}-mail`}>
        <Mail size={12} /> {!compact && "Correo"}
      </a>
      {compact && (
        <button onClick={native} className={btn} aria-label="Compartir" title="Compartir" data-testid={`${idPrefix}-native`}>
          <Share2 size={12} />
        </button>
      )}
    </div>
  );
}
