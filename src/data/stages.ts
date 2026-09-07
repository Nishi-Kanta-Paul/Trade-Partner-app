import type { Accent } from "@/lib/accents";

export type ActionKind =
  | "video"
  | "form"
  | "call"
  | "location"
  | "photos"
  | "confirm"
  | "invoice"
  | "tax";

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
 * ROLLOUT CONTROL — the client is shown one piece at a time.
 *
 * Everything below is commented out. To reveal the next piece, uncomment the
 * next REVEAL block (and, inside an already-revealed stage, strip the extra
 * leading `//` from its nested block). Nothing else needs touching: both the
 * home sections and the hero's stage tabs are driven by this array.
 */
export const STAGES: Stage[] = [
  // ══════════ REVEAL 1 · "Before Cleaning" + its first two actions ══════════
  // {
  //   id: "before",
  //   index: 1,
  //   title: "Before Cleaning",
  //   tab: "Before",
  //   blurb: "Get briefed and get the job approved.",
  //   accent: "sky",
  //   actions: [
  //     {
  //       label: "How this app works",
  //       hint: "Start here on your first job",
  //       kind: "video",
  //       href: "/video/FnU6hSU0jPk",
  //       meta: "Watch",
  //     },
  //     {
  //       label: "Partner Project Proposal Form",
  //       hint: "Send your scope and pricing",
  //       kind: "form",
  //       href: "/proposal",
  //     },
  //
  //     // ───────── REVEAL 2 · the remaining two "Before" actions ─────────
  //     // {
  //     //   label: "Before cleaning starts video call",
  //     //   hint: "Walk the site with the office",
  //     //   kind: "call",
  //     //   href: "#",
  //     // },
  //     // {
  //     //   label: "What we expect on site",
  //     //   hint: "Standards, uniform, conduct",
  //     //   kind: "video",
  //     //   href: "#",
  //     //   meta: "Watch",
  //     // },
  //   ],
  // },

  // ══════════ REVEAL 3 · "During Cleaning" + its first two actions ══════════
  // {
  //   id: "during",
  //   index: 2,
  //   title: "During Cleaning",
  //   tab: "During",
  //   blurb: "Check in, show the work, check out.",
  //   accent: "amber",
  //   actions: [
  //     {
  //       label: "Complete Arrival Form",
  //       hint: "As soon as you reach the site",
  //       kind: "location",
  //       href: "/arrival",
  //     },
  //     {
  //       label: "Submit Action Photos",
  //       hint: "Before, progress and after shots",
  //       kind: "photos",
  //       href: "#",
  //     },
  //
  //     // ───────── REVEAL 4 · the last "During" action ─────────
  //     // {
  //     //   label: "Complete Departure Form",
  //     //   hint: "Before you leave the property",
  //     //   kind: "confirm",
  //     //   href: "/departure",
  //     // },
  //   ],
  // },

  // ══════════ REVEAL 5 · "After Cleaning" + its first two actions ══════════
  // {
  //   id: "after",
  //   index: 3,
  //   title: "After Cleaning",
  //   tab: "After",
  //   blurb: "Wrap up the job and get paid.",
  //   accent: "emerald",
  //   actions: [
  //     {
  //       label: "Partner Recap Form",
  //       hint: "Summarise how the job went",
  //       kind: "form",
  //       href: "/recap",
  //     },
  //     {
  //       label: "Partner Invoice Form",
  //       hint: "Bill for completed work",
  //       kind: "invoice",
  //       href: "/invoice",
  //     },
  //
  //     // ───────── REVEAL 6 · the last "After" action ─────────
  //     // {
  //     //   label: "Partner W9",
  //     //   hint: "Tax details for payouts",
  //     //   kind: "tax",
  //     //   href: "#",
  //     //   meta: "Yearly",
  //     // },
  //   ],
  // },
];
