/** Options lifted verbatim from the live "Clean Partner Daily Arrival" Jotform. */
export const CLEANING_TYPES = [
  "Interior Cleaning",
  "Window Cleaning (Inside & Outside)",
  "Window Cleaning (Inside Only)",
  "Window Cleaning (Outside Only)",
  "Floor Scrubbing",
  "Floor Waxing",
  "Ceiling Cleaning",
  "Pressure Washing",
  "Day Labor Cleaning",
  "Zamboni Cleaning",
] as const;

export type ArrivalValues = {
  date: string;
  ppePhoto: File | null;
  projectName: string;
  projectLocation: string;
  projectNumber: string;
  arrivalTime: string;
  currentTime: string;
  cleaners: string;
  ppeOk: string;
  cleaningToday: string[];
  comments: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
};

export const EMPTY_ARRIVAL: ArrivalValues = {
  date: "",
  ppePhoto: null,
  projectName: "",
  projectLocation: "",
  projectNumber: "",
  arrivalTime: "",
  currentTime: "",
  cleaners: "",
  ppeOk: "",
  cleaningToday: [],
  comments: "",
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  email: "",
};
