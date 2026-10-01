import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Loader2, Pencil, Trash2, FileAudio, ExternalLink, Music2 } from "lucide-react";
import { authHeaders } from "@/context/AuthContext";
import { useArchive } from "@/context/ArchiveContext";
import SongForm from "@/components/SongForm";
import { HIMNOS_META } from "@/data/archive";

const API = process.env.REACT_APP_BACKEND_URL;
const SECTION_LABEL = { pasoligero: "Paso Ligero", otras: "Otras Canciones", himnos: "Himnos" };
const songUrl = (s) => (s.section === "himnos" ? `/canciones/himnos/${s.group}/${s.slug}` : s.section === "pasoligero" ? `/canciones/paso-ligero/${s.slug}` : `/canciones/otras/${s.slug}`);

export default function SongsAdmin() {
  const { refresh } = useArchive();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admin/songs`, { headers: authHeaders() });
      setSongs(data);
    } catch {
      toast.error("No se pudieron cargar las canciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saved = () => {
    setEditing(null);
    load();
    refresh();
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/songs/${id}`, { headers: authHeaders() });
      toast.success("Canción retirada del archivo.");
      setConfirm(null);
      saved();
    } catch {
      toast.error("No se pudo eliminar.");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12" data-testid="songs-admin">
      <div className="lg:col-span-6">
        <SongForm key={editing?.id || "new"} editing={editing} onSaved={saved} onCancel={() => setEditing(null)} />
      </div>
      <div className="lg:col-span-6">
        <div className="flex items-end justify-between border-b border-olive-600/70 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Añadidas desde el panel</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-parchment">Canciones</h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-khaki" data-testid="songs-admin-count">{songs.length} registros</p>
        </div>
        <div className="mt-4 divide-y divide-olive-600/50 border border-olive-600/70" data-testid="songs-admin-list">
          {loading && <p className="flex items-center gap-2 px-5 py-10 font-mono text-xs uppercase tracking-widest text-khaki"><Loader2 size={14} className="animate-spin" /> Cargando…</p>}
          {!loading && songs.length === 0 && (
            <div className="px-5 py-12 text-center" data-testid="songs-admin-empty">
              <Music2 size={22} className="mx-auto text-brass" />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">Todavía no ha añadido canciones desde el panel.</p>
            </div>
          )}
          {!loading &&
            songs.map((s) => (
              <div key={s.id} className="flex items-start gap-4 bg-olive-950/70 px-5 py-4" data-testid={`songs-admin-item-${s.id}`}>
                <div className="min-w-0 flex-1">
                  <Link to={songUrl(s)} className="group flex items-center gap-2 font-display text-lg font-extrabold uppercase tracking-tight text-parchment hover:text-brass" data-testid="songs-admin-item-link">
                    <span className="truncate">{s.title}</span> <ExternalLink size={11} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <p className="mt-1 flex flex-wrap gap-x-3 font-mono text-[10px] uppercase tracking-[0.15em] text-khaki">
                    <span>{SECTION_LABEL[s.section]}{s.group ? ` · ${HIMNOS_META[s.group]?.short || s.group}` : ""}</span>
                    <span>{s.stanzas.length} estrofas</span>
                    <span>Reg. {s.date}</span>
                    {s.audio ? <span className="flex items-center gap-1 text-brass"><FileAudio size={10} /> {s.audio_name}</span> : <span>Sin audio</span>}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setEditing(s)} aria-label="Editar" data-testid={`songs-admin-edit-${s.id}`} className="flex h-8 w-8 items-center justify-center border border-olive-600 text-sage transition-colors hover:border-brass hover:text-brass"><Pencil size={12} /></button>
                  {confirm === s.id ? (
                    <span className="flex gap-1">
                      <button onClick={() => remove(s.id)} data-testid={`songs-admin-delete-confirm-${s.id}`} className="h-8 bg-signal px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-parchment">Sí, borrar</button>
                      <button onClick={() => setConfirm(null)} data-testid={`songs-admin-delete-cancel-${s.id}`} className="h-8 border border-olive-600 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-sage">No</button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirm(s.id)} aria-label="Eliminar" data-testid={`songs-admin-delete-${s.id}`} className="flex h-8 w-8 items-center justify-center border border-olive-600 text-khaki transition-colors hover:border-signal hover:text-signal"><Trash2 size={12} /></button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
