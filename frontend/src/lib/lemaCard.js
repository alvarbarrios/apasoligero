/** Renders the "Lema del día" as a shareable PNG card (canvas). Returns a Blob. */
const loadImage = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const wrap = (ctx, text, maxWidth) => {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
};

const fitFont = (ctx, text, maxWidth, maxLines, start, min, build) => {
  for (let size = start; size >= min; size -= 4) {
    ctx.font = build(size);
    const lines = wrap(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { size, lines };
  }
  ctx.font = build(min);
  return { size: min, lines: wrap(ctx, text, maxWidth).slice(0, maxLines) };
};

export async function renderLemaCard({ motto, translation, unit, groupShort, emblem, dateLabel, format = "square" }) {
  await document.fonts?.ready;
  const W = format === "wide" ? 1200 : 1080;
  const H = format === "wide" ? 675 : 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const P = format === "wide" ? 72 : 96;

  // background + tactical grid
  ctx.fillStyle = "#0B0F0B";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(161,173,161,0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // frame + brass corners
  ctx.strokeStyle = "rgba(59,74,59,0.9)";
  ctx.lineWidth = 2;
  ctx.strokeRect(P / 2, P / 2, W - P, H - P);
  ctx.strokeStyle = "#D4A359";
  ctx.lineWidth = 6;
  const c = 48;
  ctx.beginPath(); ctx.moveTo(P / 2, P / 2 + c); ctx.lineTo(P / 2, P / 2); ctx.lineTo(P / 2 + c, P / 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - P / 2, H - P / 2 - c); ctx.lineTo(W - P / 2, H - P / 2); ctx.lineTo(W - P / 2 - c, H - P / 2); ctx.stroke();

  // eyebrow
  ctx.fillStyle = "#D4A359";
  ctx.font = `500 ${format === "wide" ? 20 : 24}px "JetBrains Mono", monospace`;
  ctx.textBaseline = "top";
  ctx.fillText(`LEMA DEL DÍA  ·  ${dateLabel.toUpperCase()}`.split("").join("\u200A"), P, P);

  // motto
  const mottoMax = W - P * 2;
  const mottoTop = P + (format === "wide" ? 70 : 110);
  const { size, lines } = fitFont(ctx, `“${motto}”`, mottoMax, format === "wide" ? 3 : 5, format === "wide" ? 76 : 96, 40,
    (s) => `italic 500 ${s}px "Playfair Display", Georgia, serif`);
  ctx.fillStyle = "#F4F5F4";
  const lh = size * 1.18;
  lines.forEach((l, i) => ctx.fillText(l, P, mottoTop + i * lh));
  let y = mottoTop + lines.length * lh + 28;

  // translation
  if (translation) {
    ctx.fillStyle = "#D4A359";
    ctx.font = `500 ${format === "wide" ? 22 : 28}px "JetBrains Mono", monospace`;
    const tl = wrap(ctx, translation.toUpperCase(), mottoMax);
    tl.slice(0, 2).forEach((l, i) => ctx.fillText(l, P, y + i * (format === "wide" ? 32 : 40)));
    y += tl.slice(0, 2).length * (format === "wide" ? 32 : 40) + 12;
  }

  // footer: emblem + unit + site
  const fy = H - P - (format === "wide" ? 96 : 120);
  ctx.strokeStyle = "rgba(59,74,59,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(P, fy - 28); ctx.lineTo(W - P, fy - 28); ctx.stroke();
  const img = await loadImage(emblem);
  let tx = P;
  if (img) {
    const es = format === "wide" ? 88 : 110;
    ctx.fillStyle = "#101610";
    ctx.fillRect(P, fy, es, es);
    ctx.strokeStyle = "#3B4A3B";
    ctx.lineWidth = 2;
    ctx.strokeRect(P, fy, es, es);
    const r = Math.min((es - 16) / img.width, (es - 16) / img.height);
    ctx.drawImage(img, P + (es - img.width * r) / 2, fy + (es - img.height * r) / 2, img.width * r, img.height * r);
    tx = P + es + 28;
  }
  ctx.fillStyle = "#F4F5F4";
  ctx.font = `700 ${format === "wide" ? 34 : 42}px "Barlow Condensed", sans-serif`;
  const ul = wrap(ctx, unit.toUpperCase(), W - tx - P - 320);
  ul.slice(0, 2).forEach((l, i) => ctx.fillText(l, tx, fy + 4 + i * (format === "wide" ? 36 : 44)));
  ctx.fillStyle = "#A1ADA1";
  ctx.font = `500 ${format === "wide" ? 18 : 22}px "JetBrains Mono", monospace`;
  ctx.fillText((groupShort || "").toUpperCase(), tx, fy + 4 + ul.slice(0, 2).length * (format === "wide" ? 36 : 44) + 6);

  const logo = await loadImage("/assets/img/logo-apl.png");
  const ls = format === "wide" ? 56 : 72;
  if (logo) ctx.drawImage(logo, W - P - ls, fy + (format === "wide" ? 12 : 16), ls, ls);
  ctx.textAlign = "right";
  ctx.fillStyle = "#D4A359";
  ctx.font = `500 ${format === "wide" ? 18 : 22}px "JetBrains Mono", monospace`;
  ctx.fillText("APASOLIGERO.COM", W - P - ls - 20, fy + (format === "wide" ? 30 : 40));
  ctx.textAlign = "left";

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
