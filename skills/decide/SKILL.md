---
name: decide
description: Sort a set of design decisions (one or many) into big, small and detail, research them in one shared pass with up to 5 references, and give the user short plain-language cards for the big ones and a one-line default for each small one. Use for the decisions of a ticket in planning, or when one comes up during the build.
argument-hint: <the decisions, in a few words each>
---

# Decide

Decisions: $ARGUMENTS

Handle all the decisions together in one run, not one run per decision.

Weigh each option by two costs: the cost now, and what it does to the codebase over time. The user cares about the long-term health of this codebase. An option that is fast now but makes the next changes harder is not the cheap option. Say so in its "Bad" column.

## Sizes

- **Big: the user decides.** Any of:
  - something an end user sees or does differently
  - a new dependency, or our own code where a library could do the job
  - a new module, app or package, or a change to a boundary between them
  - stored data: models, migrations, anything a later migration would need to change
  - an API contract (DRF endpoint, serializer shape, generated orval client)
  - a departure from the repo's `AGENTS.md` or an existing design doc under `docs/`
  - a security, privacy or cost trade-off
  - prepare first or not: a refactor before the change, or building on the code as it is (it changes scope and time)
  - a shortcut that leaves the code harder to change (a copy instead of a shared piece, a workaround, a special case)
  - the PR slices, when the split is not obvious
  - two or more reasonable approaches with no clear winner
- **Small: take a clear default and list it.** A real choice that is none of the above, and that an existing pattern in the repo or agreeing references settle.
- **Detail: decide it yourself.** Do not ask about it or list it. Private names, file splits inside a module, test layout, a refactor that keeps behavior.
- Not sure if it is big? Treat it as big.

## 1. List and sort

Write each decision in one line, in plain words. Sort each one by the sizes above. Each big decision gets a card. Each small one gets one line in the defaults list. Details are not shown.

Order the big decisions by dependency. A root decision is one that changes or removes other decisions. Put root decisions first.

More than 5 big decisions means the ticket is too large. Tell the user and suggest how to split it before you research.

## 2. Library first

For each decision that our own code could solve, choose in this order: the language or framework built-in, a dependency the repo already has, a maintained library, then our own code. Our own code for a generic problem (parsing, retries, queues, locks, auth, crypto, protocols) needs a stated reason. For a library, check: maintained (recent releases), size, its dependencies, and its docs (Context7).

## 3. One research pass: 5 references at most

The references are shared by all the decisions in this run.

1. Start in the repo: how do other apps and modules here solve the same problem? Name the files.
2. Then search GitHub (`gh search repos`, `gh search code`) and the web for projects that solved the same problems. Prefer maintained projects with a similar stack (Django, DRF, React) or size. Stop at 5 in total. If no good ones exist, say so. Do not pad the list.
3. Start one Explore subagent per reference, all in parallel. Give each one the full list of open questions. Each returns at most 100 words per question that applies: what they chose, why, any problems they had, and evidence (a file path or URL). It skips questions that do not apply.

A question that facts can answer (speed, size, "does library X handle Y") gets a small throwaway test in the scratchpad, not a guess.

If research shows a small decision has no clear default, move it to big. If it shows a big decision is settled by an existing pattern, move it to small.

## 4. Cards for big decisions

Use 2 or 3 real options. Add "do nothing for now" when that is valid. About 100 words, without the table. Show code only when the decision is about an API shape, and then 5 lines or fewer.

Write for a reader in a hurry:
- Plain words. Give a repo term a short meaning the first time.
- Context in each card: what you are working on, what it changes for the end user, and your pick with one reason.
- One decision per card.

```markdown
### Decide: <one line>
**Why it matters:** <what the end user or the team will see, 1–2 lines>

| Option | Good | Bad |
|---|---|---|
| A. <name> | ... | ... |
| B. <name> | ... | ... |

**My pick:** A, because <one reason>.
**Seen in:** [project or file](link): A · [project or file](link): B
```

## 5. Defaults list for small decisions

```markdown
**Defaults I will use unless you object:**
- <decision>: <default> (<why, in a few words: "same as X in pwrench/…", "all 3 references do this">)
```

## 6. Ask in rounds

- Round 1: show the defaults list and at most 3 cards (the root decisions first). Then call `AskUserQuestion` with one question per card. Put the recommended option first, with "(Recommended)". The user can reply about any default in the same answer.
- After each round, drop or change the decisions that the answers settled. Then ask the next round, again at most 3 cards.
- Stop when no big decision is open.
- Every question, in all rounds and follow-ups (review findings included), gets its full card (step 4) in the message before `AskUserQuestion`. Never ask with only the question box: it is too small to hold the context.

## 7. Record

Write each decision in the plan's **Decisions** section: the choice, the rejected option and the reason. During the build, add it to the "Defaults I used" list (small) or tell the user (big), so `/ship` can show it.
