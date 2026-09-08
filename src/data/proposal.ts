import {
  JOTFORM_IDS,
  newPayload,
  put,
  putAddress,
  putChoices,
  putDate,
  putName,
  putPhone,
} from "@/lib/jotform";

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

/** Field names read from the live form's HTML — see `src/lib/jotform.ts`. */
export function proposalPayload(v: ProposalValues) {
  const data = newPayload(JOTFORM_IDS.proposal);

  putDate(data, "q3_todaysDate", String(v.date));
  put(data, "q4_opportunity", String(v.opportunityNumber));
  put(data, "q23_typeOf", String(v.opportunityType));

  putName(data, "q5_yourName", String(v.firstName), String(v.lastName));
  put(data, "q6_yourCompany", String(v.company));
  putPhone(data, "q7_yourPhone", String(v.phone));
  put(data, "q8_isIt", String(v.smsOk));
  put(data, "q9_yourEmail", String(v.email));
  putAddress(data, "q35_yourCity", {
    city: String(v.yourCity),
    state: String(v.yourState),
  });

  putAddress(data, "q27_opportunityLocation", {
    city: String(v.jobCity),
    state: String(v.jobState),
  });
  put(data, "q17_numberOf17", String(v.miles));
  putChoices(data, "q37_selectAll", v.services as string[]);
  put(data, "q38_inYour", String(v.scope));
  put(data, "q39_totalPrice", String(v.price));

  put(data, "q13_equipmentampamp", String(v.equipment));
  put(data, "q36_waterYou", String(v.water));
  put(data, "q18_businessRelationship", String(v.businessRelationship));
  put(data, "q28_indemnifcationampamp", String(v.indemnification));
  put(data, "q29_youHave29", String(v.paymentTerms));
  put(data, "q30_youHave30", String(v.projectReports));
  put(data, "q33_youHave33", String(v.projectCommunication));
  put(data, "q21_youWill21", String(v.ppe));
  put(data, "q34_youFully", String(v.scopeUnderstood));

  put(data, "q20_anyAdditional", String(v.comments));
  return data;
}
