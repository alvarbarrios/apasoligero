import data from "@/data/archive";
import { HIMNOS_META, LEMAS_META } from "@/data/archive";

export const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const songUrl = (key) => {
  const [section, ...rest] = key.split("/");
  if (section === "himnos") return `/canciones/himnos/${rest.join("/")}`;
  if (section === "pasoligero") return `/canciones/paso-ligero/${rest[0]}`;
  return `/canciones/otras/${rest[0]}`;
};

const songSub = (key) => {
  const [section, group] = key.split("/");
  if (section === "himnos") return `Himnos · ${HIMNOS_META[group]?.short || group}`;
  return section === "pasoligero" ? "Paso Ligero" : "Otras Canciones";
};

const PAGES = [
  ["/", "Inicio", "Portada del archivo"],
  ["/canciones", "Canciones", "Índice de canciones"],
  ["/canciones/paso-ligero", "Canciones de Paso Ligero", `${data.pasoligero.items.length} canciones para correr`],
  ["/canciones/himnos", "Himnos", "Himnos de los Ejércitos de España"],
  ["/canciones/corneta", "Toques de Corneta", "34 toques con su significado"],
  ["/canciones/corneta/cornetin", "Toques de Cornetín", "Voces de mando del orden cerrado"],
  ["/canciones/otras", "Otras Canciones", `${data.otras.items.length} canciones`],
  ["/canciones/internacional", "Internacional", "Músicas de otros ejércitos"],
  ["/audios", "Archivo de Audio", "Listado de archivos de audio"],
  ["/lemas", "Lemas de Unidades", "101 lemas con traducción"],
  ["/enlaces", "Enlaces", "Sitios amigos"],
  ["/libro-de-visitas", "Libro de Visitas", "Firme el libro"],
  ["/contacto", "Contacto", "El autor · Formulario"],
];

let INDEX = null;
export const resetIndex = () => {
  INDEX = null;
};
export function buildIndex() {
  if (INDEX) return INDEX;
  const items = [];
  for (const [key, s] of Object.entries(data.songs)) {
    items.push({
      type: "cancion",
      id: `song-${key}`,
      title: s.title,
      sub: songSub(key),
      to: songUrl(key),
      n: norm(s.title),
      body: norm(s.stanzas.flat().join(" ")),
    });
  }
  for (const g of data.lemasGroups) {
    const short = g.slug.replace(/^l/, "");
    for (const e of g.entries) {
      items.push({
        type: "lema",
        id: `lema-${g.slug}-${e.unit}-${e.motto}`,
        title: e.motto,
        sub: `${e.unit} · ${LEMAS_META[g.slug]?.short || g.title}`,
        to: `/lemas/${short}`,
        n: norm(`${e.motto} ${e.translation || ""}`),
        body: norm(e.unit),
      });
    }
  }
  for (const a of data.audios.items) {
    items.push({ type: "audio", id: `audio-${a.file}`, title: a.title, sub: "Archivo de Audio", file: a.file, to: "/audios", n: norm(a.title), body: norm("archivo de audio mp3") });
  }
  for (const c of data.corneta.calls) {
    if (!c.file) continue;
    items.push({ type: "audio", id: `toque-${c.file}`, title: `Toque de ${c.name}`, sub: "Toques de Corneta", file: c.file, to: "/canciones/corneta", n: norm(c.name), body: norm(`toque corneta ${c.desc}`) });
  }
  for (const c of data.cornetin.calls) {
    if (!c.file) continue;
    items.push({ type: "audio", id: `cornetin-${c.file}`, title: `Toque de ${c.name}`, sub: "Toques de Cornetín", file: c.file, to: "/canciones/corneta/cornetin", n: norm(c.name), body: norm(`toque cornetin ${c.desc}`) });
  }
  for (const [to, title, sub] of PAGES) {
    items.push({ type: "pagina", id: `page-${to}`, title, sub, to, n: norm(title), body: norm(sub) });
  }
  INDEX = items;
  return items;
}

export function search(query, limit = 40) {
  const q = norm(query);
  if (q.length < 2) return [];
  const words = q.split(" ");
  const scored = [];
  for (const it of buildIndex()) {
    let score = 0;
    if (it.n === q) score = 100;
    else if (it.n.startsWith(q)) score = 80;
    else if (it.n.includes(q)) score = 60;
    else if (words.every((w) => it.n.includes(w))) score = 45;
    else if (it.body.includes(q)) score = 30;
    else if (words.every((w) => it.n.includes(w) || it.body.includes(w))) score = 15;
    if (score) scored.push({ ...it, score });
  }
  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

export const TYPE_LABEL = { cancion: "Canciones", lema: "Lemas", audio: "Audios", pagina: "Secciones" };
export const TYPE_ORDER = ["cancion", "audio", "lema", "pagina"];
