import {
  JOTFORM_IDS,
  newPayload,
  put,
  putAddress,
  putDate,
  putName,
  putPhone,
} from "@/lib/jotform";

export type RecapValues = {
  date: string;
  projectName: string;
  projectNumber: string;
  projectCity: string;
  projectState: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
  startDate: string;
  completedDate: string;
  daysWorked: string;
  description: string;
  issues: string;
  totalValue: string;
  comments: string;
};

export const EMPTY_RECAP: RecapValues = {
  date: "",
  projectName: "",
  projectNumber: "",
  projectCity: "",
  projectState: "",
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  email: "",
  startDate: "",
  completedDate: "",
  daysWorked: "",
  description: "",
  issues: "",
  totalValue: "",
  comments: "",
};

/** Field names read from the live form's HTML — see `src/lib/jotform.ts`. */
export function recapPayload(v: RecapValues) {
  const data = newPayload(JOTFORM_IDS.recap);

  putDate(data, "q25_date", v.date);
  put(data, "q6_textbox_6", v.projectName);
  put(data, "q26_projectNumber", v.projectNumber);
  putAddress(data, "q29_projectCity", { city: v.projectCity, state: v.projectState });

  putName(data, "q27_yourName", v.firstName, v.lastName);
  put(data, "q2_textbox_2", v.company);
  putPhone(data, "q23_phoneNumber", v.phone);
  put(data, "q28_email", v.email);

  putDate(data, "q8_datetime_8", v.startDate);
  putDate(data, "q9_datetime_9", v.completedDate);
  put(data, "q30_totalNumber", v.daysWorked);
  put(data, "q31_describeIn", v.description);
  put(data, "q13_textarea_13", v.issues);
  put(data, "q32_totalValue", v.totalValue);
  put(data, "q33_anyAdditional", v.comments);
  return data;
}
