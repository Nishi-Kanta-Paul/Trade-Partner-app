/**
 * Hand-rolled SVG charts — no library, so the report stays a single file that
 * prints cleanly and opens years from now.
 *
 * Palette is the validated default: slot 1 blue, slot 2 orange, critical red.
 * The pairs actually used were checked with the data-viz validator against a
 * white surface (worst adjacent CVD ΔE 24.7 blue↔orange, 23.8 blue↔red).
 */

export const C = {
  series1: "#2a78d6",
  series2: "#eb6834",
  critical: "#d03b3b",
  grid: "#e5e7eb",
  axis: "#c3c2b7",
  muted: "#898781",
  ink: "#374151",
  surface: "#ffffff",
};

const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

/** Bar with a 4px rounded data-end and a square baseline end. */
function barPath(x, y, w, h, r, dir) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  if (h <= 0 || w <= 0) return "";
  return dir === "up"
    ? `M${x},${y + h} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h} Z`
    : `M${x},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h - radius} Q${x + w},${y + h} ${x + w - radius},${y + h} L${x},${y + h} Z`;
}

/** Round an axis maximum up to something a person would write down. */
function niceMax(value) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function legend(items) {
  return `<div class="legend">${items
    .map(
      (item) =>
        `<span><i style="background:${item.color}"></i>${esc(item.name)}</span>`,
    )
    .join("")}</div>`;
}

/**
 * Grouped columns over time. Two series max — past that the day labels stop
 * fitting and a table reads better.
 */
export function columnChart({ categories, series, height = 200, unit = "" }) {
  if (!categories.length) return empty("No activity in this period.");

  const W = 840;
  const padL = 34;
  const padR = 8;
  const padB = 26;
  const padT = 10;
  const plotW = W - padL - padR;
  const plotH = height - padT - padB;

  const max = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
  const band = plotW / categories.length;
  const gap = 2;
  const barW = Math.min(22, (band - 10 - gap * (series.length - 1)) / series.length);

  const ticks = [0, max / 2, max].map((value) => {
    const y = padT + plotH - (value / max) * plotH;
    return `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="${value === 0 ? C.axis : C.grid}" stroke-width="1"/>
      <text x="${padL - 8}" y="${y + 4}" text-anchor="end" class="tick">${Math.round(value)}</text>`;
  });

  const marks = categories.flatMap((category, i) => {
    const groupW = barW * series.length + gap * (series.length - 1);
    const left = padL + band * i + (band - groupW) / 2;
    return series.map((s, j) => {
      const value = s.values[i] ?? 0;
      const h = (value / max) * plotH;
      const x = left + j * (barW + gap);
      const y = padT + plotH - h;
      return value
        ? `<path d="${barPath(x, y, barW, h, 4, "up")}" fill="${s.color}"><title>${esc(category)} · ${esc(s.name)}: ${value}${unit}</title></path>`
        : "";
    });
  });

  // Only label every nth day, or they collide.
  const step = Math.ceil(categories.length / 16);
  const labels = categories.map((category, i) =>
    i % step === 0
      ? `<text x="${padL + band * i + band / 2}" y="${height - 8}" text-anchor="middle" class="tick">${esc(category)}</text>`
      : "",
  );

  return `${legend(series)}
    <svg viewBox="0 0 ${W} ${height}" class="chart" role="img">
      ${ticks.join("")}${marks.join("")}${labels.join("")}
    </svg>`;
}

/** Horizontal bars for comparing a magnitude across a handful of names. */
export function barChart({ rows, color = C.series1, format = (v) => v }) {
  if (!rows.length) return empty("Nothing to compare yet.");

  const W = 840;
  const rowH = 30;
  const labelW = 190;
  const valueW = 78;
  const plotW = W - labelW - valueW;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const height = rows.length * rowH + 6;

  const marks = rows.map((row, i) => {
    const w = Math.max(2, (row.value / max) * plotW);
    const y = i * rowH + 6;
    return `
      <text x="${labelW - 12}" y="${y + 13}" text-anchor="end" class="rowlabel">${esc(row.label)}</text>
      <path d="${barPath(labelW, y, w, 18, 4, "right")}" fill="${color}"><title>${esc(row.label)}: ${esc(format(row.value))}</title></path>
      <text x="${labelW + w + 10}" y="${y + 13}" class="rowvalue">${esc(format(row.value))}</text>`;
  });

  return `<svg viewBox="0 0 ${W} ${height}" class="chart" role="img">${marks.join("")}</svg>`;
}

/** One bar split into parts — the shape of a whole, not a pie. */
export function stackedBar({ segments, total }) {
  const sum = total ?? segments.reduce((s, seg) => s + seg.value, 0);
  if (!sum) return empty("No jobs closed out yet.");

  const W = 840;
  const H = 34;
  const gap = 2;
  let x = 0;

  const marks = segments
    .filter((segment) => segment.value > 0)
    .map((segment, i, list) => {
      const w = (segment.value / sum) * (W - gap * (list.length - 1));
      const isFirst = i === 0;
      const isLast = i === list.length - 1;
      const path =
        isFirst && isLast
          ? barPath(x, 0, w, H, 4, "right")
          : isLast
            ? barPath(x, 0, w, H, 4, "right")
            : `M${x},0 h${w} v${H} h${-w} Z`;
      const label = `${Math.round((segment.value / sum) * 100)}%`;
      const fits = w > 46;
      const text = fits
        ? `<text x="${x + w / 2}" y="${H / 2 + 5}" text-anchor="middle" class="inbar">${label}</text>`
        : "";
      const mark = `<path d="${path}" fill="${segment.color}"><title>${esc(segment.label)}: ${segment.value} (${label})</title></path>${text}`;
      x += w + gap;
      return mark;
    });

  return `${legend(segments.filter((s) => s.value > 0).map((s) => ({ name: `${s.label} · ${s.value}`, color: s.color })))}
    <svg viewBox="0 0 ${W} ${H}" class="chart" role="img">${marks.join("")}</svg>`;
}

function empty(message) {
  return `<p class="empty">${esc(message)}</p>`;
}
