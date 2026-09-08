import {
  JOTFORM_IDS,
  newPayload,
  put,
  putChoices,
  putDate,
  putFiles,
  putName,
  putPhone,
  putTime,
} from "@/lib/jotform";

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

/** Field names read from the live form's HTML — see `src/lib/jotform.ts`. */
export function arrivalPayload(v: ArrivalValues) {
  const data = newPayload(JOTFORM_IDS.arrival);

  putDate(data, "q2_todaysDate", v.date);
  if (v.ppePhoto) putFiles(data, "q19_uploadA", [v.ppePhoto]);

  put(data, "q18_projectName18", v.projectName);
  put(data, "q5_projectLocation", v.projectLocation);
  put(data, "q6_projectNumber", v.projectNumber);
  putTime(data, "q17_arrivalTime17", v.arrivalTime);
  putTime(data, "q3_currentTime", v.currentTime);

  put(data, "q7_numberOf", v.cleaners);
  put(data, "q8_doAll", v.ppeOk);
  putChoices(data, "q9_pleaseSelect", v.cleaningToday);
  put(data, "q10_doYou", v.comments);

  putName(data, "q11_yourName", v.firstName, v.lastName);
  put(data, "q12_yourCompany", v.company);
  putPhone(data, "q13_yourPhone", v.phone);
  put(data, "q14_yourEmail", v.email);
  return data;
}
