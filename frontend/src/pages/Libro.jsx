import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ExternalLink, PenLine, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import GuestbookForm from "@/components/GuestbookForm";
import GuestbookEntry from "@/components/GuestbookEntry";
import useTitle from "@/hooks/useTitle";
import data from "@/data/archive";

const API = process.env.REACT_APP_BACKEND_URL;
const SIZE = 10;

export default function Libro() {
  useTitle("Libro de Visitas");
  const [page, setPage] = useState(1);
  const [res, setRes] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p) => {
    setLoading(true);
    try {
      const { data: d } = await axios.get(`${API}/api/guestbook`, { params: { page: p, size: SIZE } });
      setRes(d);
    } catch {
      toast.error("No se pudo cargar el libro de visitas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const pages = Math.max(1, Math.ceil(res.total / SIZE));

  return (
    <div data-testid="libro-page">
      <PageHeader
        eyebrow="GuestBook de A Paso Ligero .com"
        title="Libro de Visitas"
        intro={[
          "He dado pie a este pequeño apartado para que puedan dejar su huella en este lugar, especialmente si han disfrutado con su contenido.",
          "Para mí sirve de gran aliciente el saber que hay gente para la que es útil todo el esfuerzo que dedico a mantener esta web; y otros con tanta afición en los temas castrenses como yo.",
          "¡Dejen su firma!",
        ]}
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Libro de Visitas" }]}
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <GuestbookForm onSigned={() => { setPage(1); load(1); }} />
            <div className="mt-6 border border-olive-600/70 bg-olive-950 p-5" data-testid="guestbook-legacy">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">Libro histórico (2003 → )</p>
              <a
                href={data.meta.guestbookUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="guestbook-external-link"
                className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-brass hover:underline"
              >
                Consultar las firmas antiguas <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <div className="flex items-end justify-between border-b border-olive-600/70 pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Registro de visitantes</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-parchment">Firmas</h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-khaki" data-testid="guestbook-count">
              {res.total} {res.total === 1 ? "firma" : "firmas"}
            </p>
          </div>

          <div className="mt-6 space-y-4" data-testid="guestbook-entries">
            {loading && (
              <p className="flex items-center gap-2 py-12 font-mono text-xs uppercase tracking-widest text-khaki" data-testid="guestbook-loading">
                <Loader2 size={14} className="animate-spin" /> Cargando firmas…
              </p>
            )}
            {!loading && res.items.length === 0 && (
              <div className="border border-dashed border-olive-600 px-6 py-14 text-center" data-testid="guestbook-empty">
                <PenLine size={24} className="mx-auto text-brass" />
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-khaki">Aún no hay firmas. ¡Sea el primero!</p>
              </div>
            )}
            {!loading &&
              res.items.map((e, i) => (
                <GuestbookEntry key={e.id} entry={e} index={res.total - (page - 1) * SIZE - i} delay={i * 0.04} />
              ))}
          </div>

          {pages > 1 && (
            <div className="mt-8 flex items-center justify-between" data-testid="guestbook-pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                data-testid="guestbook-prev"
                className="flex items-center gap-1 border border-olive-600 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage transition-colors enabled:hover:border-brass enabled:hover:text-brass disabled:opacity-30"
              >
                <ChevronLeft size={12} /> Anteriores
              </button>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-khaki" data-testid="guestbook-page">
                Página {page} / {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                data-testid="guestbook-next"
                className="flex items-center gap-1 border border-olive-600 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage transition-colors enabled:hover:border-brass enabled:hover:text-brass disabled:opacity-30"
              >
                Siguientes <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
