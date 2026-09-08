import { SUBMISSION_BUCKET, supabase } from "./supabase";

export type FormKey = "proposal" | "arrival" | "departure" | "recap" | "invoice";

type StoredFile = {
  field: string;
  name: string;
  path: string;
  size: number;
  type: string;
};

/**
 * Splits a form's values into JSON-safe data and the files hiding inside it,
 * so the row stays readable and the media goes to storage.
 */
function separateFiles(values: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  const files: { field: string; file: File }[] = [];

  for (const [key, value] of Object.entries(values)) {
    if (value instanceof File) {
      files.push({ field: key, file: value });
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((v) => v instanceof File)
    ) {
      (value as File[]).forEach((file) => files.push({ field: key, file }));
    } else {
      data[key] = value;
    }
  }
  return { data, files };
}

/** The money field is named differently on every form. */
function amountOf(form: FormKey, values: Record<string, unknown>) {
  const raw = String(
    (form === "proposal" && values.price) ||
      (form === "recap" && values.totalValue) ||
      (form === "invoice" && values.billingAmount) ||
      "",
  ).replace(/[^0-9.]/g, "");
  return raw ? Number(raw) : null;
}

/**
 * Columns worth querying without digging through the JSON — this is what the
 * office report and the future dashboard are built from.
 */
function summarise(form: FormKey, values: Record<string, unknown>) {
  const text = (key: string) => (values[key] ? String(values[key]).trim() : null);
  const name = `${values.firstName ?? ""} ${values.lastName ?? ""}`.trim();

  return {
    partner_name: name || null,
    partner_company: text("company"),
    partner_email: text("email"),
    partner_phone: text("phone"),
    project_name: text("projectName"),
    project_number: text("projectNumber"),
    amount: amountOf(form, values),
    status: text("status"),
  };
}

/**
 * Keeps our own record of a submission: media into storage, everything else
 * into one row. Files are uploaded first so the row lands complete — that way
 * the database only ever needs an insert policy, never an update.
 */
export async function archiveSubmission(
  form: FormKey,
  jotformId: string,
  values: Record<string, unknown>,
) {
  if (!supabase) return;

  const id = crypto.randomUUID();
  const { data, files } = separateFiles(values);

  const stored: StoredFile[] = [];
  for (const [index, { field, file }] of files.entries()) {
    const path = `${form}/${id}/${field}-${index}-${file.name}`;
    const { error } = await supabase.storage
      .from(SUBMISSION_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    stored.push({ field, name: file.name, path, size: file.size, type: file.type });
  }

  const { error } = await supabase.from("submissions").insert({
    id,
    form,
    jotform_id: jotformId,
    ...summarise(form, values),
    payload: data,
    files: stored,
  });
  if (error) throw error;
}
