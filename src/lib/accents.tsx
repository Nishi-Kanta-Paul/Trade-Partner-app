/**
 * Each job stage carries its own colour the whole way through — the home
 * section, the rows inside it, and the form screen it opens. A partner learns
 * "amber means I'm on site" without reading a word.
 *
 * Class strings are written out in full so Tailwind can see them.
 */
import * as React from "react";

export type Accent = "sky" | "amber" | "emerald" | "violet";

type AccentStyle = {
  /** Numbered badge on a section header. */
  badge: string;
  /** Icon tile inside an action row. */
  tile: string;
  /** Card border on hover. */
  cardHover: string;
  /** Meta pill on an action row. */
  pill: string;
  /** Header bar on a form screen. */
  header: string;
  /** Filled progress / step dots. */
  fill: string;
  /** Primary button. */
  button: string;
  /** Soft tinted surface (hints, "use current time"). */
  soft: string;
  /** Stage tab on the hero. */
  tab: string;
  /** A chosen option card. */
  selected: string;
  /** The filled radio dot / checkbox box. */
  check: string;
  /** Focus ring on a text input. */
  focus: string;
};

export const ACCENTS: Record<Accent, AccentStyle> = {
  sky: {
    badge: "bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-500/30",
    tile: "bg-sky-100 text-sky-700 group-hover:bg-gradient-to-br group-hover:from-sky-400 group-hover:to-blue-600 group-hover:text-white dark:bg-sky-500/15 dark:text-sky-300",
    cardHover: "hover:border-sky-300 dark:hover:border-sky-400/40",
    pill: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    header: "bg-gradient-to-r from-blue-700 to-sky-600",
    fill: "bg-gradient-to-r from-sky-400 to-blue-600",
    button:
      "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500",
    soft: "bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-500/15 dark:text-sky-300",
    tab: "bg-gradient-to-br from-sky-400 to-blue-600 ring-white/25 shadow-lg shadow-sky-900/40",
    selected:
      "border-sky-500 bg-sky-50 text-navy ring-1 ring-sky-500 dark:border-sky-400 dark:bg-sky-500/10 dark:text-white dark:ring-sky-400",
    check: "border-sky-500 bg-sky-500 dark:border-sky-400 dark:bg-sky-400",
    focus: "focus:border-sky-500 focus:ring-sky-500/20 dark:focus:border-sky-400",
  },
  amber: {
    badge:
      "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30",
    tile: "bg-amber-100 text-amber-700 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-white dark:bg-amber-500/15 dark:text-amber-300",
    cardHover: "hover:border-amber-300 dark:hover:border-amber-400/40",
    pill: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    header: "bg-gradient-to-r from-orange-600 to-amber-500",
    fill: "bg-gradient-to-r from-amber-400 to-orange-500",
    button:
      "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400",
    soft: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300",
    tab: "bg-gradient-to-br from-amber-400 to-orange-500 ring-white/25 shadow-lg shadow-orange-900/40",
    selected:
      "border-amber-500 bg-amber-50 text-navy ring-1 ring-amber-500 dark:border-amber-400 dark:bg-amber-500/10 dark:text-white dark:ring-amber-400",
    check: "border-amber-500 bg-amber-500 dark:border-amber-400 dark:bg-amber-400",
    focus: "focus:border-amber-500 focus:ring-amber-500/20 dark:focus:border-amber-400",
  },
  emerald: {
    badge:
      "bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-emerald-500/30",
    tile: "bg-emerald-100 text-emerald-700 group-hover:bg-gradient-to-br group-hover:from-emerald-400 group-hover:to-teal-600 group-hover:text-white dark:bg-emerald-500/15 dark:text-emerald-300",
    cardHover: "hover:border-emerald-300 dark:hover:border-emerald-400/40",
    pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
    header: "bg-gradient-to-r from-teal-700 to-emerald-600",
    fill: "bg-gradient-to-r from-emerald-400 to-teal-600",
    button:
      "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500",
    soft: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300",
    tab: "bg-gradient-to-br from-emerald-400 to-teal-600 ring-white/25 shadow-lg shadow-teal-900/40",
    selected:
      "border-emerald-500 bg-emerald-50 text-navy ring-1 ring-emerald-500 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-white dark:ring-emerald-400",
    check:
      "border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400",
    focus:
      "focus:border-emerald-500 focus:ring-emerald-500/20 dark:focus:border-emerald-400",
  },
  violet: {
    badge:
      "bg-gradient-to-br from-violet-400 to-fuchsia-600 text-white shadow-violet-500/30",
    tile: "bg-violet-100 text-violet-700 group-hover:bg-gradient-to-br group-hover:from-violet-400 group-hover:to-fuchsia-600 group-hover:text-white dark:bg-violet-500/15 dark:text-violet-300",
    cardHover: "hover:border-violet-300 dark:hover:border-violet-400/40",
    pill: "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
    header: "bg-gradient-to-r from-violet-700 to-fuchsia-600",
    fill: "bg-gradient-to-r from-violet-400 to-fuchsia-600",
    button:
      "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-400 hover:to-fuchsia-500",
    soft: "bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-500/15 dark:text-violet-300",
    tab: "bg-gradient-to-br from-violet-400 to-fuchsia-600 ring-white/25 shadow-lg shadow-fuchsia-900/40",
    selected:
      "border-violet-500 bg-violet-50 text-navy ring-1 ring-violet-500 dark:border-violet-400 dark:bg-violet-500/10 dark:text-white dark:ring-violet-400",
    check: "border-violet-500 bg-violet-500 dark:border-violet-400 dark:bg-violet-400",
    focus:
      "focus:border-violet-500 focus:ring-violet-500/20 dark:focus:border-violet-400",
  },
};

/**
 * The stage colour for everything below it. Set once per screen so inputs,
 * choices and uploads pick it up without every call site passing a prop.
 */
const AccentContext = React.createContext<Accent>("sky");

export function AccentProvider({
  accent,
  children,
}: {
  accent: Accent;
  children: React.ReactNode;
}) {
  return <AccentContext value={accent}>{children}</AccentContext>;
}

export function useAccent() {
  return ACCENTS[React.use(AccentContext)];
}
