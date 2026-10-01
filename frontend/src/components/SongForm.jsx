import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Music2, Upload, Loader2, FileAudio, X, Save } from "lucide-react";
import { authHeaders } from "@/context/AuthContext";
import { uploadAudio } from "@/lib/uploadAudio";
import { HIMNOS_META } from "@/data/archive";

const API = process.env.REACT_APP_BACKEND_URL;
const EMPTY = { title: "", section: "otras", group: "tierra", lyrics: "", notes: "" };
const inputCls =
  "w-full border border-olive-600 bg-olive-900 px-3 py-2.5 text-sm text-parchment placeholder:text-khaki/60 focus:border-brass focus:outline-none";
const labelCls = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-khaki";

export default function SongForm({ editing, onSaved, onCancel }) {
  const [form, setForm] = useState(
    editing
      ? { title: editing.title, section: editing.section, group: editing.group || "tierra", lyrics: editing.stanzas.map((s) => s.join("\n")).join("\n\n"), notes: editing.notes.join("\n") }
      : EMPTY
  );
  const [audio, setAudio] = useState(editing?.file_id ? { file_id: editing.file_id, filename: editing.audio_name } : null);
  const [progress, setProgress] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) return toast.error("El audio supera los 25 MB.");
    setProgress(0);
    try {
      const res = await uploadAudio(f, setProgress);
      setAudio(res);
      toast.success(`Audio subido: ${res.filename}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "No se pudo subir el audio.");
      setAudio(null);
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 2) return toast.error("Indique el título.");
    if (form.lyrics.trim().length < 5) return toast.error("Pegue la letra.");
    setSaving(true);
    const payload = { ...form, group: form.section === "himnos" ? form.group : null, file_id: audio?.file_id ?? null };
    try {
      if (editing) await axios.put(`${API}/api/admin/songs/${editing.id}`, payload, { headers: authHeaders() });
      else await axios.post(`${API}/api/admin/songs`, payload, { headers: authHeaders() });
      toast.success(editing ? "Canción actualizada." : "Canción publicada en el archivo.");
      setForm(EMPTY);
      setAudio(null);
      onSaved?.();
    } catch (err) {
      const d = err.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "No se pudo guardar la canción.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="relative border border-olive-600/70 bg-olive-950 p-6 sm:p-8" data-testid="song-form">
      <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-brass" />
      <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brass" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">{editing ? "Editar registro" : "Nuevo registro"}</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-tight text-parchment">{editing ? editing.title : "Añadir canción"}</h2>
        </div>
        {editing && (
          <button type="button" onClick={onCancel} aria-label="Cancelar edición" data-testid="song-form-cancel" className="text-sage hover:text-signal"><X size={16} /></button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="sf-title">Título *</label>
          <input id="sf-title" value={form.title} onChange={set("title")} className={inputCls} required maxLength={150} data-testid="song-title-input" />
        </div>
        <div>
          <label className={labelCls} htmlFor="sf-section">Sección *</label>
          <select id="sf-section" value={form.section} onChange={set("section")} className={inputCls} data-testid="song-section-select">
            <option value="pasoligero">Canciones de Paso Ligero</option>
            <option value="otras">Otras Canciones y Miscelánea</option>
            <option value="himnos">Himnos</option>
          </select>
        </div>
        {form.section === "himnos" && (
          <div>
            <label className={labelCls} htmlFor="sf-group">Grupo de himnos *</label>
            <select id="sf-group" value={form.group} onChange={set("group")} className={inputCls} data-testid="song-group-select">
              {Object.entries(HIMNOS_META).map(([k, m]) => <option key={k} value={k}>{m.short}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="mt-4">
        <label className={labelCls} htmlFor="sf-lyrics">Letra * <span className="normal-case tracking-normal text-khaki/70">— separe las estrofas con una línea en blanco</span></label>
        <textarea id="sf-lyrics" rows={12} value={form.lyrics} onChange={set("lyrics")} className={`${inputCls} font-serified italic`} required data-testid="song-lyrics-input" />
      </div>
      <div className="mt-4">
        <label className={labelCls} htmlFor="sf-notes">Notas del archivo <span className="normal-case tracking-normal text-khaki/70">— una por línea</span></label>
        <textarea id="sf-notes" rows={2} value={form.notes} onChange={set("notes")} className={inputCls} data-testid="song-notes-input" />
      </div>

      <div className="mt-4">
        <span className={labelCls}>Audio (MP3, M4A, OGG, WAV · máx. 25 MB)</span>
        <input ref={fileRef} type="file" accept=".mp3,.m4a,.ogg,.wav,audio/*" onChange={pick} className="hidden" id="sf-audio" data-testid="song-audio-input" />
        {audio ? (
          <div className="flex items-center justify-between gap-3 border border-brass/50 bg-brass/5 px-3 py-2.5" data-testid="song-audio-selected">
            <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-brass"><FileAudio size={14} className="shrink-0" /> <span className="truncate">{audio.filename}</span></span>
            <button type="button" onClick={() => setAudio(null)} aria-label="Quitar audio" data-testid="song-audio-remove" className="text-khaki hover:text-signal"><X size={14} /></button>
          </div>
        ) : progress !== null ? (
          <div className="border border-olive-600 px-3 py-2.5" data-testid="song-audio-progress">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brass"><Loader2 size={12} className="animate-spin" /> Subiendo… {progress}%</p>
            <div className="mt-2 h-1 bg-olive-900"><div className="h-full bg-brass transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        ) : (
          <label htmlFor="sf-audio" className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-olive-500 px-3 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sage transition-colors hover:border-brass hover:text-brass" data-testid="song-audio-dropzone">
            <Upload size={14} /> Elegir archivo de audio
          </label>
        )}
      </div>

      <button type="submit" disabled={saving || progress !== null} data-testid="song-form-submit" className="mt-6 flex w-full items-center justify-center gap-2 bg-brass px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-obsidian transition-colors hover:bg-parchment disabled:opacity-60">
        {saving ? <Loader2 size={14} className="animate-spin" /> : editing ? <Save size={14} /> : <Music2 size={14} />}
        {saving ? "Guardando…" : editing ? "Guardar cambios" : "Publicar canción"}
      </button>
    </form>
  );
}
