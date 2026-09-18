---
title: LLM Wiki — folder structure & categorization decision tree
description: Use when filing a new or moved wiki page to pick the right topic subfolder, or when auditing whether a page already sits in the right folder.
---

# LLM Wiki — folder structure & categorization decision tree

> Shared reference for `llm-wiki.ingest` (where to file a new/moved page) and `llm-wiki.audit` (checking a page sits in the right folder).

`wiki/` (the bundle root) uses topic subfolders to group concepts for human browsability (e.g. `wiki/architecture/`, `wiki/systems/`, `wiki/infrastructure/`, `wiki/business/`, `wiki/organisation/`, `wiki/maintenance/`, `wiki/development/`, `wiki/workstreams/`). This is safe for retrieval and for Obsidian, and matches OKF's bundle model (§3) where directory structure is a producer choice independent of the format itself:

- `[[wiki-links]]` resolve by unique filename, not full path — moving a page into a subfolder never breaks existing links, as long as filenames stay unique across the whole `wiki/` tree.
- Keep filenames unique vault-wide within `wiki/`. Never create two pages with the same filename in different subfolders.
- `wiki/index.md` is the bundle-root directory listing (§8): group its page list by subfolder/topic so a human (or the agent) can see at a glance what's covered. It carries `okf_version: "0.2"` as its only frontmatter key.
- Each topic subfolder also gets its own `index.md` (no frontmatter) listing just that folder's concepts, per OKF's progressive-disclosure convention (§8) — link title + one-line description, e.g. `- [payments-service](payments-service.md) - payments service UI system`.
- When creating a new page, pick the existing subfolder that best matches its topic, or ask the user before introducing a new subfolder.
- Only `index.md`, `log.md`, and top-level hub pages (like a project overview) should stay directly under `wiki/`; everything else belongs in a topic subfolder once there are 3+ related pages.
- `wiki/maintenance/` collects operational/maintenance processes carried out by on-call/ops roles (deployment rules, bugfix workflow, incident-response playbooks) — distinct from `organisation/` (team/role structure) and `systems/` (what a system does, not how it's operated).
- `wiki/development/` collects developer environment setup, local dev workflows, and conventions/debugging guides for engineering teams — the "dev" half of DevOps, paired with `wiki/maintenance/` (the "ops" half).
- `wiki/workstreams/` is reserved for ticket/work-log-level content (e.g. per-ticket or per-topic summaries drawn from granular sources like daily notes, user stories, refinement notes) — group these by ticket/topic rather than one page per raw file.
- **Nested subfolders**: a topic folder MAY itself contain a nested subfolder (e.g. `wiki/systems/payments-facade/`) once 3+ pages form a tightly related cluster narrower than the whole topic (e.g. one API layer's overview + conventions + workflow pages). Give the nested folder its own `index.md` too, and update the parent folder's `index.md` (and `wiki/index.md`) to link to that nested index instead of listing every sub-page flat. This is the same OKF §3/§8 pattern applied one level deeper — moving pages into a nested subfolder is a pure filesystem move; frontmatter and `[[wikilinks]]` never need to change.

## Categorization decision tree

For the current folder listing and page counts, read `wiki/index.md` directly (it's kept current after every change) rather than trusting a snapshot here.

When adding a new page or moving an existing one:

1. Is it **describing how systems are connected or the overall architecture**? → `architecture/`, `type: Architecture`
2. Is it **a specific system, component, or service**? → `systems/`, `type: System`
3. Is it **shared tooling, infrastructure, or a platform used across multiple systems**? → `infrastructure/`, `type: Infrastructure`
4. Is it **business domain knowledge, a business workstream, or sales/refund process**? → `business/`, `type: Business Context` / `type: Glossary` / `type: Workstream`
5. Is it **about teams, people, roles, or how the organization/dev process works**? → `organisation/`, `type: Team` / `type: Process` / `type: Sprint Log`
6. Is it **an operational/maintenance process run by on-call/ops roles** (deployment rules, bugfix workflow, incident recipes)? → `maintenance/`, `type: Process` (or `type: Playbook` for a situational recipe, see below)
7. Is it **developer environment setup, a local dev workflow, or a tooling/debugging guide** for engineering teams? → `development/`, `type: Process`
8. Is it **ticket-level or work-log content** (summarized from daily notes, user stories, refinements, reviews, planning, weeklies, themed issues)? → `workstreams/`, `type: Workstream`

If none of these fit, ask the user before creating a new category or `type` value.

### `wiki/maintenance/recipes/` — reserved, not yet created

Considered on 2026-08-31: a nested subfolder under `wiki/maintenance/` for situational runbooks — "what to do when X happens" (e.g. "pod not deployed correctly"), as opposed to the standing processes already there (bugfix workflow, deployment rules, role definitions). `type: Playbook` is the natural fit — it's an OKF-native type, used in the spec's own worked example for exactly this kind of content ("Incident response: data freshness alert").

**Not created yet** — following the same "3+ pages" bar as every other nested subfolder above, and there's no ingested source material with concrete step-by-step recipes yet. [[order-service-fails]] comes closest (a specific failure mode + investigation pointers) but isn't a full situational runbook. The richest future source is a legacy raw/ snapshot of day-to-day ops notes — concrete bug/incident flows — currently deferred (out of default ingest scope; see `wiki/ingested-sources.md`).

**Create it** once 3+ concrete "situation → steps" pages exist to file (from ops backlog tickets, Confluence runbooks, or future Clippings). Until then, new maintenance content is either a standing process (`wiki/maintenance/*.md`, `type: Process`) or, if it's genuinely a one-off situational recipe, a single `type: Playbook` page directly under `wiki/maintenance/` (no subfolder yet) — promote to `wiki/maintenance/recipes/` once there are enough to group.
