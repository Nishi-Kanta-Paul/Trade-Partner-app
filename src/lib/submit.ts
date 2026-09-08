import { archiveSubmission, type FormKey } from "./archive";
import { JOTFORM_IDS, submitToJotform } from "./jotform";

/**
 * Where a finished form is filed.
 *
 * - `"jotform"`  — the client's forms only; their office keeps its existing
 *                  emails and submission tables.
 * - `"supabase"` — our own database only; the data is ours to query and report on.
 * - `"both"`     — filed in both places, each independent of the other.
 */
export type SubmitTarget = "jotform" | "supabase" | "both";

/**
 * Change this one value to switch destinations. `VITE_SUBMIT_TARGET` overrides
 * it per environment, so production and a test deploy can differ without a code
 * change.
 */
export const SUBMIT_TARGET: SubmitTarget =
  (import.meta.env.VITE_SUBMIT_TARGET as SubmitTarget) || "supabase";

const wants = (target: SubmitTarget) =>
  SUBMIT_TARGET === "both" || SUBMIT_TARGET === target;

/**
 * Files a finished form at whichever destinations are switched on.
 *
 * Supabase is the gate whenever it is switched on: it is the only destination
 * that can actually confirm it stored the submission, so its failure is the one
 * a partner is asked to retry. Jotform's submit endpoint sends no CORS headers,
 * meaning its reply can never be read — it can only ever be fire-and-forget, so
 * it gates a submission solely when it is the one destination there is.
 */
export async function sendSubmission(
  form: FormKey,
  values: Record<string, unknown>,
  payload: FormData,
) {
  const jotformId = JOTFORM_IDS[form];

  if (wants("supabase")) {
    try {
      await archiveSubmission(form, jotformId, values);
    } catch (cause) {
      console.error(`[archive] ${form} submission failed`, cause);
      throw new Error(
        "Could not send it just now. Check your signal and try again — nothing you typed is lost.",
      );
    }
  }

  if (wants("jotform")) {
    const forwarded = submitToJotform(jotformId, payload);

    // On its own it is the only record, so the partner has to hear about it.
    if (SUBMIT_TARGET === "jotform") {
      await forwarded;
      return;
    }

    // Otherwise our copy is already safe — log it and let the partner get on.
    await forwarded.catch((cause) => {
      console.warn(`[jotform] ${form} submission was not forwarded`, cause);
    });
  }
}
