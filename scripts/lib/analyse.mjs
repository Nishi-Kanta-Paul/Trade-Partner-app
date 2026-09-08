/**
 * Turns raw submissions into the numbers and observations that go in the
 * monthly report. Kept separate from rendering so the findings can be checked
 * on their own.
 */

/** "09:30 AM" → minutes since midnight, or null. */
export function clockToMinutes(value = "") {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(value).trim());
  if (!match) return null;
  const [, hour, minute, meridiem] = match;
  const hours = (Number(hour) % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0);
  return hours * 60 + Number(minute);
}

/** Minutes between two clock strings, wrapping past midnight. */
export function shiftMinutes(start, finish) {
  const from = clockToMinutes(start);
  const to = clockToMinutes(finish);
  if (from === null || to === null) return null;
  return (to - from + 1440) % 1440;
}

export function formatHours(minutes) {
  if (minutes === null || Number.isNaN(minutes)) return "—";
  return `${Math.floor(minutes / 60)}h ${String(Math.round(minutes % 60)).padStart(2, "0")}m`;
}

export function money(value) {
  return value == null
    ? "—"
    : `$${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

const dayOf = (row) => String(row.created_at).slice(0, 10);
const who = (row) => row.partner_name || row.partner_company || "Unknown partner";
const filesOf = (row, field) =>
  (row.files ?? []).filter((file) => !field || file.field === field);

export function analyse(rows) {
  const by = (form) => rows.filter((row) => row.form === form);

  const arrivals = by("arrival");
  const departures = by("departure");
  const invoices = by("invoice");
  const proposals = by("proposal");
  const recaps = by("recap");

  const shifts = departures
    .map((row) => shiftMinutes(row.payload?.startTime, row.payload?.finishTime))
    .filter((minutes) => minutes !== null);
  const totalMinutes = shifts.reduce((sum, minutes) => sum + minutes, 0);

  const invoiceTotal = invoices.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

  const partners = new Map();
  for (const row of rows) {
    const key = who(row);
    const entry = partners.get(key) ?? {
      name: key,
      company: row.partner_company || "",
      arrivals: 0,
      departures: 0,
      minutes: 0,
      photos: 0,
      invoiced: 0,
      ppeFails: 0,
    };
    if (row.form === "arrival") entry.arrivals += 1;
    if (row.form === "departure") {
      entry.departures += 1;
      const minutes = shiftMinutes(row.payload?.startTime, row.payload?.finishTime);
      if (minutes !== null) entry.minutes += minutes;
    }
    if (row.form === "invoice") entry.invoiced += Number(row.amount) || 0;
    if (row.payload?.ppeOk === "No") entry.ppeFails += 1;
    entry.photos += filesOf(row).length;
    entry.company ||= row.partner_company || "";
    partners.set(key, entry);
  }

  return {
    daily: daily(rows, arrivals, departures),
    outcomes: outcomes(departures),
    serviceMix: serviceMix(rows),
    projects: projects(rows, departures, invoices),
    log: [...rows].reverse().slice(0, 12),
    counts: {
      arrivals: arrivals.length,
      departures: departures.length,
      invoices: invoices.length,
      proposals: proposals.length,
      recaps: recaps.length,
      partners: partners.size,
      photos: rows.reduce((sum, row) => sum + filesOf(row).length, 0),
    },
    totalMinutes,
    averageShift: shifts.length ? totalMinutes / shifts.length : null,
    invoiceTotal,
    partners: [...partners.values()].sort((a, b) => b.departures - a.departures),
    findings: findings({ rows, arrivals, departures, invoices }),
  };
}

/** One column per day in the period, even the quiet ones. */
function daily(rows, arrivals, departures) {
  if (!rows.length) return { categories: [], arrivals: [], departures: [] };

  const days = [...new Set(rows.map(dayOf))].sort();
  const first = new Date(days[0]);
  const last = new Date(days[days.length - 1]);
  const categories = [];
  for (let d = new Date(first); d <= last; d.setUTCDate(d.getUTCDate() + 1)) {
    categories.push(d.toISOString().slice(0, 10));
  }

  const count = (list, day) => list.filter((row) => dayOf(row) === day).length;
  return {
    categories,
    arrivals: categories.map((day) => count(arrivals, day)),
    departures: categories.map((day) => count(departures, day)),
  };
}

/** How jobs ended — the shape of a whole. */
function outcomes(departures) {
  const completed = departures.filter(
    (row) => row.payload?.status === "100% Completed",
  ).length;
  return { completed, needReturn: departures.length - completed };
}

/** Which work is actually being done, across both daily forms. */
function serviceMix(rows) {
  const tally = new Map();
  for (const row of rows) {
    const list = row.payload?.activities ?? row.payload?.cleaningToday ?? [];
    for (const name of list) tally.set(name, (tally.get(name) ?? 0) + 1);
  }
  return [...tally.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

/** Per-project rollup — where the time and the money went. */
function projects(rows, departures, invoices) {
  const map = new Map();
  const key = (row) => row.project_name || row.project_number || "Unknown project";

  for (const row of rows) {
    const entry = map.get(key(row)) ?? {
      name: key(row),
      number: row.project_number || "",
      jobs: 0,
      minutes: 0,
      returns: 0,
      invoiced: 0,
      partners: new Set(),
    };
    if (row.partner_name) entry.partners.add(row.partner_name);
    entry.number ||= row.project_number || "";
    map.set(key(row), entry);
  }

  for (const row of departures) {
    const entry = map.get(key(row));
    entry.jobs += 1;
    const minutes = shiftMinutes(row.payload?.startTime, row.payload?.finishTime);
    if (minutes !== null) entry.minutes += minutes;
    if (row.payload?.status === "Need to Return") entry.returns += 1;
  }

  for (const row of invoices) {
    map.get(key(row)).invoiced += Number(row.amount) || 0;
  }

  return [...map.values()]
    .map((entry) => ({ ...entry, partners: entry.partners.size }))
    .sort((a, b) => b.jobs - a.jobs || b.invoiced - a.invoiced);
}

/**
 * Each finding is something worth saying out loud to the office — a number
 * alone is not an insight. `rows` lists the evidence so a question can be
 * answered on the spot.
 */
function findings({ rows, arrivals, departures, invoices }) {
  const found = [];

  // Safety first — a "No" here is the kind of thing that stops a site.
  const ppeFails = rows.filter((row) => row.payload?.ppeOk === "No");
  if (ppeFails.length) {
    found.push({
      severity: "high",
      title: "Crews reported on site without full PPE",
      detail: `${ppeFails.length} submission${ppeFails.length > 1 ? "s" : ""} answered "No" to the PPE check.`,
      rows: ppeFails.map(
        (row) => `${dayOf(row)} · ${who(row)} · ${row.project_name || "no project"}`,
      ),
    });
  }

  // A job that was started but never closed out leaves the office blind.
  const closed = new Set(
    departures.map((row) => `${who(row)}|${row.project_number}|${dayOf(row)}`),
  );
  const unclosed = arrivals.filter(
    (row) => !closed.has(`${who(row)}|${row.project_number}|${dayOf(row)}`),
  );
  if (unclosed.length) {
    found.push({
      severity: "high",
      title: "Arrivals with no departure report",
      detail: `${unclosed.length} job${unclosed.length > 1 ? "s were" : " was"} checked into but never closed out the same day.`,
      rows: unclosed.map(
        (row) => `${dayOf(row)} · ${who(row)} · ${row.project_name || "no project"}`,
      ),
    });
  }

  // Repeat returns usually mean the scope or the crew size was wrong.
  const returns = new Map();
  for (const row of departures) {
    if (row.payload?.status !== "Need to Return") continue;
    const key = row.project_name || row.project_number || "Unknown project";
    returns.set(key, (returns.get(key) ?? 0) + 1);
  }
  const repeats = [...returns.entries()].filter(([, count]) => count > 1);
  if (repeats.length) {
    found.push({
      severity: "medium",
      title: "Projects needing repeat visits",
      detail: "More than one return on the same project — worth checking the scope.",
      rows: repeats.map(([project, count]) => `${project} — ${count} returns`),
    });
  }

  // Documentation is what settles a dispute with a general contractor.
  const thin = departures.filter(
    (row) => filesOf(row, "actionPhotos").length < 2,
  );
  if (thin.length) {
    found.push({
      severity: "medium",
      title: "Daily reports filed with almost no action photos",
      detail: `${thin.length} report${thin.length > 1 ? "s" : ""} had fewer than two action photos — thin evidence if the work is ever questioned.`,
      rows: thin.map(
        (row) =>
          `${dayOf(row)} · ${who(row)} · ${row.project_name || "no project"} · ${filesOf(row, "actionPhotos").length} photo(s)`,
      ),
    });
  }

  // Money sitting still.
  if (invoices.length) {
    const oldest = [...invoices].sort((a, b) => a.created_at.localeCompare(b.created_at))[0];
    const days = Math.round((Date.now() - new Date(oldest.created_at)) / 86_400_000);
    if (days > 21) {
      found.push({
        severity: "medium",
        title: "Invoices sitting for a while",
        detail: `The oldest invoice in this period was submitted ${days} days ago.`,
        rows: [`${dayOf(oldest)} · ${who(oldest)} · ${money(oldest.amount)}`],
      });
    }
  }

  return found;
}

export { dayOf, who, filesOf };
