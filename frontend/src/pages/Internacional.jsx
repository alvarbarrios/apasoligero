import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import useTitle from "@/hooks/useTitle";

export default function Internacional() {
  useTitle("Cancionero Internacional");
  return (
    <div data-testid="internacional-page">
      <PageHeader
        eyebrow="SEC_05 // Otros Ejércitos"
        title="Cancionero Internacional"
        image="/assets/img/internacional.jpg"
        intro={[
          "Sección donde iré incluyendo distintas canciones de otros Ejércitos aportadas por distintos colaboradores. Me gustaría aprovechar para agradecer a todos los que participan en la construcción de esta web.",
        ]}
        crumbs={[{ to: "/", label: "Inicio" }, { to: "/canciones", label: "Canciones" }, { label: "Internacional" }]}
      />
      <Marquee items={["Próximamente en línea", "Canciones de otros Ejércitos", "Aportaciones de colaboradores"]} />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="relative mx-auto max-w-2xl border border-brass/40 bg-olive-950 p-10 text-center" data-testid="internacional-soon">
            <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-brass" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-brass" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">Lista de canciones</p>
            <p className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-parchment sm:text-5xl">
              Próximamente en línea
            </p>
            <p className="mt-4 text-sm leading-relaxed text-sage">
              ¿Tiene material de otros Ejércitos? Toda aportación es bienvenida a través de la página de contacto.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
