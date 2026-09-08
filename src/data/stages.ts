import type { Accent } from "@/lib/accents";

export type ActionKind =
  "video" | "form" | "call" | "location" | "photos" | "confirm" | "invoice" | "tax";

export type Action = {
  label: string;
  /** Short line under the label — what the partner actually has to do. */
  hint: string;
  kind: ActionKind;
  href: string;
  /** Shown as a pill on the right, e.g. "2 min", "Yearly". */
  meta?: string;
};

export type Stage = {
  id: string;
  index: number;
  title: string;
  tab: string;
  blurb: string;
  /** Colour this stage owns everywhere it appears. */
  accent: Accent;
  actions: Action[];
};

/**
 * The whole day, in order. An `href` of "#" is a screen not built yet — the row
 * shows, it just has nowhere to go.
 */
export const STAGES: Stage[] = [
  {
    id: "before",
    index: 1,
    title: "Before Cleaning",
    tab: "Before",
    blurb: "Get briefed and get the job approved.",
    accent: "sky",
    actions: [
      {
        label: "How this app works",
        hint: "Start here on your first job",
        kind: "video",
        href: "/video/FnU6hSU0jPk",
        meta: "Watch",
      },
      {
        label: "Partner Project Proposal Form",
        hint: "Send your scope and pricing",
        kind: "form",
        href: "/proposal",
      },
      {
        label: "Before cleaning starts video call",
        hint: "Walk the site with the office",
        kind: "call",
        href: "#",
      },
      {
        label: "What we expect on site",
        hint: "Standards, uniform, conduct",
        kind: "video",
        href: "#",
        meta: "Watch",
      },
    ],
  },
  {
    id: "during",
    index: 2,
    title: "During Cleaning",
    tab: "During",
    blurb: "Check in, show the work, check out.",
    accent: "amber",
    actions: [
      {
        label: "Complete Arrival Form",
        hint: "As soon as you reach the site",
        kind: "location",
        href: "/arrival",
      },
      {
        label: "Submit Action Photos",
        hint: "Before, progress and after shots",
        kind: "photos",
        href: "#",
      },
      {
        label: "Complete Departure Form",
        hint: "Before you leave the property",
        kind: "confirm",
        href: "/departure",
      },
    ],
  },
  {
    id: "after",
    index: 3,
    title: "After Cleaning",
    tab: "After",
    blurb: "Wrap up the job and get paid.",
    accent: "emerald",
    actions: [
      {
        label: "Partner Recap Form",
        hint: "Summarise how the job went",
        kind: "form",
        href: "/recap",
      },
      {
        label: "Partner Invoice Form",
        hint: "Bill for completed work",
        kind: "invoice",
        href: "/invoice",
      },
      {
        label: "Partner W9",
        hint: "Tax details for payouts",
        kind: "tax",
        href: "#",
        meta: "Yearly",
      },
    ],
  },
];
