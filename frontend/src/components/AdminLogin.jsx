import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const formatDetail = (d) => {
  if (!d) return "No se pudo iniciar sesión.";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  return d.msg || String(d);
};

const inputCls =
  "w-full border border-olive-600 bg-olive-900 px-3 py-2.5 text-sm text-parchment placeholder:text-khaki/60 focus:border-brass focus:outline-none";
const labelCls = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-khaki";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(formatDetail(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <form onSubmit={submit} className="relative border border-olive-600/70 bg-olive-950 p-8" data-testid="admin-login-form">
        <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-brass" />
        <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brass" />
        <Lock size={22} className="text-brass" />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Zona restringida</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-parchment">Acceso del autor</h1>
        <div className="mt-6">
          <label className={labelCls} htmlFor="adm-email">E-mail</label>
          <input id="adm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required autoComplete="username" data-testid="admin-email-input" />
        </div>
        <div className="mt-4">
          <label className={labelCls} htmlFor="adm-pass">Contraseña</label>
          <input id="adm-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required autoComplete="current-password" data-testid="admin-password-input" />
        </div>
        {error && (
          <p className="mt-4 border border-signal/50 bg-signal/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-signal" data-testid="admin-login-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          data-testid="admin-login-submit"
          className="mt-6 flex w-full items-center justify-center gap-2 bg-brass px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-obsidian transition-colors hover:bg-parchment disabled:opacity-60"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />} Entrar
        </button>
      </form>
    </div>
  );
}
