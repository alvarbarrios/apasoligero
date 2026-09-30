import { Loader2 } from "lucide-react";
import useTitle from "@/hooks/useTitle";
import { useAuth } from "@/context/AuthContext";
import AdminLogin from "@/components/AdminLogin";
import ModerationPanel from "@/components/ModerationPanel";

export default function Admin() {
  useTitle("Acceso del autor");
  const { user } = useAuth();
  return (
    <div data-testid="admin-page">
      {user === null && (
        <p className="flex items-center justify-center gap-2 py-24 font-mono text-xs uppercase tracking-widest text-khaki" data-testid="admin-checking">
          <Loader2 size={14} className="animate-spin" /> Comprobando acceso…
        </p>
      )}
      {user === false && <AdminLogin />}
      {user && <ModerationPanel />}
    </div>
  );
}
