import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Download, Music, Disc3, Megaphone, Quote, ChevronRight } from "lucide-react";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import AudioButton from "@/components/AudioButton";
import useTitle from "@/hooks/useTitle";
import data, { STATS } from "@/data/archive";

const SECTIONS = [
  {
    n: "01", title: "Paso Ligero", to: "/canciones/paso-ligero", img: "/assets/img/pasoligero.JPG",
    desc: "Típicas canciones que se cantan corriendo todos juntos en Unidad. Existen muchas y muy curiosas, y aquí va la letra de algunas.",
    count: data.pasoligero.items.length, unit: "canciones", span: "md:col-span-4", id: "pasoligero",
  },
  {
    n: "02", title: "Himnos", to: "/canciones/himnos", img: "/assets/img/himnos.JPG",
    desc: "Letras y sonidos de los distintos Ejércitos de España: Tierra, Armada, Aire, Guardia Civil, Guardia Real, UME y más.",
    count: data.himnosGroups.reduce((a, g) => a + g.items.length, 0), unit: "himnos", span: "md:col-span-2", id: "himnos",
  },
  {
    n: "03", title: "Toques de Corneta", to: "/canciones/corneta", img: "/assets/img/corneta.jpg",
    desc: "Los toques de corneta expresan las distintas órdenes al total de las Fuerzas; cada toque tiene un significado.",
    count: data.corneta.calls.length, unit: "toques", span: "md:col-span-2", id: "corneta",
  },
  {
    n: "04", title: "Otras Canciones", to: "/canciones/otras", img: "/assets/img/otras.JPG",
    desc: "Variopinta mezcolanza de canciones cantadas en los diversos acuartelamientos de nuestro país.",
    count: data.otras.items.length, unit: "canciones", span: "md:col-span-2", id: "otras",
  },
  {
    n: "05", title: "Internacional", to: "/canciones/internacional", img: "/assets/img/internacional.jpg",
    desc: "Canciones de otros Ejércitos aportadas por distintos colaboradores.",
    count: null, unit: "", span: "md:col-span-2", id: "internacional",
  },
];

const heroLine = {
  hidden: { y: "112%" },
  show: (i) => ({ y: 0, transition: { duration: 0.9, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Home() {
  useTitle("");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const imgY2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="tactical-grid noise relative overflow-hidden border-b border-olive-600/60">
        <div className="pointer-events-none absolute inset-0 scanlines" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
              className="font-mono text-xs uppercase tracking-[0.3em] text-brass"
              data-testid="hero-eyebrow"
            >
              Archivo musical militar · Fuerzas Armadas Españolas · Desde 2003
            </motion.p>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.85] tracking-tight" data-testid="hero-title">
              <span className="block overflow-hidden">
                <motion.span custom={0} variants={heroLine} initial="hidden" animate="show" className="block text-[clamp(3.8rem,12vw,9.5rem)] text-parchment">
                  A Paso
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span custom={1} variants={heroLine} initial="hidden" animate="show" className="block text-[clamp(3.8rem,12vw,9.5rem)] text-brass">
                  Ligero
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-sage sm:text-sm"
              data-testid="hero-subtitle"
            >
              Web de Músicas Militares
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-sage"
              data-testid="hero-welcome"
            >
              En primer lugar quiero agradecerles su visita a esta Página Web. Mi objetivo en este sitio es reunir
              en un solo espacio distintas variedades de músicas militares, desde las letras de las populares
              canciones de paso ligero hasta los diferentes toques de corneta, pasando por himnos, marchas y demás.
              Todos ellos han sido recopilados durante mi paso por distintas Unidades de las Fuerzas Armadas
              Españolas y gracias a las aportaciones de numerosos colaboradores.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/canciones"
                data-testid="hero-cta-cancionero"
                className="group flex items-center gap-2 bg-brass px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-parchment"
              >
                Explorar el Cancionero
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/canciones/corneta"
                data-testid="hero-cta-corneta"
                className="border border-olive-500 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-sage transition-colors hover:border-brass hover:text-brass"
              >
                Toques de Corneta
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-10 flex items-center gap-4 border border-olive-600/70 bg-olive-950/80 p-4"
              data-testid="hero-audio-card"
            >
              <AudioButton file="/assets/audio/himnonacional.mp3" title="Himno Nacional de España" sub="Audio Master HQ" testid="hero-play-himno" />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">Escuche ahora</p>
                <p className="truncate font-display text-lg font-bold uppercase tracking-wide text-parchment">
                  Himno Nacional de España
                </p>
              </div>
              <Disc3 size={20} className="ml-auto shrink-0 text-olive-500" />
            </motion.div>
          </div>
          <div className="relative mt-10 lg:hidden">
            <figure className="relative border border-olive-600" data-testid="hero-image-mobile">
              <span className="absolute -left-px -top-px z-10 h-5 w-5 border-l-2 border-t-2 border-brass" />
              <span className="absolute -bottom-px -right-px z-10 h-5 w-5 border-b-2 border-r-2 border-brass" />
              <img src="/assets/img/index.JPG" alt="Unidad en formación de las Fuerzas Armadas Españolas" className="h-52 w-full object-cover sm:h-64" />
              <figcaption className="flex items-center justify-between border-t border-olive-600 bg-olive-950 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">
                <span>FIG_01 · Unidad en formación</span>
                <span className="text-brass">APL/ARCHIVO</span>
              </figcaption>
            </figure>
          </div>
          <div className="relative hidden lg:col-span-5 lg:block">
            <motion.figure
              style={{ y: imgY }}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute right-0 top-0 w-[78%] border border-olive-600"
              data-testid="hero-image-main"
            >
              <span className="absolute -left-px -top-px z-10 h-5 w-5 border-l-2 border-t-2 border-brass" />
              <span className="absolute -bottom-px -right-px z-10 h-5 w-5 border-b-2 border-r-2 border-brass" />
              <img src="/assets/img/index.JPG" alt="Unidad en formación de las Fuerzas Armadas Españolas" className="h-[420px] w-full object-cover" />
              <figcaption className="flex items-center justify-between border-t border-olive-600 bg-olive-950 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">
                <span>FIG_01 · Unidad en formación</span>
                <span className="text-brass">APL/ARCHIVO</span>
              </figcaption>
            </motion.figure>
            <motion.figure
              style={{ y: imgY2 }}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute bottom-[-3rem] left-0 w-[52%] border border-olive-600 shadow-2xl"
              data-testid="hero-image-secondary"
            >
              <img src="/assets/img/corneta.jpg" alt="Corneta de órdenes" className="h-56 w-full object-cover" />
              <figcaption className="border-t border-olive-600 bg-olive-950 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">
                FIG_02 · Corneta de órdenes
              </figcaption>
            </motion.figure>
          </div>
        </div>
        <div className="relative border-t border-olive-600/60 bg-olive-950/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-olive-600/60 sm:grid-cols-4" data-testid="hero-stats">
            {[
              [STATS.canciones + "+", "Letras de canciones e himnos"],
              [STATS.toques, "Toques de corneta reglamentarios"],
              [STATS.audios, "Archivos de audio del archivo"],
              [STATS.lemas + "+", "Lemas de unidades, en latín y español"],
            ].map(([n, label], i) => (
              <div key={i} className="px-4 py-5 sm:px-6" data-testid={`stat-${i}`}>
                <p className="font-display text-3xl font-extrabold text-brass sm:text-4xl">{n}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-khaki">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={["Paso Ligero", "Himnos", "Toques de Corneta", "Lemas de Unidades", "Marchas Militares", "Cancionero del Soldado", "Guardia Civil", "La Legión", "Armada Española", "Ejército del Aire"]} />

      {/* SECTIONS BENTO */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24" data-testid="home-sections">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">Índice del archivo</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-parchment sm:text-4xl lg:text-5xl">
                Secciones del Cancionero
              </h2>
            </div>
            <Link to="/canciones" className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-sage transition-colors hover:text-brass" data-testid="sections-view-all">
              Ver índice completo <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-6">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06} className={s.span}>
              <Link
                to={s.to}
                data-testid={`section-card-${s.id}`}
                className="group relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden border border-olive-600/70 bg-olive-950 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/70"
              >
                <span className="absolute left-0 top-0 z-10 h-4 w-4 border-l-2 border-t-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-0 right-0 z-10 h-4 w-4 border-b-2 border-r-2 border-brass opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between p-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">SEC_{s.n}</span>
                  {s.count !== null && (
                    <span className="border border-olive-600 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brass">
                      {s.count} {s.unit}
                    </span>
                  )}
                </div>
                <div className="px-5 pb-5">
                  <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-parchment transition-colors group-hover:text-brass sm:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-sage">{s.desc}</p>
                  <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki transition-colors group-hover:text-brass">
                    Entrar <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
                <img
                  src={s.img}
                  alt=""
                  className="pointer-events-none absolute -right-6 top-1/2 h-40 w-40 -translate-y-1/2 rotate-3 border border-olive-600 object-cover opacity-25 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-50"
                />
              </Link>
            </Reveal>
          ))}
          <Reveal delay={0.3} className="md:col-span-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { to: "/audios", icon: Download, title: "Archivo de Audio", desc: "Listado completo de archivos de audio del sitio, listos para escuchar y descargar.", id: "audios" },
                { to: "/lemas", icon: Quote, title: "Lemas de Unidades", desc: "Cada Unidad tiene una frase que refleja su espíritu y sus virtudes, en español o en latín.", id: "lemas" },
                { to: "/libro-de-visitas", icon: Music, title: "Libro de Visitas", desc: "Dejen su huella en este lugar: el guestbook de A Paso Ligero .com.", id: "libro" },
              ].map((c) => (
                <Link
                  key={c.id}
                  to={c.to}
                  data-testid={`quick-card-${c.id}`}
                  className="group border border-olive-600/70 bg-olive-900/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/70"
                >
                  <c.icon size={20} className="text-brass" />
                  <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-parchment group-hover:text-brass">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-sage">{c.desc}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* NUEVO / AUDIOS */}
      <section className="border-y border-brass/30 bg-olive-900/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6">
          <Reveal>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-signal">
              <Megaphone size={14} /> Novedad del archivo
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-tight text-parchment sm:text-3xl" data-testid="nuevo-title">
              Nuevo — Listado completo de archivos de audio
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/audios"
              data-testid="nuevo-cta-audios"
              className="group flex items-center gap-2 border border-brass px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-brass transition-colors hover:bg-brass hover:text-obsidian"
            >
              Abrir el archivo <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* APORTEN */}
      <section className="noise relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24" data-testid="aporten-section">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">Novedades · Colaboración</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-tight text-parchment sm:text-5xl">
              ¡Aporten!
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sage">
              Me gustaría animar a todos los visitantes a contribuir con sus aportaciones a este espacio que es de
              todos. A través de la página de contacto me pueden mandar todas las canciones que quieran, y yo las
              iré subiendo. Especialmente me interesan las canciones de paso ligero, que son difíciles de conseguir.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-khaki">
              ¡Espero que disfruten su visita!
            </p>
            <Link
              to="/contacto"
              data-testid="aporten-section-cta"
              className="mt-8 inline-flex items-center gap-2 bg-brass px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-parchment"
            >
              Enviar una aportación <ArrowRight size={14} />
            </Link>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-5">
            <figure className="relative border border-olive-600">
              <span className="absolute -left-px -top-px z-10 h-5 w-5 border-l-2 border-t-2 border-brass" />
              <span className="absolute -bottom-px -right-px z-10 h-5 w-5 border-b-2 border-r-2 border-brass" />
              <img src="/assets/img/pasoligero.JPG" alt="Tropa corriendo a paso ligero" className="h-72 w-full object-cover" />
              <figcaption className="flex items-center justify-between border-t border-olive-600 bg-olive-950 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-khaki">
                <span>FIG_03 · A paso ligero</span>
                <span className="text-brass">APL/ARCHIVO</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
