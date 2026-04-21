# dev-workflow presentation

Slidev presentation built with `@slidev/cli` 0.50.0 and the `seriph` theme.

## Known Slidev bug — Goto dialog gets stuck open

Slidev 0.50.0 has a bug where pressing `G` opens a slide-search dialog that cannot be closed:

- The dialog auto-focuses its input, which sets `isInputting = true`
- This disables all keyboard shortcuts including `G` (to toggle it closed)
- Clicking away does not close it because the slide area is not focusable, so `activeElement` never changes

**Workaround:** `dev-workflow/style.css` hides the dialog entirely with `visibility: hidden` on `#slidev-goto-dialog`. This is the fix that works. `dev-workflow/setup/shortcuts.ts` also disables the `G` shortcut to prevent the dialog from opening, but that alone was not sufficient.

This affects any Slidev presentation whose slides have `# ` (h1) headings — those headings become slide titles that populate the search list. The list overflows the dialog container into the viewport even when the dialog is technically closed (positioned at `-top-20`). Presentations using `## ` (h2) headings are not visibly affected because the search list stays empty.

## Running

```bash
npm run dev      # dev server at localhost:3030
npm run build    # build to dist/
npm run export   # export to PDF
```
