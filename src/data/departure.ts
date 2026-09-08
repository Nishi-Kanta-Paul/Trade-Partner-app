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

/** Options lifted verbatim from the live "Cleaning Partner Departure" Jotform. */
export const ACTIVITIES = [
  "General Cleaning",
  "Window Cleaning (Outside)",
  "Window Cleaning (Inside)",
  "Pressure Washing",
  "Ceiling Cleaning",
  "Floor Machine Scrub",
  "Floor Wax",
  "Office/Site Trailer Cleaning",
  "Zamboni Cleaning",
] as const;

export const STATUSES = ["100% Completed", "Need to Return"] as const;

/** Where partners send media if the upload fails on site. */
export const UPLOAD_FALLBACK_EMAIL = "Ankita@CleaningConnected.com";

export type DepartureValues = {
  date: string;
  cleaningDate: string;
  projectName: string;
  projectNumber: string;
  projectCity: string;
  completedMedia: File[];
  actionPhotos: File[];
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  activities: string[];
  details: string;
  cleaners: string;
  startTime: string;
  finishTime: string;
  ppeOk: string;
  status: string;
  comments: string;
};

export const EMPTY_DEPARTURE: DepartureValues = {
  date: "",
  cleaningDate: "",
  projectName: "",
  projectNumber: "",
  projectCity: "",
  completedMedia: [],
  actionPhotos: [],
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  activities: [],
  details: "",
  cleaners: "",
  startTime: "",
  finishTime: "",
  ppeOk: "",
  status: "",
  comments: "",
};

/** Field names read from the live form's HTML — see `src/lib/jotform.ts`. */
export function departurePayload(v: DepartureValues) {
  const data = newPayload(JOTFORM_IDS.departure);

  putDate(data, "q3_todaysDate", v.date);
  putDate(data, "q4_todaysDaye4", v.cleaningDate);
  put(data, "q5_projectName", v.projectName);
  put(data, "q6_projectNumber", v.projectNumber);
  put(data, "q7_projectCity", v.projectCity);

  putFiles(data, "q22_uploadPhotos", v.completedMedia);
  putFiles(data, "q23_uploadOnly23", v.actionPhotos);

  putChoices(data, "q8_selectAll", v.activities);
  put(data, "q9_inDetails", v.details);
  put(data, "q11_numberOf", v.cleaners);
  putTime(data, "q10_timeYou", v.startTime);
  putTime(data, "q12_timeYou12", v.finishTime);
  put(data, "q15_didAll", v.ppeOk);
  put(data, "q14_currentCleaning", v.status);
  put(data, "q25_anyAdditional", v.comments);

  putName(data, "q18_name", v.firstName, v.lastName);
  put(data, "q19_companyName", v.company);
  put(data, "q21_email", v.email);
  putPhone(data, "q24_phoneNumber", v.phone);
  return data;
}
