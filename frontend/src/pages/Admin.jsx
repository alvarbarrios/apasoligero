import { useState } from "react";
import { Loader2, LogOut, BookOpen, Music2 } from "lucide-react";
import useTitle from "@/hooks/useTitle";
import { useAuth } from "@/context/AuthContext";
import AdminLogin from "@/components/AdminLogin";
import ModerationPanel from "@/components/ModerationPanel";
import SongsAdmin from "@/components/SongsAdmin";

const TABS = [
  ["songs", "Canciones", Music2],
  ["libro", "Libro de Visitas", BookOpen],
];

export default function Admin() {
  useTitle("Acceso del autor");
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("songs");

  return (
    <div data-testid="admin-page">
      {user === null && (
        <p className="flex items-center justify-center gap-2 py-24 font-mono text-xs uppercase tracking-widest text-khaki" data-testid="admin-checking">
          <Loader2 size={14} className="animate-spin" /> Comprobando acceso…
        </p>
      )}
      {user === false && <AdminLogin />}
      {user && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-olive-600/70 pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Puesto de mando · {user.email}</p>
              <h1 className="mt-1 font-display text-4xl font-extrabold uppercase tracking-tight text-parchment">Panel del autor</h1>
            </div>
            <button onClick={logout} data-testid="admin-logout" className="flex items-center gap-2 border border-olive-600 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage transition-colors hover:border-signal hover:text-signal">
              <LogOut size={12} /> Salir
            </button>
          </div>
          <div className="mt-6 flex gap-2" data-testid="admin-tabs">
            {TABS.map(([k, label, Icon]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                data-testid={`admin-tab-${k}`}
                className={`flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  tab === k ? "border-brass bg-brass/10 text-brass" : "border-olive-600 text-sage hover:border-olive-500"
                }`}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
          <div className="mt-8">{tab === "songs" ? <SongsAdmin /> : <ModerationPanel />}</div>
        </div>
      )}
    </div>
  );
}
