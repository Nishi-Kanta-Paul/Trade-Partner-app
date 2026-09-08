/**
 * Submits to the Cleaning Connected Jotforms, so the office keeps its existing
 * notifications and submission tables while partners use this app.
 *
 * Field names come from each form's own HTML (`q<id>_<slug>`); the helpers below
 * expand our plain values into the sub-fields Jotform expects.
 */

export const JOTFORM_IDS = {
  proposal: "253067161562051",
  arrival: "253074669782066",
  departure: "253068299572065",
  recap: "253084510160446",
  invoice: "253074984931466",
} as const;

/** Jotform rejects anything larger, per the forms' own upload settings. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ENDPOINT = "https://submit.jotform.com/submit/";

export function newPayload(formId: string) {
  const data = new FormData();
  data.append("formID", formId);
  data.append("simple_spc", formId);
  data.append("submitSource", "form");
  return data;
}

/** Empty values are left out entirely — Jotform treats a missing key as blank. */
export function put(data: FormData, name: string, value: string | undefined) {
  const trimmed = (value ?? "").trim();
  if (trimmed) data.append(name, trimmed);
}

export function putName(data: FormData, name: string, first: string, last: string) {
  put(data, `${name}[first]`, first);
  put(data, `${name}[last]`, last);
}

export function putPhone(data: FormData, name: string, value: string) {
  put(data, `${name}[full]`, value);
}

/** `<input type="date">` gives "YYYY-MM-DD"; Jotform wants three parts. */
export function putDate(data: FormData, name: string, iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return;
  data.append(`${name}[month]`, month);
  data.append(`${name}[day]`, day);
  data.append(`${name}[year]`, year);
}

/** Our TimeInput stores "09:30 AM". Both shapes are sent — Jotform accepts either. */
export function putTime(data: FormData, name: string, clock: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(clock.trim());
  if (!match) return;
  const [, hour, minute, meridiem] = match;
  const hh = hour.padStart(2, "0");
  data.append(`${name}[timeInput]`, `${hh}:${minute}`);
  data.append(`${name}[hourSelect]`, hh);
  data.append(`${name}[minuteSelect]`, minute);
  data.append(`${name}[ampm]`, meridiem.toUpperCase());
}

export function putAddress(
  data: FormData,
  name: string,
  parts: { line1?: string; line2?: string; city?: string; state?: string },
) {
  put(data, `${name}[addr_line1]`, parts.line1);
  put(data, `${name}[addr_line2]`, parts.line2);
  put(data, `${name}[city]`, parts.city);
  put(data, `${name}[state]`, parts.state);
}

/** Checkboxes repeat the same `name[]` key once per selected option. */
export function putChoices(data: FormData, name: string, values: string[]) {
  values.forEach((value) => data.append(`${name}[]`, value));
}

export function putFiles(data: FormData, name: string, files: File[]) {
  files.forEach((file) => data.append(`${name}[]`, file, file.name));
}

/**
 * Posts the payload.
 *
 * `no-cors` is required — Jotform's submit endpoint sends no CORS headers, so
 * the browser will not let us read the reply. The POST itself goes through
 * (multipart/form-data needs no preflight) and a genuine network failure still
 * rejects, which is what we report to the partner.
 */
export async function submitToJotform(formId: string, data: FormData) {
  try {
    await fetch(ENDPOINT + formId, { method: "POST", mode: "no-cors", body: data });
  } catch {
    throw new Error(
      "Could not reach the office. Check your signal and try again — nothing was lost.",
    );
  }
}
