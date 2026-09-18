---
title: LLM Wiki — shared context
description: Use when you need the raw/↔wiki/ contract, collection status, or reserved filenames shared across the llm-wiki skills.
---

# LLM Wiki — shared context

> Referenced by `llm-wiki.ask`, `llm-wiki.ingest`, and `llm-wiki.audit` to avoid repeating the same background in all three.

- **Raw sources** (immutable): `raw/` — never modify any file here.
  - `raw/` may contain multiple source collections as subfolders (e.g. `raw/OneNote/`, `raw/Clippings/`, `raw/pdfs/`, `raw/transcripts/`).
  - `raw/Clippings/` is the **active** collection — new source material (Confluence pages, web clippings) lands here going forward, and this is what `llm-wiki.ingest`'s "ingest new" defaults to.
  - `raw/OneNote/` is a **legacy** platform snapshot. It's already been ingested at a coarse ("Tier 1") level and is not meant to be ingested exhaustively file-by-file — most of it (DAILY, USER Stories, REFINEMENT, REVIEWS, PLANNING, AI Weeklys, IP Themen) is deliberately `deferred` in the ledger. Never sweep it for "new" material without the user asking for that collection specifically.
  - Any other collection (e.g. `raw/pdfs/`, `raw/transcripts/`) is treated like `raw/Clippings/` — active until told otherwise — but if it's unclear which collection the user means, ask rather than assume.
- **Wiki pages**: `wiki/` — a Knowledge Bundle maintained by Copilot, following the [Open Knowledge Format (OKF) v0.2](https://github.com/). Every page is a **concept**: a markdown file with a YAML frontmatter block plus a markdown body.
- **Index**: `wiki/index.md` — the bundle-root directory listing (§8 of OKF); carries the only frontmatter an `index.md` is allowed (`okf_version: "0.2"`). Update after every change.
- **Log**: `wiki/log.md` — append-only, date-grouped operation record (§9 of OKF). Append after every change. Format: `log-format.md` (this folder).
- **Ingest ledger**: `wiki/ingested-sources.md` — tracks every `raw/` source's status (`ingested`/`deferred`/`pending review`/`n/a`), so `llm-wiki.ingest`'s "ingest new" can diff `raw/` against it instead of scanning every wiki page's frontmatter or moving/archiving files inside `raw/`. Update it whenever a source's status changes.
- Reserved filenames at any level of `wiki/`: `index.md` (directory listing, §8) and `log.md` (update history, §9). Never use these names for concept pages.
