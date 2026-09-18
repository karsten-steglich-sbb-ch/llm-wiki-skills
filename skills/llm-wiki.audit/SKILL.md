---
name: llm-wiki.audit
description: "Use when the user asks to lint or audit the wiki (wiki/) for OKF conformance, broken wikilinks, orphan pages, categorization mistakes, or contradictions. Read-only, report-first — no auto-fix."
metadata:
  tags: [wiki, knowledge-base, lint, audit, okf]
---

# LLM Wiki — Audit

## Propose

Use when the user asks to lint, audit, or check wiki quality: OKF conformance, broken wikilinks, orphan pages, categorization mistakes, missing citations, contradictions. Read-only and report-first — never fixes anything without the user's go-ahead.

## Context

See `../llm-wiki.ingest/references/context.md` for file roles, `../llm-wiki.ingest/references/folder-structure.md` for the categorization decision tree, and `../llm-wiki.ingest/references/page-format.md` for the frontmatter conformance target.

## Tools

`tools/check-okf.mjs` validates OKF frontmatter conformance (non-empty `type` on concept pages, no stray frontmatter on `index.md`/`log.md`) across the whole `wiki/` tree — see its header comment for usage. First run `npm install` in `.github/skills/llm-wiki.audit/tools/` (installs its one dependency, `js-yaml`); then run `node .github/skills/llm-wiki.audit/tools/check-okf.mjs` as step 3 below, and any time after a batch of wiki edits. Exits 1 if it finds anything, 0 if clean — don't hand-roll an ad-hoc equivalent script per session, extend this one if a new check is needed.

## Trigger: lint / audit

When the user asks to lint or audit the wiki:

1. **Folder organization**: Ensure all content pages (exclude `index.md`, `log.md`, and top-level hubs) are in topic subfolders. No content pages should remain in `wiki/` root.
2. **Categorization accuracy**: use the decision tree in `../llm-wiki.ingest/references/folder-structure.md` to verify each page's folder is correct. Misfits: pages describing shared tooling should be in `infrastructure/`, not `systems/`; business workstreams should be in `business/`, not `systems/`; org/process matters should be in `organisation/`, not other folders.
3. **OKF conformance** (per §11 of the spec): run `node tools/check-okf.mjs` (see "Tooling" above) rather than eyeballing every frontmatter block by hand. It checks:
   - Every non-reserved `.md` file has a parseable YAML frontmatter block with a non-empty `type`.
   - `index.md` files carry no frontmatter except an optional bundle-root `okf_version`; `log.md` carries none at all.
   - Missing optional fields, unknown `type` values, unknown extra keys, and broken links are **not** lint failures per se — flag them only as suggestions for improvement, never as errors (the script doesn't check these; call them out manually if noticed).
   - A bare `verified: { by, at }` mapping is treated as a one-element list, not rejected (also not checked by the script).
4. **Format compliance**: Each page must have `type` frontmatter (required, per `../llm-wiki.ingest/references/page-format.md`), plus recommended `title`/`description`/`tags`, main content with headings, related pages section.
5. **Wikilinks**: Verify all `[[page-names]]` resolve and are bidirectional (A links to B → B should link to A or be linked by a common hub like a project hub page).
6. **Citations**: Every factual claim should be traceable to a `sources` entry via inline `(source: raw/<collection>/<path>)` or be marked `[needs verification]`.
7. **Orphan pages**: Identify pages with no inbound links (use `[[wikilinks]]` grep to verify each page is referenced somewhere).
8. **Contradictions**: Compare claims across pages for consistency.
9. **Outdated content**: Flag any claims that may be superseded by newer sources in `raw/`, or pages whose `generated.at` looks stale relative to a newer source.
10. Report findings as a numbered list with suggested fixes.
11. **Do not apply any fixes yet.** Ask the user which findings to fix (or whether to fix all of them) before editing anything — lint/audit is a read-only, report-first operation.

## Rules

- Lint/audit findings are reported first, fixed only after the user gives the go-ahead — never fix-on-detect.
- If asked to apply fixes, categorization/frontmatter changes must still follow `../llm-wiki.ingest/references/folder-structure.md` and `../llm-wiki.ingest/references/page-format.md`, and any page/index/log edits follow the same rules as `llm-wiki.ingest` (update `index.md` + `log.md`, use `../llm-wiki.ingest/references/log-format.md`).
