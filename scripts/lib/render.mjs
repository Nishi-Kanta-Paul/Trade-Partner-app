import { formatHours, money } from "./analyse.mjs";
import { barChart, columnChart, stackedBar, C } from "./charts.mjs";

const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char],
  );

const SEVERITY = {
  high: { label: "Needs attention", colour: "#d03b3b", tint: "#fdf2f2" },
  medium: { label: "Worth a look", colour: "#eb6834", tint: "#fff6f1" },
};

const shortDay = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

const FORM_LABEL = {
  proposal: "Proposal",
  arrival: "Arrival",
  departure: "Departure",
  recap: "Recap",
  invoice: "Invoice",
};

/**
 * The note blocks are `contenteditable`: open the file, type your reading of
 * each finding, then print to PDF. Nothing is saved back — the words go in the
 * PDF you send, not into the repo.
 */
export function renderReport({ period, generatedAt, stats, preparedBy }) {
  const kpi = (label, value, sub = "") => `
    <div class="kpi">
      <p class="kpi-label">${esc(label)}</p>
      <p class="kpi-value">${esc(value)}</p>
      ${sub ? `<p class="kpi-sub">${esc(sub)}</p>` : ""}
    </div>`;

  const note = (placeholder) =>
    `<div class="note" contenteditable="true" data-placeholder="${esc(placeholder)}"></div>`;

  const findings = stats.findings.length
    ? stats.findings
        .map((finding) => {
          const tone = SEVERITY[finding.severity] ?? SEVERITY.medium;
          return `
      <section class="finding" style="--tone:${tone.colour};--tint:${tone.tint}">
        <p class="tag">${tone.label}</p>
        <h3>${esc(finding.title)}</h3>
        <p class="detail">${esc(finding.detail)}</p>
        <ul>${finding.rows.map((row) => `<li>${esc(row)}</li>`).join("")}</ul>
        ${note("What this means, and what you suggest…")}
      </section>`;
        })
        .join("")
    : `<section class="finding" style="--tone:#0ca30c;--tint:#f0fdf4">
         <p class="tag">All clear</p>
         <h3>Nothing flagged this period</h3>
         <p class="detail">Every job was closed out, PPE was confirmed and the photo record is complete.</p>
       </section>`;

  const partnerRows = stats.partners
    .map(
      (partner) => `
      <tr>
        <td>
          <strong>${esc(partner.name)}</strong>
          ${partner.company ? `<span class="muted">${esc(partner.company)}</span>` : ""}
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

  const projectRows = stats.projects
    .map(
      (project) => `
      <tr>
        <td>
          <strong>${esc(project.name)}</strong>
          ${project.number ? `<span class="muted">#${esc(project.number)}</span>` : ""}
        </td>
        <td class="num">${project.partners}</td>
        <td class="num">${project.jobs}</td>
        <td class="num">${formatHours(project.minutes || null)}</td>
        <td class="num${project.returns ? " bad" : ""}">${project.returns || "—"}</td>
        <td class="num">${project.invoiced ? money(project.invoiced) : "—"}</td>
      </tr>`,
    )
    .join("");

  const logRows = stats.log
    .map(
      (row) => `
      <tr>
        <td class="mono">${esc(String(row.created_at).slice(0, 10))}</td>
        <td><span class="pill">${esc(FORM_LABEL[row.form] ?? row.form)}</span></td>
        <td>${esc(row.partner_name || "—")}</td>
        <td>${esc(row.project_name || "—")}</td>
        <td class="num">${(row.files ?? []).length || "—"}</td>
        <td class="num">${row.amount ? money(row.amount) : "—"}</td>
      </tr>`,
    )
    .join("");

  // A magnitude chart reads longest-first; the table below keeps the other order.
  const hoursByPartner = stats.partners
    .filter((partner) => partner.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 10)
    .map((partner) => ({ label: partner.name, value: partner.minutes }));

  const moneyByPartner = stats.partners
    .filter((partner) => partner.invoiced > 0)
    .sort((a, b) => b.invoiced - a.invoiced)
    .slice(0, 10)
    .map((partner) => ({ label: partner.name, value: partner.invoiced }));

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Trade Partner — operations report, ${esc(period)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
<style>
  :root { --navy:#12315e; --deep:#0b1f4b; --brand:#f5b920;
          --ink:#1f2937; --muted:#6b7280; --line:#e5e7eb; --tick:#898781; }
  * { box-sizing:border-box; }
  body { margin:0; background:#f1f3f8; color:var(--ink);
         font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",sans-serif; }
  .page { max-width:940px; margin:0 auto; background:#fff; }

  header { background:linear-gradient(135deg,var(--deep),var(--navy) 55%,#1d4f92);
           color:#fff; padding:40px 48px 34px; }
  .logo { width:52px; height:52px; border-radius:12px; background:var(--navy);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          color:var(--brand); font-weight:800; line-height:1; box-shadow:0 8px 24px rgba(0,0,0,.35); }
  .logo b { font-size:19px; letter-spacing:-.5px; }
  .logo span { font-size:6.5px; font-weight:700; }
  header h1 { margin:22px 0 4px; font-size:31px; letter-spacing:-.02em; }
  header p.meta { margin:0; color:rgba(255,255,255,.7); font-size:14.5px; }
  .hero { margin-top:26px; display:flex; align-items:baseline; gap:14px; }
  .hero-value { font-size:52px; font-weight:800; line-height:1; letter-spacing:-.03em; }
  .hero-label { font-size:14px; color:rgba(255,255,255,.72); max-width:230px; line-height:1.4; }

  section.block { padding:32px 48px; border-bottom:1px solid var(--line); }
  h2 { font-size:12px; text-transform:uppercase; letter-spacing:.13em;
       color:var(--muted); margin:0 0 6px; }
  .lede { margin:0 0 20px; font-size:14px; color:var(--muted); }

  .kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .kpi { border:1px solid var(--line); border-radius:14px; padding:14px 16px; }
  .kpi-label { margin:0; font-size:11.5px; font-weight:700; color:var(--muted); }
  .kpi-value { margin:6px 0 0; font-size:25px; font-weight:800; color:var(--navy); }
  .kpi-sub { margin:2px 0 0; font-size:11.5px; color:var(--muted); }

  .chart { width:100%; height:auto; display:block; overflow:visible; }
  .tick { font-size:10.5px; fill:var(--tick); font-variant-numeric:tabular-nums; }
  .rowlabel { font-size:12.5px; fill:var(--ink); font-weight:600; }
  .rowvalue { font-size:12px; fill:var(--muted); font-variant-numeric:tabular-nums; }
  .inbar { font-size:12px; font-weight:700; fill:#fff; }
  .legend { display:flex; gap:18px; margin:0 0 12px; font-size:12.5px; color:var(--muted); }
  .legend span { display:inline-flex; align-items:center; gap:7px; }
  .legend i { width:11px; height:11px; border-radius:3px; display:inline-block; }
  .empty { font-size:13.5px; color:var(--muted); margin:0; }

  .finding { border:1px solid var(--line); border-left:5px solid var(--tone);
             border-radius:12px; padding:17px 20px; margin-bottom:13px; background:var(--tint); }
  .tag { margin:0; font-size:10.5px; font-weight:800; text-transform:uppercase;
         letter-spacing:.1em; color:var(--tone); }
  .finding h3 { margin:6px 0 6px; font-size:17.5px; color:var(--navy); }
  .detail { margin:0; font-size:14px; color:#374151; }
  .finding ul { margin:11px 0 0; padding-left:18px; font-size:13px; color:#4b5563; }
  .finding li { margin-bottom:3px; }
  .note { margin-top:13px; min-height:50px; padding:11px 14px; border-radius:10px;
          background:#fff; border:1px dashed #cbd5e1; font-size:14px; line-height:1.6; }
  .note:empty::before { content:attr(data-placeholder); color:#9ca3af; }
  .note:focus { outline:2px solid var(--tone); outline-offset:1px; }

  table { width:100%; border-collapse:collapse; font-size:13.5px; }
  th { text-align:left; font-size:10.5px; text-transform:uppercase; letter-spacing:.08em;
       color:var(--muted); padding:0 10px 9px; border-bottom:1px solid var(--line); }
  th.num, td.num { text-align:right; font-variant-numeric:tabular-nums; }
  td { padding:11px 10px; border-bottom:1px solid #f1f3f8; vertical-align:top; }
  td strong { display:block; color:var(--navy); }
  .muted { color:var(--muted); font-size:12px; }
  td.bad { color:#d03b3b; font-weight:700; }
  .mono { font-variant-numeric:tabular-nums; color:var(--muted); }
  .pill { display:inline-block; padding:2px 9px; border-radius:999px; background:#eef2f9;
          color:var(--navy); font-size:11.5px; font-weight:700; }

  footer { padding:22px 48px 38px; font-size:11.5px; color:var(--muted); }
  .hint { max-width:940px; margin:16px auto; padding:11px 16px; border-radius:10px;
          background:#fff7d6; border:1px solid #f5d98a; font-size:13px; color:#7a5c05; }

  @media print {
    body { background:#fff; }
    .hint { display:none; }
    .note { border-color:#e5e7eb; }
    section.block, .finding, table { break-inside:avoid; }
    header { break-after:avoid; }
  }
</style></head>
<body>
<p class="hint">Click any dashed box to type your reading of the finding, then Print → Save as PDF. This file never leaves your machine.</p>

<div class="page">
  <header>
    <div class="logo"><b>CC</b><span>Cleaning</span><span>Connected</span></div>
    <h1>Operations report</h1>
    <p class="meta">${esc(period)} · prepared by ${esc(preparedBy)} · ${esc(generatedAt)}</p>
    <div class="hero">
      <span class="hero-value">${esc(formatHours(stats.totalMinutes))}</span>
      <span class="hero-label">of crew time on site across ${stats.counts.departures} completed job${stats.counts.departures === 1 ? "" : "s"}</span>
    </div>
  </header>

  <section class="block">
    <h2>At a glance</h2>
    <div class="kpis">
      ${kpi("Jobs closed out", stats.counts.departures, `${stats.counts.arrivals} arrivals logged`)}
      ${kpi("Partners active", stats.counts.partners)}
      ${kpi("Average on site", formatHours(stats.averageShift), "per closed job")}
      ${kpi("Invoiced", money(stats.invoiceTotal), `${stats.counts.invoices} invoice${stats.counts.invoices === 1 ? "" : "s"}`)}
      ${kpi("Proposals in", stats.counts.proposals)}
      ${kpi("Recaps filed", stats.counts.recaps)}
      ${kpi("Photos & video", stats.counts.photos, "evidence on file")}
      ${kpi("Reports filed", stats.counts.arrivals + stats.counts.departures)}
    </div>
  </section>

  <section class="block">
    <h2>Activity day by day</h2>
    <p class="lede">Arrivals against jobs closed out. A gap between the two is a job that was started but never reported on.</p>
    ${columnChart({
      categories: stats.daily.categories.map(shortDay),
      series: [
        { name: "Arrivals", color: C.series1, values: stats.daily.arrivals },
        { name: "Jobs closed out", color: C.series2, values: stats.daily.departures },
      ],
    })}
  </section>

  <section class="block">
    <h2>How jobs ended</h2>
    <p class="lede">Every return visit is a second mobilisation nobody billed for.</p>
    ${stackedBar({
      segments: [
        { label: "100% completed", value: stats.outcomes.completed, color: C.series1 },
        { label: "Need to return", value: stats.outcomes.needReturn, color: C.critical },
      ],
    })}
  </section>

  <section class="block">
    <h2>What stood out</h2>
    ${findings}
  </section>

  <section class="block">
    <h2>Time on site by partner</h2>
    <p class="lede">Total crew hours logged through arrival and departure reports.</p>
    ${barChart({ rows: hoursByPartner, color: C.series1, format: formatHours })}
  </section>

  <section class="block">
    <h2>Invoiced by partner</h2>
    ${barChart({ rows: moneyByPartner, color: C.series2, format: money })}
  </section>

  <section class="block">
    <h2>What work is being done</h2>
    <p class="lede">How often each service appeared on a daily report.</p>
    ${barChart({
      rows: stats.serviceMix.map((service) => ({ label: service.name, value: service.count })),
      color: C.series1,
    })}
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
    <h2>By project</h2>
    <table>
      <thead><tr>
        <th>Project</th><th class="num">Partners</th><th class="num">Jobs</th>
        <th class="num">Time on site</th><th class="num">Returns</th><th class="num">Invoiced</th>
      </tr></thead>
      <tbody>${projectRows || `<tr><td colspan="6" class="muted">No projects in this period.</td></tr>`}</tbody>
    </table>
  </section>

  <section class="block">
    <h2>Latest submissions</h2>
    <table>
      <thead><tr>
        <th>Date</th><th>Form</th><th>Partner</th><th>Project</th>
        <th class="num">Files</th><th class="num">Amount</th>
      </tr></thead>
      <tbody>${logRows || `<tr><td colspan="6" class="muted">Nothing filed yet.</td></tr>`}</tbody>
    </table>
  </section>

  <section class="block">
    <h2>Recommendation</h2>
    ${note("What you would do next month…")}
  </section>

  <footer>Cleaning Connected · Trade Partner app · every figure here comes from submissions filed in the app during the period shown.</footer>
</div>
</body></html>`;
}
