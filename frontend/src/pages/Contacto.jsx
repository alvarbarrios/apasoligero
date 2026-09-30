import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Send, Mail } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import useTitle from "@/hooks/useTitle";
import data from "@/data/archive";

const TEMAS = ["Pedir Canción", "Enviar Canción", "Sugerencia", "Otros"];

export default function Contacto() {
  useTitle("Contacto");
  const [form, setForm] = useState({ tema: "Pedir Canción", asunto: "", nota: "", nombre: "", email: "", tel: "", uco: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const subject = `[A Paso Ligero] ${form.tema}: ${form.asunto || "Sin asunto"}`;
    const body = [
      `Tema: ${form.tema}`,
      `Asunto: ${form.asunto}`,
      "",
      form.nota,
      "",
      "—",
      `Nombre: ${form.nombre}`,
      `E-mail: ${form.email}`,
      `Tel: ${form.tel}`,
      `UCO: ${form.uco}`,
    ].join("\n");
    window.location.href = `mailto:${data.meta.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Se abrirá su cliente de correo con el mensaje preparado.");
  };

  const inputCls =
    "w-full border border-olive-600 bg-olive-950 px-3 py-2.5 text-sm text-parchment placeholder:text-khaki/60 focus:border-brass focus:outline-none";
  const labelCls = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-khaki";

  return (
    <div data-testid="contacto-page">
      <Toaster theme="dark" position="bottom-right" />
      <PageHeader
        eyebrow="Transmisión // Canal directo con el autor"
        title="El Autor — Info de Contacto"
        crumbs={[{ to: "/", label: "Inicio" }, { label: "Contacto" }]}
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <div className="flex items-start gap-5">
            <img
              src="/assets/img/escudocucospeque.gif"
              alt="Escudo de los Cuerpos Comunes de la Defensa"
              className="h-20 w-20 shrink-0 border border-olive-600 bg-olive-900 object-contain p-1"
              data-testid="autor-escudo"
            />
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-parchment">Sobre mí…</h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">Álvar Barrios Martínez</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-sage" data-testid="autor-bio">
            <p>
              Bueno, ha llegado la hora de presentarme como propietario de este espacio abierto a todos. Para
              comenzar quiero decir que aunque el grueso de esta página es de mi cosecha, sin la aportación generosa
              de muchos militares y algún que otro civil de buen gusto castrense, no sería posible haber recabado
              toda la información que aquí se expone.
            </p>
            <p>
              Soy Oficial Enfermero, destinado en el Ejército de Tierra. Hace poco tiempo que obtuve la condición de
              militar, aunque siempre me han gustado los temas castrenses. Gracias a pertenecer a los Cuerpos Comunes
              de la Defensa he podido pasar por las Academias de Oficiales de los tres Ejércitos, así como por
              distintos establecimientos militares donde me he podido empapar de esa cultura que tanto nos
              enorgullece.
            </p>
            <p>
              Soy de origen Salmantino, pero ahora resido en otra provincia. He tenido la inolvidable experiencia de
              servir en dos misiones en el extranjero, y espero poder añadir más contenidos a lo largo de mi carrera
              militar.
            </p>
          </div>
          <div className="mt-8 border border-olive-600/70 bg-olive-950 p-5" data-testid="mailto-fallback">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">Si no funciona el formulario</p>
            <a
              href={`mailto:${data.meta.email}`}
              data-testid="mailto-direct-link"
              className="mt-2 flex items-center gap-2 font-mono text-sm tracking-widest text-brass hover:underline"
            >
              <Mail size={14} /> Haz click AQUÍ — {data.meta.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <form onSubmit={submit} className="relative border border-olive-600/70 bg-olive-950 p-6 sm:p-8" data-testid="contact-form">
            <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-brass" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brass" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">Para contactar conmigo…</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-tight text-parchment">
              Formulario de Transmisión
            </h2>
            <div className="mt-6">
              <span className={labelCls}>Tema</span>
              <div className="grid grid-cols-2 gap-2" data-testid="tema-group">
                {TEMAS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm({ ...form, tema: t })}
                    data-testid={`tema-${t.toLowerCase().replace(/ /g, "-")}`}
                    className={`border px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                      form.tema === t
                        ? "border-brass bg-brass/10 text-brass"
                        : "border-olive-600 text-sage hover:border-olive-500"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <label className={labelCls} htmlFor="asunto">Asunto</label>
              <input id="asunto" value={form.asunto} onChange={set("asunto")} className={inputCls} data-testid="input-asunto" />
            </div>
            <div className="mt-5">
              <label className={labelCls} htmlFor="nota">Tu Nota</label>
              <textarea id="nota" rows={5} value={form.nota} onChange={set("nota")} className={inputCls} data-testid="input-nota" />
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-khaki">Si quieres que te contacte…</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="nombre">Nombre</label>
                <input id="nombre" value={form.nombre} onChange={set("nombre")} className={inputCls} data-testid="input-nombre" />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">E-mail</label>
                <input id="email" type="email" value={form.email} onChange={set("email")} className={inputCls} data-testid="input-email" />
              </div>
              <div>
                <label className={labelCls} htmlFor="tel">Tel</label>
                <input id="tel" value={form.tel} onChange={set("tel")} className={inputCls} data-testid="input-tel" />
              </div>
              <div>
                <label className={labelCls} htmlFor="uco">UCO</label>
                <input id="uco" value={form.uco} onChange={set("uco")} className={inputCls} data-testid="input-uco" />
              </div>
            </div>
            <button
              type="submit"
              data-testid="contact-submit"
              className="mt-7 flex w-full items-center justify-center gap-2 bg-brass px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-obsidian transition-colors hover:bg-parchment"
            >
              <Send size={14} /> Enviar transmisión
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
