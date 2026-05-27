# Backup — Original Files Before Static Refactor

These files were backed up on 2026-05-26 before converting the project to a
fully static (Supabase-free) React app.

## Files backed up

| Original path | Backup path | Disposition |
|---|---|---|
| `package.json` | `_backup_original/package.json` | Modified (dropped `@supabase/supabase-js`) |
| `src/App.js` | `_backup_original/src/App.js` | Modified (removed `/admin/*` route) |
| `src/store/projectStore.js` | `_backup_original/src/store/projectStore.js` | Rewritten (Supabase → fetch JSON) |
| `src/lib/supabase.js` | `_backup_original/src/lib/supabase.js` | Removed (stub replaces original) |
| `src/admin/AdminRoot.js` | `_backup_original/src/admin/AdminRoot.js` | Removed (stub replaces original) |
| `src/admin/AdminLogin.js` | `_backup_original/src/admin/AdminLogin.js` | Removed (stub replaces original) |
| `src/admin/AdminDashboard.js` | `_backup_original/src/admin/AdminDashboard.js` | Removed (stub replaces original) |
| `src/admin/AdminProjectForm.js` | `_backup_original/src/admin/AdminProjectForm.js` | Removed (stub replaces original) |
| `src/admin/AdminLogin.css` | `_backup_original/src/admin/AdminLogin.css` | Removed (stub replaces original) |
| `src/admin/AdminDashboard.css` | `_backup_original/src/admin/AdminDashboard.css` | Removed (stub replaces original) |
| `src/admin/AdminProjectForm.css` | `_backup_original/src/admin/AdminProjectForm.css` | Removed (stub replaces original) |

## Cleanup: safe to delete after verifying the refactor works

Once you confirm the site runs as expected (`npm start`), you can safely delete
these folders/files via File Explorer:

```
F:\gourish-portfolio-react\gourish-pawaskar\src\admin\
F:\gourish-portfolio-react\gourish-pawaskar\src\lib\supabase.js
```

After deleting, also run:

```
npm uninstall @supabase/supabase-js
```

…to remove the package from `node_modules` (it's already removed from
`package.json`).

## Security note (unrelated to the refactor)

The original code contained a few secrets you may want to rotate or move
out of source:

- `src/lib/supabase.js` — hardcoded Supabase anon key (safe by design,
  but you may want to delete the Supabase project entirely if you're not
  using it anymore).
- `src/pages/Contact.js` — hardcoded EmailJS Service ID, Template ID, and
  Public Key. Public Key is meant to be public, but if the form starts
  getting abused you may want to add EmailJS's domain allowlist in your
  EmailJS dashboard.
- `src/admin/AdminLogin.js` — hardcoded password `gourishfolio@design`.
  No longer in use after this refactor, but worth rotating if you reuse
  it elsewhere.
