# Long-form documents (in-repo)

## What this source contains

Pencilwrench keeps most durable long-form context in the repo itself:

- `docs/**` — design docs, plans (`docs/**/plans/*.md` with PR-slice manifests), postmortem-style notes
- `causeCorrection/docs/business-rules/` — the business-rules spec set (00-index, per-feature rules, anti-patterns)
- `.agents/instructions/**` and `AGENTS.md` files — conventions and the reasoning encoded with them
- READMEs next to the code they describe

Long-form "why" often lives here before it becomes code: problem statements, alternatives considered, constraints, and anti-patterns with the incidents that produced them.

**Confluence gap.** The team also uses Confluence, but `acli confluence` exposes only space administration, not page search or content reads. Record Confluence as a searched-category gap in Sources Consulted; do not guess at its contents.

## How to search it

1. **Start at the indexes.** `causeCorrection/docs/business-rules/00-index.md` maps specs to features. `docs/` subdirectories group by initiative.
2. **Keyword search.** `rg -il '<feature name>' docs causeCorrection/docs .agents` with several phrasings: the feature name, key symbols, error strings, the ticket ID.
3. **Read the whole document, not the hit line.** Rationale is often buried mid-document, in "alternatives considered" or anti-pattern entries.
4. **Check the document's own git history.** A spec edit that landed with the code change often names the motivating PR or ticket. Hand commit-level leads to the source-control investigator.

## What good evidence looks like here

- A plan or spec with a problem statement that matches the target's purpose
- An "alternatives considered" or "rejected approaches" section
- An anti-pattern entry (`99-anti-patterns.md`) that names the trap the target code avoids, with its history
- A business-rules section whose rule matches the code's behavior and cites its ticket

## Common pitfalls

- **Outdated docs.** Specs are written before implementation and not always updated. Cross-check against the actual PR.
- **Doc vs. reality drift.** A spec may say "we'll do X" while the code does Y. Flag the divergence; the synthesizer surfaces contradictions.
- **§10 sections.** In business-rules specs, §1–9 state intent and §10 records current-implementation quirks. Quote from the right layer for the question.
- **Unlinked docs.** The most relevant doc may not be linked from anywhere. Broad keyword searches help.

## What to return

For each relevant doc:
- Path and section
- The motivation text (verbatim quote), with its location
- Last-touched commit and date for that section (`git log -1 -- <path>`)
- Whether the doc reads as current or stale relative to the code's ship date
