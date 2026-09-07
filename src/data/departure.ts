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
