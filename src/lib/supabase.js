// ──────────────────────────────────────────────────────────────────────────────
// REMOVED.
// This file used to export a Supabase client. The site no longer uses Supabase
// — project data lives in `public/data/projects.json` instead.
//
// Safe to delete this file (and the whole `src/lib/` folder if it's now empty)
// via File Explorer. Kept as a stub so existing imports don't break the build
// before you clean up.
// ──────────────────────────────────────────────────────────────────────────────

const DEPRECATED_MSG =
  '[supabase] Supabase has been removed. Edit public/data/projects.json instead.';

export const supabase = new Proxy({}, {
  get() { throw new Error(DEPRECATED_MSG); },
});
