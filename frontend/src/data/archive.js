import data from "./archive.json";

export default data;

export const HIMNOS_META = {
  espana: { short: "España", code: "ESP", emblem: "/assets/img/escudo-espana.svg" },
  tierra: { short: "Ejército de Tierra", code: "ET", emblem: "/assets/img/et.png" },
  armada: { short: "Armada Española", code: "ARM", emblem: "/assets/img/ae.gif" },
  aire: { short: "Ejército del Aire", code: "EA", emblem: "/assets/img/ea.PNG" },
  cucos: { short: "Cuerpos Comunes de la Defensa", code: "CUCOS", emblem: "/assets/img/cc.gif" },
  gcivil: { short: "Guardia Civil", code: "GC", emblem: "/assets/img/gc.gif" },
  greal: { short: "Guardia Real", code: "GR", emblem: "/assets/img/gr.png" },
  ume: { short: "Unidad Militar de Emergencias", code: "UME", emblem: "/assets/img/ume.png" },
  varios: { short: "Varios", code: "VAR", emblem: "/assets/img/varios.gif" },
};

export const LEMAS_META = {
  ltierra: { short: "Ejército de Tierra", code: "ET", emblem: "/assets/img/et.png" },
  larmada: { short: "Armada Española", code: "ARM", emblem: "/assets/img/ae.gif" },
  laire: { short: "Ejército del Aire", code: "EA", emblem: "/assets/img/ea.PNG" },
  lcucos: { short: "Cuerpos Comunes", code: "CUCOS", emblem: "/assets/img/cc.gif" },
  lgcivil: { short: "Guardia Civil", code: "GC", emblem: "/assets/img/gc.gif" },
  lgreal: { short: "Guardia Real", code: "GR", emblem: "/assets/img/gr.png" },
  lume: { short: "UME", code: "UME", emblem: "/assets/img/ume.png" },
  lvarios: { short: "Varios", code: "VAR", emblem: "/assets/img/escudo-espana.svg" },
};

export const getHimnosGroup = (slug) => data.himnosGroups.find((g) => g.slug === slug);
export const getLemasGroup = (slug) => data.lemasGroups.find((g) => g.slug === "l" + slug || g.slug === slug);
export const getSong = (key) => data.songs[key];

export const STATS = {
  canciones: Object.keys(data.songs).length,
  toques: data.corneta.calls.length,
  audios: data.audios.items.length + data.corneta.calls.filter((c) => c.file).length,
  lemas: data.lemasGroups.reduce((n, g) => n + g.entries.length, 0),
};

export const CORNETA_INDEX = 29;
