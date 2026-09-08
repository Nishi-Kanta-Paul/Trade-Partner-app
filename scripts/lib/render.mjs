import { formatHours, money } from "./analyse.mjs";

const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char],
  );

const SEVERITY = {
  high: { label: "Needs attention", colour: "#dc2626", tint: "#fef2f2" },
  medium: { label: "Worth a look", colour: "#d97706", tint: "#fffbeb" },
};

/**
 * The note blocks are `contenteditable`: open the file, type your reading of
 * each finding, then print to PDF. Nothing is saved back — the words go in the
 * PDF you send, not into the repo.
 */
export function renderReport({ period, generatedAt, stats, preparedBy }) {
  const kpi = (label, value, sub = "") => `
    <div class="kpi">
      <p class="kpi-label">${escape(label)}</p>
      <p class="kpi-value">${escape(value)}</p>
      ${sub ? `<p class="kpi-sub">${escape(sub)}</p>` : ""}
    </div>`;

  const findings = stats.findings.length
    ? stats.findings
        .map((finding) => {
          const tone = SEVERITY[finding.severity] ?? SEVERITY.medium;
          return `
      <section class="finding" style="--tone:${tone.colour};--tint:${tone.tint}">
        <p class="tag">${tone.label}</p>
        <h3>${escape(finding.title)}</h3>
        <p class="detail">${escape(finding.detail)}</p>
        <ul>${finding.rows.map((row) => `<li>${escape(row)}</li>`).join("")}</ul>
        <div class="note" contenteditable="true" data-placeholder="What this means, and what you suggest…"></div>
      </section>`;
        })
        .join("")
    : `<section class="finding" style="--tone:#059669;--tint:#ecfdf5">
         <p class="tag">All clear</p>
         <h3>Nothing flagged this period</h3>
         <p class="detail">Every job was closed out, PPE was confirmed and the photo record is complete.</p>
       </section>`;

  const partnerRows = stats.partners
    .map(
      (partner) => `
      <tr>
        <td>
          <strong>${escape(partner.name)}</strong>
          ${partner.company ? `<span class="muted">${escape(partner.company)}</span>` : ""}
        </td>
        <td class="num">${partner.arrivals}</td>
        <td class="num">${partner.departures}</td>
        <td class="num">${formatHours(partner.departures ? partner.minutes / partner.departures : null)}</td>
        <td class="num">${partner.photos}</td>
        <td class="num">${partner.invoiced ? money(partner.invoiced) : "—"}</td>
        <td class="num${partner.ppeFails ? " bad" : ""}">${partner.ppeFails || "—"}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Trade Partner — operations report, ${escape(period)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
<style>
  :root { --navy:#12315e; --deep:#0b1f4b; --brand:#f5b920; --ink:#1f2937; --muted:#6b7280; --line:#e5e7eb; }
  * { box-sizing:border-box; }
  body { margin:0; background:#f1f3f8; color:var(--ink);
         font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",sans-serif; }
  .page { max-width:900px; margin:0 auto; background:#fff; }

  header { background:linear-gradient(135deg,var(--deep),var(--navy) 55%,#1d4f92);
           color:#fff; padding:40px 48px 36px; }
  .mark { display:inline-flex; align-items:center; gap:12px; }
  .logo { width:52px; height:52px; border-radius:12px; background:var(--navy);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          color:var(--brand); font-weight:800; line-height:1; box-shadow:0 8px 24px rgba(0,0,0,.35); }
  .logo b { font-size:19px; letter-spacing:-.5px; }
  .logo span { font-size:6.5px; font-weight:700; }
  header h1 { margin:24px 0 4px; font-size:32px; letter-spacing:-.02em; }
  header p { margin:0; color:rgba(255,255,255,.72); font-size:15px; }

  section.block { padding:36px 48px; border-bottom:1px solid var(--line); }
  h2 { font-size:13px; text-transform:uppercase; letter-spacing:.12em;
       color:var(--muted); margin:0 0 18px; }

  .kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  .kpi { border:1px solid var(--line); border-radius:14px; padding:16px; }
  .kpi-label { margin:0; font-size:12px; font-weight:700; color:var(--muted); }
  .kpi-value { margin:6px 0 0; font-size:26px; font-weight:800; color:var(--navy); }
  .kpi-sub { margin:2px 0 0; font-size:12px; color:var(--muted); }

  .finding { border:1px solid var(--line); border-left:5px solid var(--tone);
             border-radius:12px; padding:18px 20px; margin-bottom:14px; background:var(--tint); }
  .tag { margin:0; font-size:11px; font-weight:800; text-transform:uppercase;
         letter-spacing:.1em; color:var(--tone); }
  .finding h3 { margin:6px 0 6px; font-size:18px; color:var(--navy); }
  .detail { margin:0; font-size:14px; color:#374151; }
  .finding ul { margin:12px 0 0; padding-left:18px; font-size:13px; color:#4b5563; }
  .finding li { margin-bottom:3px; }
  .note { margin-top:14px; min-height:52px; padding:12px 14px; border-radius:10px;
          background:#fff; border:1px dashed #cbd5e1; font-size:14px; line-height:1.6; }
  .note:empty::before { content:attr(data-placeholder); color:#9ca3af; }
  .note:focus { outline:2px solid var(--tone); outline-offset:1px; }

  table { width:100%; border-collapse:collapse; font-size:14px; }
  th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.08em;
       color:var(--muted); padding:0 10px 10px; border-bottom:1px solid var(--line); }
  th.num, td.num { text-align:right; }
  td { padding:12px 10px; border-bottom:1px solid #f1f3f8; vertical-align:top; }
  td strong { display:block; color:var(--navy); }
  .muted { color:var(--muted); font-size:12.5px; }
  td.bad { color:#dc2626; font-weight:700; }

  footer { padding:24px 48px 40px; font-size:12px; color:var(--muted); }

  .hint { max-width:900px; margin:16px auto; padding:12px 16px; border-radius:10px;
          background:#fff7d6; border:1px solid #f5d98a; font-size:13px; color:#7a5c05; }
  @media print {
    body { background:#fff; }
    .hint { display:none; }
    .note { border-color:#e5e7eb; }
    section.block { break-inside:avoid; }
    .finding { break-inside:avoid; }
  }
</style></head>
<body>
<p class="hint">Click any dashed box to type your reading of the finding, then Print → Save as PDF. This file is local only.</p>

<div class="page">
  <header>
    <div class="mark">
      <div class="logo"><b>CC</b><span>Cleaning</span><span>Connected</span></div>
    </div>
    <h1>Operations report</h1>
    <p>${escape(period)} · prepared by ${escape(preparedBy)} · ${escape(generatedAt)}</p>
  </header>

  <section class="block">
    <h2>At a glance</h2>
    <div class="kpis">
      ${kpi("Jobs closed out", stats.counts.departures, `${stats.counts.arrivals} arrivals logged`)}
      ${kpi("Partners active", stats.counts.partners)}
      ${kpi("Time on site", formatHours(stats.totalMinutes), stats.averageShift ? `${formatHours(stats.averageShift)} average` : "")}
      ${kpi("Invoiced", money(stats.invoiceTotal), `${stats.counts.invoices} invoice${stats.counts.invoices === 1 ? "" : "s"}`)}
      ${kpi("Proposals in", stats.counts.proposals)}
      ${kpi("Recaps filed", stats.counts.recaps)}
      ${kpi("Photos & video", stats.counts.photos)}
      ${kpi("Reports filed", stats.counts.arrivals + stats.counts.departures)}
    </div>
  </section>

  <section class="block">
    <h2>What stood out</h2>
    ${findings}
  </section>

  <section class="block">
    <h2>By partner</h2>
    <table>
      <thead><tr>
        <th>Partner</th><th class="num">Arrivals</th><th class="num">Jobs closed</th>
        <th class="num">Avg on site</th><th class="num">Media</th>
        <th class="num">Invoiced</th><th class="num">PPE flags</th>
      </tr></thead>
      <tbody>${partnerRows || `<tr><td colspan="7" class="muted">No submissions in this period.</td></tr>`}</tbody>
    </table>
  </section>

  <section class="block">
    <h2>Recommendation</h2>
    <div class="note" contenteditable="true" data-placeholder="What you would do next month…"></div>
  </section>

  <footer>Cleaning Connected · Trade Partner app · figures taken from submissions filed in the app.</footer>
</div>
</body></html>`;
}
