---
name: llmwiki-ask
description: "Use when answering questions from the LLM Wiki (wiki/): searches wiki/ first, only falling back to raw/ as an opt-in second step."
metadata:
  copilot-enabled-agents: claude, codex, opencode
  tags: [wiki, knowledge-base, qa]
---

# LLM Wiki — Ask

## Propose

Use when answering a question about a work topic from the LLM Wiki. Two-phase, cost-ordered: **always** do Phase 1 first. Only do Phase 2 if Phase 1 comes up empty *and* the user opts in — never search `raw/` speculatively, and never run both phases in the same pass.

## Phase 1 — search the wiki (default, cheap)

1. Read `wiki/index.md` to identify candidate pages.
2. Read only the pages that look relevant — don't read the whole wiki.
3. Synthesize a direct answer, citing specific pages with `[[page-name]]`.
4. If the wiki answers the question: stop here, done. Do not touch `raw/`.

## Phase 2 — raw/ fallback (only if Phase 1 found nothing, and only after asking)

5. If Phase 1 found no answer (or only a partial one), **stop and ask** the user a single question: *"Not in the wiki — want me to search the raw sources (`raw/`) too?"* Do not search `raw/` on your own initiative.
6. If the user declines: tell them nothing was found in the wiki, and stop.
7. If the user agrees: search `raw/` (any collection — see `../llmwiki-ingest/references/context.md` for what lives there) for the topic, read only matching files, and answer directly. This is a read-only lookup, not an ingest.
8. If the raw/-sourced answer looks valuable enough to keep permanently, offer to save it as a wiki page — but hand that off to the `llmwiki-ingest` skill rather than writing to `wiki/` from here.

## Rules

- Never modify `raw/` (immutable — see `../llmwiki-ingest/references/context.md`).
- Never write to `wiki/` from this skill — creating/editing pages is `llmwiki-ingest`'s job.
- Never grep/search `raw/` — or the vault as a whole in a way that spans both `wiki/` and `raw/` — in a single pass. That silently skips the Phase 2 opt-in gate. Search `wiki/` in isolation first, every time, even for what looks like a quick ad-hoc lookup.
- If the answer isn't in the wiki and the user doesn't want a `raw/` search, say so clearly rather than guessing.
