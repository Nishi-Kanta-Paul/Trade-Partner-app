import { archiveSubmission, type FormKey } from "./archive";
import { JOTFORM_IDS, submitToJotform } from "./jotform";

/**
 * Sends a finished form to both destinations.
 *
 * Jotform is the client's system of record — if it cannot be reached the
 * partner is told and can retry. Our own archive is a second copy for
 * reporting and for the day a form is deleted or rebuilt on their side; it is
 * retried once, then given up on rather than blocking someone who is standing
 * on a site with a job to finish.
 */
export async function sendSubmission(
  form: FormKey,
  values: Record<string, unknown>,
  payload: FormData,
) {
  const jotformId = JOTFORM_IDS[form];

  const archived = archiveSubmission(form, jotformId, values).catch(() =>
    archiveSubmission(form, jotformId, values),
  );

  await submitToJotform(jotformId, payload);

  await archived.catch((cause) => {
    console.warn(`[archive] ${form} submission was not copied`, cause);
  });
}
