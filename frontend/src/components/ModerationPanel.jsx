import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2, Loader2, Mail, MapPin, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth, authHeaders } from "@/context/AuthContext";

const API = process.env.REACT_APP_BACKEND_URL;
const FILTERS = [
  ["all", "Todas"],
  ["visible", "Visibles"],
  ["hidden", "Ocultas"],
];
const fmt = (iso) => new Date(iso).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });

export default function ModerationPanel() {
  const { logout } = useAuth();
  const [filter, setFilter] = useState("all");
  const [res, setRes] = useState({ items: [], total: 0, hidden: 0 });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admin/guestbook`, { params: { filter, size: 100 }, headers: authHeaders() });
      setRes(data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      else toast.error("No se pudieron cargar las firmas.");
    } finally {
      setLoading(false);
    }
  }, [filter, logout]);

  useEffect(() => {
    load();
  }, [load]);

  const setHidden = async (id, hidden) => {
    try {
      await axios.patch(`${API}/api/admin/guestbook/${id}`, { hidden }, { headers: authHeaders() });
      toast.success(hidden ? "Firma ocultada." : "Firma visible de nuevo.");
      load();
    } catch {
      toast.error("No se pudo actualizar la firma.");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/guestbook/${id}`, { headers: authHeaders() });
      toast.success("Firma eliminada definitivamente.");
      setConfirm(null);
      load();
    } catch {
      toast.error("No se pudo eliminar la firma.");
    }
  };

  return (
    <div data-testid="moderation-panel">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-olive-600/70 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Firmas recibidas</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-parchment">Moderación del Libro</h2>
        </div>
        <Link to="/libro-de-visitas" className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sage hover:text-brass" data-testid="admin-view-public">
          Ver libro público <ExternalLink size={11} />
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2" data-testid="admin-filters">
          {FILTERS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              data-testid={`admin-filter-${k}`}
              className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                filter === k ? "border-brass bg-brass/10 text-brass" : "border-olive-600 text-sage hover:border-olive-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-khaki" data-testid="admin-count">
          {res.total} en lista · {res.hidden} ocultas
        </p>
      </div>

      <div className="mt-6 divide-y divide-olive-600/50 border border-olive-600/70" data-testid="admin-entries">
        {loading && (
          <p className="flex items-center gap-2 px-6 py-12 font-mono text-xs uppercase tracking-widest text-khaki">
            <Loader2 size={14} className="animate-spin" /> Cargando…
          </p>
        )}
        {!loading && res.items.length === 0 && (
          <p className="px-6 py-12 text-center font-mono text-xs uppercase tracking-widest text-khaki" data-testid="admin-empty">Sin firmas en este filtro.</p>
        )}
        {!loading &&
          res.items.map((e) => (
            <div key={e.id} className={`grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-12 ${e.hidden ? "bg-olive-950/40 opacity-70" : "bg-olive-950/70"}`} data-testid={`admin-entry-${e.id}`}>
              <div className="lg:col-span-3">
                <p className="font-display text-lg font-extrabold uppercase tracking-tight text-parchment">{e.nombre}</p>
                <p className="mt-1 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-khaki">
                  {e.lugar && <span className="flex items-center gap-1"><MapPin size={10} /> {e.lugar}</span>}
                  {e.uco && <span className="flex items-center gap-1"><Shield size={10} /> {e.uco}</span>}
                </p>
                {e.email && (
                  <a href={`mailto:${e.email}`} className="mt-1 flex items-center gap-1 font-mono text-[10px] text-brass hover:underline" data-testid="admin-entry-email">
                    <Mail size={10} /> {e.email}
                  </a>
                )}
                <p className="mt-1 font-mono text-[10px] text-khaki">{fmt(e.created_at)}</p>
              </div>
              <p className="whitespace-pre-line font-serified text-sm leading-relaxed text-sage lg:col-span-6">{e.mensaje}</p>
              <div className="flex items-start gap-2 lg:col-span-3 lg:justify-end">
                {e.hidden && <span className="border border-signal/50 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-signal" data-testid="admin-hidden-badge">Oculta</span>}
                <button
                  onClick={() => setHidden(e.id, !e.hidden)}
                  data-testid={`admin-toggle-${e.id}`}
                  className="flex h-8 items-center gap-1 border border-olive-600 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-sage transition-colors hover:border-brass hover:text-brass"
                >
                  {e.hidden ? <Eye size={12} /> : <EyeOff size={12} />} {e.hidden ? "Mostrar" : "Ocultar"}
                </button>
                {confirm === e.id ? (
                  <span className="flex gap-1">
                    <button onClick={() => remove(e.id)} data-testid={`admin-delete-confirm-${e.id}`} className="h-8 bg-signal px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-parchment">Sí, borrar</button>
                    <button onClick={() => setConfirm(null)} data-testid={`admin-delete-cancel-${e.id}`} className="h-8 border border-olive-600 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-sage">No</button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirm(e.id)}
                    aria-label="Eliminar firma"
                    data-testid={`admin-delete-${e.id}`}
                    className="flex h-8 w-8 items-center justify-center border border-olive-600 text-khaki transition-colors hover:border-signal hover:text-signal"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
