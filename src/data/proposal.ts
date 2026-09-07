/** Options lifted verbatim from the live Jotform so submissions stay comparable. */

export const OPPORTUNITY_TYPES = [
  "Project Quality Control Agent",
  "Job Walk Agent",
  "General Cleaning",
  "Window Cleaning",
  "Floor Seal/Wax",
  "Floor Auto Scrubbing",
  "Pressure Washing",
  "Ceiling Cleaning",
  "Janitorial Services",
  "Day Labor",
] as const;

export const SERVICES = [
  "Project QCA",
  "Job Walk Agent",
  "1X Final Cleaning",
  "2X Cleaning (Rough + Final)",
  "3X Cleaning (Rough + Final + Fluff)",
  "Window & Frame Cleaning (Outside & Inside)",
  "Window & Frame Cleaning (Outside Only)",
  "Window & Frame Cleaning (Inside Only)",
  "Janitorial Services",
  "Pressure Washing",
  "Ceiling Cleaning",
  "Floor Auto Scrub",
  "Floor Scrub & Wax",
  "Zamboni Cleaning",
  "Day Cleaning Labor",
] as const;

export type Agreement = { name: string; title: string; body: string };

/**
 * The nine yes/no confirmations. The long Jotform labels are split into a short
 * title and the explanation so a phone screen is not a wall of bold text.
 */
export const AGREEMENTS: Agreement[] = [
  {
    name: "equipment",
    title: "Equipment & supplies",
    body: "Do you have everything outlined in the Opportunity Announcement? All supplies, PPE and equipment must be provided by you.",
  },
  {
    name: "water",
    title: "Water",
    body: "You agree to provide water for yourself and all team members while working on site as needed.",
  },
  {
    name: "businessRelationship",
    title: "Business relationship",
    body: "This is not an employee opportunity — it is a 1099 business relationship as outlined on the advertisement. Do you understand and agree?",
  },
  {
    name: "indemnification",
    title: "Indemnification & hold harmless",
    body: "You have read the Indemnification and Hold Harmless information on the Opportunity Announcement. Do you understand and agree?",
  },
  {
    name: "paymentTerms",
    title: "Payment terms & information",
    body: "You have read the Invoice & Payment Terms information on the Opportunity Announcement. Do you understand and agree?",
  },
  {
    name: "projectReports",
    title: "Project reports & forms",
    body: "You have read the Project Reports information on the Opportunity Announcement. Do you understand and agree?",
  },
  {
    name: "projectCommunication",
    title: "Project communication",
    body: "You have read the Project Communication information on the Opportunity Announcement. Do you understand and agree?",
  },
  {
    name: "ppe",
    title: "PPE requirements",
    body: "You will be required to wear proper cleaning PPE attire for a construction site as outlined in the Opportunity Announcement. Do you agree?",
  },
  {
    name: "scopeUnderstood",
    title: "Scope of work",
    body: "You fully and completely understand the scope of work outlined on the Opportunity Advertisement, and can fully complete the tasks?",
  },
];

export type ProposalValues = {
  date: string;
  opportunityNumber: string;
  opportunityType: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  smsOk: string;
  email: string;
  yourCity: string;
  yourState: string;
  jobCity: string;
  jobState: string;
  miles: string;
  services: string[];
  scope: string;
  price: string;
  comments: string;
} & Record<string, string | string[]>;

export const EMPTY_PROPOSAL: ProposalValues = {
  date: "",
  opportunityNumber: "",
  opportunityType: "",
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  smsOk: "",
  email: "",
  yourCity: "",
  yourState: "",
  jobCity: "",
  jobState: "",
  miles: "",
  services: [],
  scope: "",
  price: "",
  comments: "",
  ...Object.fromEntries(AGREEMENTS.map((a) => [a.name, ""])),
};
