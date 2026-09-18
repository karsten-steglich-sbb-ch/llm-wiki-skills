---
title: LLM Wiki — log format
description: Use when appending a new entry to wiki/log.md.
---

# LLM Wiki — log format (`wiki/log.md`, per OKF §9)

> Shared reference for `llm-wiki.ingest` and `llm-wiki.audit` — both append to `wiki/log.md`.

`wiki/log.md` is a flat list of date-grouped entries, newest first:

```markdown
# Directory Update Log

## 2026-05-22
* **Update**: Added a page for [Customer Metrics](/tables/customer-metrics.md).
* **Creation**: Established the [Dataplex Playbook](/playbooks/dataplex.md).

## 2026-05-15
* **Initialization**: Created foundational directory structure.
```

- Date headings use ISO 8601 `YYYY-MM-DD`.
- The leading bold word (`**Ingest**`, `**Update**`, `**Creation**`, `**Restructure**`, `**Decision**`, `**Audit**`) is a convention, not a fixed enum — pick the word that best describes the operation.
- Never edit or delete a past entry; only append.
