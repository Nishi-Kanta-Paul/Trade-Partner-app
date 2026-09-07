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
