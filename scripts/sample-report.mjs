/**
 * Renders the report from invented data, so the layout can be checked (and
 * shown off) without waiting for a month of real submissions.
 *
 *   npm run report:sample
 */
import { writeFile } from "node:fs/promises";
import { analyse } from "./lib/analyse.mjs";
import { renderReport } from "./lib/render.mjs";
import { mkdir } from "node:fs/promises";

const at = (d, h = 10) => `2026-09-${String(d).padStart(2, "0")}T${String(h).padStart(2, "0")}:00:00Z`;
const files = (field, n) => Array.from({ length: n }, () => ({ field }));
const sub = (o) => ({ files: [], payload: {}, ...o });

const partners = [
  ["Miguel Ortiz", "Ortiz Clean Co"],
  ["Dana Brooks", "BrightWorks Facility"],
  ["Sam Reid", "Reid Facility Services"],
  ["Priya Nair", "Summit Janitorial"],
];
const projects = [
  ["Riverview Tower", "77"],
  ["Cedar Plaza", "81"],
  ["Northgate Logistics", "94"],
];
const services = ["General Cleaning", "Window Cleaning (Inside)", "Floor Machine Scrub",
  "Pressure Washing", "Ceiling Cleaning", "Floor Wax", "Office/Site Trailer Cleaning"];

const rows = [];
let day = 1;
for (let i = 0; i < 14; i++) {
  const [name, company] = partners[i % partners.length];
  const [project, number] = projects[i % projects.length];
  day = 1 + ((i * 2) % 26);
  const complete = i % 4 !== 0;

  rows.push(sub({ created_at: at(day, 7), form: "arrival", partner_name: name, partner_company: company,
    project_name: project, project_number: number, files: files("ppePhoto", 1),
    payload: { ppeOk: i === 5 ? "No" : "Yes", cleaningToday: services.slice(i % 3, (i % 3) + 2) } }));

  if (i !== 3) {
    rows.push(sub({ created_at: at(day, 17), form: "departure", partner_name: name, partner_company: company,
      project_name: project, project_number: number,
      files: [...files("completedMedia", 2 + (i % 3)), ...files("actionPhotos", i === 6 ? 1 : 2 + (i % 4))],
      payload: { startTime: "07:30 AM", finishTime: `0${3 + (i % 4)}:${i % 2 ? "15" : "45"} PM`,
        ppeOk: "Yes", status: complete ? "100% Completed" : "Need to Return",
        activities: services.slice(i % 4, (i % 4) + 3) } }));
  }
}
[["Miguel Ortiz", "Ortiz Clean Co", 4800, 6], ["Dana Brooks", "BrightWorks Facility", 2250, 12],
 ["Sam Reid", "Reid Facility Services", 6400, 19], ["Priya Nair", "Summit Janitorial", 1875, 24]]
  .forEach(([name, company, amount, d], i) =>
    rows.push(sub({ created_at: at(d, 12), form: "invoice", partner_name: name, partner_company: company,
      project_name: projects[i % 3][0], project_number: projects[i % 3][1], amount })));

rows.push(sub({ created_at: at(21, 9), form: "proposal", partner_name: "Priya Nair",
  partner_company: "Summit Janitorial", project_name: "Northgate Logistics", amount: 9100 }));
rows.push(sub({ created_at: at(26, 9), form: "recap", partner_name: "Dana Brooks",
  partner_company: "BrightWorks Facility", project_name: "Cedar Plaza", amount: 2250 }));

rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
const stats = analyse(rows);
await mkdir("reports", { recursive: true });
await writeFile("reports/SAMPLE-fake-data.html",
  renderReport({ period: "September 2026", generatedAt: "8 September 2026",
    preparedBy: "Nishi Kanta Paul", stats }), "utf8");
console.log(`${rows.length} rows · ${stats.findings.length} findings · ${stats.projects.length} projects · ${stats.partners.length} partners`);
