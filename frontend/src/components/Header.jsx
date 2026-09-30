import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Radio } from "lucide-react";
import CornetaMark from "./CornetaMark";
import { usePlayer } from "@/context/PlayerContext";

const LINKS = [
  { to: "/", label: "Inicio", id: "inicio" },
  { to: "/canciones", label: "Canciones", id: "canciones" },
  { to: "/canciones/himnos", label: "Himnos", id: "himnos" },
  { to: "/canciones/corneta", label: "Corneta", id: "corneta" },
  { to: "/audios", label: "Audios", id: "audios" },
  { to: "/lemas", label: "Lemas", id: "lemas" },
  { to: "/enlaces", label: "Enlaces", id: "enlaces" },
  { to: "/contacto", label: "Contacto", id: "contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { track, playing } = usePlayer();
  return (
    <header className="sticky top-0 z-40 border-b border-olive-600/60 bg-obsidian/90 backdrop-blur-md" data-testid="site-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3" data-testid="brand-link" onClick={() => setOpen(false)}>
          <CornetaMark size={36} />
          <span className="leading-none">
            <span className="block font-display text-xl font-extrabold uppercase tracking-wide text-parchment group-hover:text-brass transition-colors">
              A Paso Ligero
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-khaki">
              .com · músicas militares
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" data-testid="main-nav">
          {LINKS.map((l) => (
            <NavLink
              key={l.id}
              to={l.to}
              end={l.to === "/"}
              data-testid={`nav-link-${l.id}`}
              className={({ isActive }) =>
                `relative font-mono text-[11px] uppercase tracking-[0.18em] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-brass after:transition-all after:duration-300 ${
                  isActive ? "text-brass after:w-full" : "text-sage hover:text-parchment after:w-0 hover:after:w-full"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {track && (
            <div className="hidden items-center gap-2 border border-olive-600 bg-olive-950 px-3 py-1.5 md:flex" data-testid="nav-playing-pill">
              <span className={`h-1.5 w-1.5 ${playing ? "bg-green-500 led-pulse" : "bg-brass"}`} />
              <span className="max-w-[140px] truncate font-mono text-[10px] uppercase tracking-widest text-sage">
                {track.title}
              </span>
            </div>
          )}
          <Link
            to="/contacto"
            data-testid="aporten-cta"
            className="hidden border border-brass/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-brass transition-colors hover:bg-brass hover:text-obsidian sm:block"
          >
            ¡Aporten!
          </Link>
          <button
            className="text-parchment lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-olive-600/60 bg-olive-950 px-4 py-4 lg:hidden" data-testid="mobile-nav">
          <div className="grid gap-1">
            {LINKS.map((l, i) => (
              <NavLink
                key={l.id}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${l.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 border-l-2 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.18em] ${
                    isActive ? "border-brass text-brass" : "border-transparent text-sage"
                  }`
                }
              >
                <span className="text-khaki">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/libro-de-visitas"
              onClick={() => setOpen(false)}
              data-testid="mobile-nav-link-libro"
              className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-sage"
            >
              <span className="text-khaki">09</span> Libro de Visitas
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
