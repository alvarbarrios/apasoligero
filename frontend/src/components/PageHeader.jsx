import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function PageHeader({ eyebrow, title, intro = [], crumbs = [], image, children }) {
  return (
    <div className="tactical-grid noise relative overflow-hidden border-b border-olive-600/60 bg-olive-950">
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        {crumbs.length > 0 && (
          <nav className="mb-5 flex flex-wrap items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki" data-testid="breadcrumbs">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={10} className="text-brass/60" />}
                {c.to ? (
                  <Link to={c.to} className="transition-colors hover:text-brass" data-testid={`crumb-${i}`}>
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-sage">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-brass"
            data-testid="page-eyebrow"
          >
            {eyebrow}
          </motion.p>
        )}
        <div className="mt-3 flex flex-wrap items-end justify-between gap-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-3xl font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-parchment sm:text-5xl lg:text-6xl"
            data-testid="page-title"
          >
            {title}
          </motion.h1>
          {image && (
            <motion.img
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              src={image}
              alt=""
              className="hidden h-24 w-24 border border-olive-600 object-cover md:block lg:h-28 lg:w-28"
              data-testid="page-header-image"
            />
          )}
        </div>
        {intro.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-6 max-w-2xl space-y-3 text-base leading-relaxed text-sage"
            data-testid="page-intro"
          >
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>
        )}
        {children}
      </div>
    </div>
  );
}
