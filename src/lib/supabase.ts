import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Our own copy of every submission. Null until the two env vars are set, so the
 * app keeps working (Jotform only) before Supabase is wired up.
 *
 * `VITE_SUPABASE_ANON_KEY` holds the publishable key (Supabase's new name for
 * the anon key). It is public by design — the database policies allow inserts
 * and nothing else, so a partner's phone can file a submission but can never
 * read anyone's back. See `supabase/schema.sql`.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const SUBMISSION_BUCKET = "submissions";
