import { Link } from "react-router-dom";
import useTitle from "@/hooks/useTitle";

export default function NotFound() {
  useTitle("404");
  return (
    <div className="tactical-grid noise relative flex min-h-[60vh] items-center" data-testid="not-found-page">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">Error 404 // Objetivo no localizado</p>
        <h1 className="mt-4 font-display text-7xl font-black uppercase tracking-tight text-parchment sm:text-8xl">404</h1>
        <p className="mt-4 text-base text-sage">
          La página solicitada no figura en este archivo. Regrese a formación.
        </p>
        <Link
          to="/"
          data-testid="notfound-home-link"
          className="mt-8 inline-block border border-brass px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-brass transition-colors hover:bg-brass hover:text-obsidian"
        >
          Volver al cuartel general
        </Link>
      </div>
    </div>
  );
}
