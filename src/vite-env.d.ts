/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Unset = Jotform only, no second copy. */
  readonly VITE_SUPABASE_URL?: string;
  /** Public anon key — inserts only, see supabase/schema.sql. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Where submissions are filed: "jotform" | "supabase" | "both". */
  readonly VITE_SUBMIT_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
