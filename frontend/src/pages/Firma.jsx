import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2, PenLine } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import GuestbookEntry from "@/components/GuestbookEntry";
import ShareButtons from "@/components/ShareButtons";
import NotFound from "@/pages/NotFound";
import useTitle from "@/hooks/useTitle";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Firma() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [state, setState] = useState("loading");
  useTitle(entry ? `Firma de ${entry.nombre}` : "Firma");

  useEffect(() => {
    setState("loading");
    axios
      .get(`${API}/api/guestbook/${id}`)
      .then(({ data }) => {
        setEntry(data);
        setState("ok");
      })
      .catch(() => setState("missing"));
  }, [id]);

  if (state === "missing") return <NotFound />;
  const url = `${window.location.origin}/libro-de-visitas/firma/${id}`;
  const text = entry ? `«${entry.mensaje.slice(0, 120)}${entry.mensaje.length > 120 ? "…" : ""}» — ${entry.nombre}, en el Libro de Visitas de A Paso Ligero` : "";

  return (
    <div data-testid="firma-page">
      <PageHeader
        eyebrow="Libro de Visitas // Firma compartida"
        title={entry ? entry.nombre : "Firma"}
        crumbs={[{ to: "/", label: "Inicio" }, { to: "/libro-de-visitas", label: "Libro de Visitas" }, { label: "Firma" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {state === "loading" && (
          <p className="flex items-center gap-2 py-12 font-mono text-xs uppercase tracking-widest text-khaki" data-testid="firma-loading">
            <Loader2 size={14} className="animate-spin" /> Cargando firma…
          </p>
        )}
        {entry && (
          <Reveal>
            <GuestbookEntry entry={entry} index={null} />
            <div className="mt-8 border border-olive-600/70 bg-olive-950 p-6" data-testid="firma-share-card">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Compartir esta firma con la compañía</p>
              <ShareButtons url={url} text={text} idPrefix="firma-share" />
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-olive-600/60 pt-6">
              <Link to="/libro-de-visitas" className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-sage hover:text-brass" data-testid="firma-back">
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Ver todas las firmas
              </Link>
              <Link to="/libro-de-visitas" className="flex items-center gap-2 bg-brass px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-obsidian hover:bg-parchment" data-testid="firma-sign-cta">
                <PenLine size={13} /> Dejar mi firma
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
