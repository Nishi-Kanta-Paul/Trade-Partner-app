/**
 * Builds the monthly operations report from our own copy of the submissions.
 *
 * Local only — it needs the Supabase secret key, which must never appear in the
 * app, in Vercel, or in git. Run it from this machine:
 *
 *   npm run report              last 30 days
 *   npm run report -- --month=2026-09
 *   npm run report -- --days=7
 */
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { analyse } from "./lib/analyse.mjs";
import { renderReport } from "./lib/render.mjs";

const url = process.env.VITE_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !secret) {
  console.error(
    "\nMissing credentials. Add to .env.local (this machine only, never Vercel):\n" +
      "  VITE_SUPABASE_URL=https://<project-ref>.supabase.co\n" +
      "  SUPABASE_SECRET_KEY=sb_secret_...   ← Supabase → Settings → API Keys\n",
  );
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => arg.replace(/^--/, "").split("=")),
);

/** Either a named month, or the trailing N days. */
function window() {
  if (args.month) {
    const [year, month] = args.month.split("-").map(Number);
    const from = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(Date.UTC(year, month, 1));
    const label = from.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    return { from, to, label, slug: args.month };
  }

  const days = Number(args.days ?? 30);
  const to = new Date();
  const from = new Date(to.getTime() - days * 86_400_000);
  const fmt = (date) =>
    date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  return {
    from,
    to,
    label: `${fmt(from)} – ${fmt(to)}`,
    slug: `${to.toISOString().slice(0, 10)}-last-${days}d`,
  };
}

const period = window();
const supabase = createClient(url, secret, { auth: { persistSession: false } });

const { data, error } = await supabase
  .from("submissions")
  .select("*")
  .gte("created_at", period.from.toISOString())
  .lt("created_at", period.to.toISOString())
  .order("created_at", { ascending: true });

if (error) {
  console.error("\nCould not read submissions:", error.message, "\n");
  process.exit(1);
}

const stats = analyse(data ?? []);
const html = renderReport({
  period: period.label,
  generatedAt: new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  preparedBy: process.env.REPORT_AUTHOR ?? "Nishi Kanta Paul",
  stats,
});

const file = path.join("reports", `operations-${period.slug}.html`);
await mkdir("reports", { recursive: true });
await writeFile(file, html, "utf8");

console.log(`\n  ${period.label}`);
console.log(`  ${data?.length ?? 0} submissions · ${stats.findings.length} finding(s)`);
console.log(`\n  → ${file}`);
console.log("    Open it, type your notes in the dashed boxes, then Print → Save as PDF.\n");
