---
title: LLM Wiki — page format (OKF concept)
description: Use when creating or editing a wiki concept page, or when auditing a page's frontmatter conformance.
---

# LLM Wiki — page format (OKF concept)

> Shared reference for `llm-wiki.ingest` (creates/edits pages) and `llm-wiki.audit` (checks conformance against this template).

Every wiki concept page (i.e. every `.md` file in `wiki/` other than `index.md`/`log.md`) must follow this template:

```markdown
---
type: <Type>                          # REQUIRED — e.g. System, Architecture, Business Context, Glossary, Workstream, Process, Team, Sprint Log, Playbook, Project Hub
title: <Display name>                 # Recommended
description: <One-sentence summary>   # Recommended
tags: [<tag>, <tag>, ...]             # Recommended
status: draft | stable | deprecated   # Optional — absent means stable
sources:                              # Optional but expected whenever raw/ material was used
  - { id: <slug>, resource: raw/<collection>/<path>, title: <label> }
  - { id: <slug2>, resource: raw/<collection>/<path2>, title: <label2> }
generated: { by: copilot/llm-wiki, at: <ISO 8601 UTC datetime> }   # Trust: who/what produced the current content, and when
# verified: { by: human:<id>, at: <ISO 8601 UTC datetime> }        # Add once a human or process has confirmed the page
---

# Page Title

Main content. Clear headings, short paragraphs.
Link related concepts with [[wiki-links]] throughout.
Per-claim citations stay inline as `(source: raw/<collection>/<path>)`, matching one of the frontmatter `sources` entries; mark anything unsourced `[needs verification]`.

## Related pages

- [[related-concept-1]]
- [[related-concept-2]]
```

Notes on the fields:

- `type` is the only field OKF strictly requires. Pick a short, self-explanatory value; check `wiki/index.md` for types already in use rather than inventing near-duplicates.
- `sources[].id` is a stable slug (lowercase, hyphenated) unique **within that page's own `sources` list** — it exists so a citation can be joined back to its source even if the list is reordered.
- `sources[].resource` is the path into `raw/` (or an external URL) the content derives from.
- `generated.by` uses the actor convention (see `context.md`) — always the literal value `copilot/llm-wiki`, never a raw model name (`claude`, `qwen3`, `gpt-4`, etc.); `generated.at` is when the content was last meaningfully changed, not when it was last touched cosmetically.
- Add `verified: { by: human:<id>, at: ... }` (or a list of such entries) once a person or automated process has actually confirmed the page against its sources — this is what moves the page from the *unverified* to *machine-confirmed*/*human-reviewed* trust tier. Don't backfill it speculatively.
- `status: draft` is appropriate for thin/incomplete pages (e.g. ones carrying inline `[needs verification]` markers); omit `status` once a page is solid (defaults to `stable`).
- This vault does not currently use OKF's Attested Computation concept type (§10 of the spec) — there are no sanctioned, re-runnable computations in this knowledge domain. If that ever becomes relevant (e.g. a page that must reproduce a KPI the same way every time), consult the OKF spec's §10 before introducing `type: Attested Computation`.
- Page filenames: lowercase, hyphen-separated, `.md` extension (e.g. `machine-learning.md`), unique across the whole `wiki/` tree (wikilinks resolve by filename, not path).
- If a claim has no source: mark it `[needs verification]`.
- If two sources disagree: note the contradiction explicitly.
