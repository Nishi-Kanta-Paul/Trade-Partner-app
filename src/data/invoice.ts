import {
  JOTFORM_IDS,
  newPayload,
  put,
  putAddress,
  putChoices,
  putDate,
} from "@/lib/jotform";

/** Options lifted verbatim from the live "Partner Invoice" Jotform. */
export const SERVICES_PROVIDED = [
  "Job Walk Agent",
  "Project Manager",
  "Day Labor",
  "Took Photos",
  "Phone Caller",
  "General Cleaning",
  "Window Cleaning",
  "Pressure Washing",
  "Floor Scrub / Wax",
] as const;

export const PAYMENT_METHODS = ["CashApp", "Venmo", "Check", "ACH Wire"] as const;

/**
 * The Jotform asks for a "Payment Username" whatever the method — which reads
 * wrong for a cheque or a wire. Same field, wording that matches the choice.
 */
export const PAYMENT_DETAIL: Record<
  string,
  { label: string; hint: string; placeholder: string }
> = {
  CashApp: {
    label: "Your $Cashtag",
    hint: "The tag payments are sent to.",
    placeholder: "$yourcashtag",
  },
  Venmo: {
    label: "Your Venmo username",
    hint: "Including the @.",
    placeholder: "@your-venmo",
  },
  Check: {
    label: "Make the check payable to",
    hint: "Exactly as it should appear on the cheque.",
    placeholder: "Business or personal name",
  },
  "ACH Wire": {
    label: "Account holder name",
    hint: "The office will contact you for the account details securely.",
    placeholder: "Name on the account",
  },
};

/** Where invoice questions go. */
export const INVOICE_CONTACT_EMAIL = "Partners@CleaningConnected.com";

export type InvoiceValues = {
  date: string;
  projectName: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  billingAmount: string;
  services: string[];
  serviceStart: string;
  serviceEnd: string;
  paymentMethod: string;
  paymentDetail: string;
  billingNotes: string;
};

export const EMPTY_INVOICE: InvoiceValues = {
  date: "",
  projectName: "",
  street: "",
  street2: "",
  city: "",
  state: "",
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  billingAmount: "",
  services: [],
  serviceStart: "",
  serviceEnd: "",
  paymentMethod: "",
  paymentDetail: "",
  billingNotes: "",
};

/**
 * Field names read from the live form's HTML — see `src/lib/jotform.ts`.
 * Note this form takes the name as one plain textbox, not a first/last pair.
 */
export function invoicePayload(v: InvoiceValues) {
  const data = newPayload(JOTFORM_IDS.invoice);

  putDate(data, "q2_datetime_2", v.date);
  put(data, "q4_textbox_4", v.projectName);
  putAddress(data, "q18_projectAddress", {
    line1: v.street,
    line2: v.street2,
    city: v.city,
    state: v.state,
  });

  put(data, "q6_textbox_6", `${v.firstName} ${v.lastName}`.trim());
  put(data, "q7_textbox_7", v.company);
  put(data, "q8_textbox_8", v.email);
  put(data, "q9_textbox_9", v.phone);

  put(data, "q10_textbox_10", v.billingAmount);
  putChoices(data, "q11_checkbox_11", v.services);
  putDate(data, "q12_datetime_12", v.serviceStart);
  putDate(data, "q13_datetime_13", v.serviceEnd);
  put(data, "q14_radio_14", v.paymentMethod);
  put(data, "q15_textbox_15", v.paymentDetail);
  put(data, "q16_textarea_16", v.billingNotes);
  return data;
}
