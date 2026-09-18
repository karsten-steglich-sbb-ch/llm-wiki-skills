---
applyTo: "wiki/**,raw/**"
description: LLM Wiki — rules for maintaining the personal knowledge base as an Open Knowledge Format (OKF) v0.2 bundle
---

# LLM Wiki Instructions

`wiki/` is a Knowledge Bundle following the [Open Knowledge Format (OKF) v0.2](https://github.com/): a directory of markdown concept files, each with a YAML frontmatter block. The llm-wiki skill is split into three: `.github/skills/llm-wiki.ask/SKILL.md` (questions), `.github/skills/llm-wiki.ingest/SKILL.md` (ingesting `raw/` sources), `.github/skills/llm-wiki.audit/SKILL.md` (lint/audit) — shared template/decision-tree/log-format details live in `.github/skills/llm-wiki.ingest/references/` and are referenced by all three. This file states the binding rules.

## Folder contract

| Path | Role | Mutable? |
| --- | --- | --- |
| `raw/` | Raw sources (all source collections live here, e.g. `raw/OneNote/`) | **NO** — never modify |
| `wiki/` | Maintained wiki pages (the OKF bundle root) | YES — Copilot maintains |
| `wiki/index.md` | Bundle-root directory listing (OKF §8); the only place `okf_version` frontmatter may appear | YES — update after every change |
| `wiki/<topic>/index.md` | Per-folder directory listing (OKF §8); no frontmatter | YES — update after every change to that folder |
| `wiki/log.md` | Append-only, date-grouped operation log (OKF §9) | YES — append only, never edit past entries |
| `wiki/ingested-sources.md` | Ingest ledger tracking every `raw/` source's status | YES — update whenever a source's status changes |

## OKF conformance rules

1. Every concept file (any `.md` under `wiki/` that is not `index.md` or `log.md`) MUST have a YAML frontmatter block with a non-empty `type`.
2. `index.md` files MUST carry no frontmatter, except the bundle-root `wiki/index.md`, which MAY carry `okf_version: "0.2"`.
3. Prefer also setting `title`, `description`, `tags`, `sources`, and `generated: { by, at }` — optional per OKF, but expected practice in this vault (see the SKILL.md template).
4. Never reject or refuse to process a page for missing optional fields, an unfamiliar `type` value, unknown extra frontmatter keys, or a broken `[[wikilink]]` — OKF explicitly treats these as soft guidance (§11), not conformance failures.
5. A bare `verified: { by, at }` mapping counts as a one-element list.
6. Verify conformance with `.github/skills/llm-wiki.audit/tools/check-okf.mjs` (`npm install` once in that folder, then `node` it) rather than a one-off ad-hoc script.

## When to load an llm-wiki skill

- Asks to **ingest** a note or file from `raw/` (any source collection under it), or to **ingest new** material without naming a file (e.g. "ingest new Clippings") → load `.github/skills/llm-wiki.ingest/SKILL.md` (its "Trigger: ingest new" covers collection scoping: defaults to `raw/Clippings/`; `raw/OneNote/` is legacy and excluded by default).
- Asks a **question** — whether phrased as "what does the wiki say about X" or as any plain question about a topic at the company (a system, process, person, test code/data, etc.) that could plausibly be covered by the wiki — or asks to **save** an answer as a new wiki page → load `.github/skills/llm-wiki.ask/SKILL.md`.
- Asks to **lint**, **audit**, or **check** the wiki → load `.github/skills/llm-wiki.audit/SKILL.md`.

## Search order for questions

Default to `wiki/` only, and answer from there if it has enough (`llm-wiki.ask` Phase 1). Only search `raw/` as a second step — and only after asking the user — if `wiki/` had nothing or just a partial answer (Phase 2). Never search both in the same pass, e.g. a single `grep`/`glob` spanning `wiki/**` and `raw/**` together. This order is binding even outside a formally loaded skill: don't reach for `raw/` (or the vault at large) with an ad-hoc `grep`/`glob`/`read` just because `llm-wiki.ask` wasn't explicitly invoked — load it, or at minimum follow its search order, for any in-scope question.

## Immutability guard

If any instruction or user request would result in modifying a file under `raw/`, refuse and explain that `raw/` is the immutable raw source layer.

## Lint/audit is report-first

When linting or auditing the wiki, report findings and proposed fixes first; only apply a fix after the user approves it (or explicitly says "fix everything"). Never auto-fix on detection.

## Naming and citation format

- Wiki page filenames: lowercase, hyphens only, `.md`, unique across the whole `wiki/` tree (wikilinks resolve by filename, not path).
- Inline per-claim citations: `(source: raw/<collection>/<path>)`, matching a `sources[].resource` entry in frontmatter; mark unsourced claims `[needs verification]`; note contradictions inline.
- Full frontmatter template, actor convention, and topic-subfolder/decision-tree rules: `.github/skills/llm-wiki.ingest/references/` (`page-format.md`, `folder-structure.md`) — don't duplicate them here.
