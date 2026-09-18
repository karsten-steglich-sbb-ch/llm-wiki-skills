---
name: llmwiki-ingest
description: "Use when ingesting raw/ sources (Confluence clippings, OneNote notes, PDFs, transcripts) into wiki/ concept pages per OKF v0.2 — handles a named source or an unscoped 'ingest new' sweep."
metadata:
  copilot-enabled-agents: claude, codex, opencode
  tags: [wiki, knowledge-base, ingest, okf]
---

# LLM Wiki — Ingest

## Propose

Use when ingesting a source from `raw/` into `wiki/` concept pages, following the Open Knowledge Format (OKF) v0.2. Handles both a named source ("ingest <file>") and an unscoped sweep ("ingest new Clippings", "what's new to ingest").

## References

- `references/context.md` — the `raw/`↔`wiki/` contract, collection status, reserved filenames.
- `references/page-format.md` — OKF page template, actor convention, frontmatter fields.
- `references/folder-structure.md` — folder + categorization decision tree.
- `references/log-format.md` — `wiki/log.md` entry format.

## Context

See `references/context.md` for the `raw/`↔`wiki/` contract, collection status (active `Clippings/` vs. legacy `OneNote/`), and reserved filenames.

## Page format

Every new/edited concept page must follow the OKF template in `references/page-format.md` (frontmatter fields, actor convention, filename rules).

## Where to file a page

Use the folder + categorization decision tree in `references/folder-structure.md` to pick (or, after asking the user, create) the right topic subfolder.

## Trigger: ingest

When the user asks to ingest a source from `raw/`:

1. Read the full source document from `raw/<collection>/<path>`.
2. Discuss key takeaways with the user **before writing anything**.
3. Create a concept page in `wiki/` (in the appropriate topic subfolder — see "Where to file a page") named after the source, using the OKF page format (frontmatter with `type`, `title`, `description`, `tags`, `sources`, `generated`).
4. Create or update concept pages for each major idea or entity (expect 10–15 pages per source).
5. Add `[[wiki-links]]` to connect related pages.
6. Update `wiki/index.md` and the relevant folder `index.md` with new pages and one-line descriptions.
7. Append a dated entry to `wiki/log.md` under today's `## YYYY-MM-DD` heading (create the heading if it doesn't exist yet), in the form `* **Ingest**: <prose summary, linking changed pages with [[wikilinks]]>` — see `references/log-format.md`.
8. Update `wiki/ingested-sources.md`: move the source from "Pending review" (if it was listed there) into "Ingested", with today's date and the list of pages produced/updated.

## Trigger: ingest new

When the user asks to ingest new material without naming a specific file (e.g. "ingest new Clippings", "ingest new sources", "what's new to ingest", "check raw/ for anything unprocessed"):

1. Determine scope:
   - If the user named a collection (e.g. "ingest new Clippings" → `raw/Clippings/`), use that.
   - If the user said something scope-less like "ingest new" or "check raw/ for anything unprocessed", **default to `raw/Clippings/`** — don't silently expand the sweep to `raw/OneNote/` or any other collection. `raw/OneNote/` is a legacy platform snapshot already covered by the Tier 1/Tier 2 split in the ledger and is not meant to be exhaustively ingested (see `references/context.md`).
   - If it's genuinely ambiguous which collection the user means (e.g. multiple active collections exist and the request doesn't name one), **ask the user which collection** rather than guessing or defaulting.
2. `glob` every `.md` file in that scope.
3. Read `wiki/ingested-sources.md` and collect every path already listed under "Ingested", "Deferred", or "Not a content source" (folder-level entries count as covering every file under that folder).
4. Diff: any file from step 2 not covered by step 3 is a candidate. Do **not** infer "new" from re-scanning wiki page frontmatter or from file timestamps — the ledger is the single source of truth for status, so it stays authoritative and fast to check.
5. If nothing new: tell the user the ledger is up to date for that scope (optionally mention items still sitting in "Pending review", since those are candidates too, just not urgent).
6. If something is new: list the candidate(s) to the user with a one-line guess at relevance (e.g. cross-referencing existing wiki pages that already mention the same topic), then run the normal **Trigger: ingest** workflow above per file — including the "discuss key takeaways before writing" rule; this trigger does not skip that step, it only automates *finding* the source, not the judgment calls about what to write.
7. After processing (or choosing to defer/skip a candidate), update `wiki/ingested-sources.md` accordingly — move it to "Ingested" with pages produced, or to "Deferred" with a one-line reason, so the next "ingest new" run doesn't re-surface it.

(A ledger, not an archive folder for processed files: keeps `raw/` fully passive/unmodified and supports non-binary status. Full rationale: `wiki/log.md`, 2026-08-31.)

## After ingesting

Run `node ../llmwiki-audit/tools/check-okf.mjs` (first `npm install` once in that folder) to verify OKF conformance before considering the change done — don't hand-roll an ad-hoc equivalent check.

## Rules

- NEVER modify any file under `raw/`.
- ALWAYS update `wiki/index.md` (and the relevant folder `index.md`) and append to `wiki/log.md` after any change.
- ALWAYS give every new or edited concept page a conformant frontmatter block (`type` required; `title`/`description`/`tags`/`sources`/`generated` as applicable) before considering the change done.
- When uncertain how to categorize something, ask the user.
- A good answer surfaced by `llmwiki-ask`'s raw/ fallback should be filed back into the wiki via this skill so it compounds over time.
