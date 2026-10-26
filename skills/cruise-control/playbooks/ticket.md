# Ticket

Take a Jira ticket (PWDEV-N) from the issue to a reviewed plan, then build it. The ticket is the PWDEV key in the user's prompt.

Apply [Make the Change Easy First](../../../principles/make-the-change-easy-first.md) at every step. Step 2 finds what makes the change hard, step 3 raises it, step 7 stops on shortcuts.

Follow the steps in order.

**No code edits before the gate.** Until the step 6 gate passes, write no file in the repo. The only files you may write are the plan file and scratch scripts under `$TMPDIR` (for example a `blast-radius` proof).

The user owns three gates in this playbook: big decisions (`/decide`), contested review findings that need a design choice, and child tickets. The plan has no approval step. Its readers are the review agents.

## 1. Read and restate

1. Get the issue with `acli jira workitem view <PWDEV-N>`, with its comments, parent and linked issues. Note its acceptance criteria.
2. Read the root `AGENTS.md` and the `AGENTS.md` of each folder the issue touches. Read the `.agents/instructions/` files they link for this kind of work (TDD, E2E, code readability).
3. Tell the user, in 3–5 plain lines: the problem, what "done" looks like, and what is out of scope. Ask only if the issue is unclear. Otherwise continue. The user interrupts if you got it wrong.

## 2. Ground

Run these 4 in parallel subagents. The first 3 are pwstack skills. Start each one as a `general-purpose` subagent (it can start its own subagents; `Explore` cannot) and tell it: "Read `<pwstack>/skills/<name>/SKILL.md` and follow it. Return the skill's own output in full, with `file:line` evidence. Do not return raw file contents or command output." `<pwstack>` is two folders above `<cruise-control>`.

- `how` skill: how the code that the issue touches works now.
- `why` skill: the reasons behind that code (git history, Jira, docs, Sentry, Datadog, PostHog, the Pencilwrench MCP), and any design doc or plan for this work under `docs/**`.
- `blast-radius` skill: what else reads or writes the data, contracts or files this change will touch.
- The repo's `code-smells` agent, on the code this change touches: what makes this change harder than it should be? Name each smell, the refactoring that removes it, and how much of the change it makes simpler.

## 3. Decisions

Read these principles first, in full: [Make the Change Easy First](../../../principles/make-the-change-easy-first.md), [Redesign From First Principles](../../../principles/redesign-from-first-principles.md), [Model the Domain](../../../principles/model-the-domain.md). They apply to steps 3 and 4.

List all the decisions this ticket needs. Settle details yourself.

Always include "prepare first?" when step 2 found code that makes this change harder: refactor first, or build on the code as it is. Give your honest pick. "Build as it is" is the right pick only when the refactor does not make this change or the next likely ones simpler.

- No decisions: write "No decisions needed:" and one line for the reason. Go to step 4.
- Otherwise, run `/decide` once, with all of them. It sorts them, researches them in one pass, and asks the user in rounds.

## 4. Plan

Write the plan to `~/.claude/plans/<PWDEV-N>-<short-name>.md`. The opencode reviewer can read that folder.

Before you write **Approach** and **Changes**, read the docs for each library, framework, SDK or CLI the plan uses, under [Use Libraries as Documented](../../../principles/use-libraries-as-documented.md).

The readers are the review agents, not the user. Write for a reviewer who checks each claim against the code. Sections:

- **Problem**: 1–2 lines. What is wrong or missing, and why it matters.
- **Approach**: 2–3 lines. The chosen solution and the main idea behind it.
- **Out of scope**: one line each.
- **Acceptance criteria**: a table, one row per criterion: the criterion → the change that meets it → its test, or "no test: <reason>".
- **Assumptions about the code**: each one with `path:line`.
- **Decisions**: each one with the user's answer from `/decide`, including "prepare first?".
- **Changes**: per file or module, what changes.
- **New names**: each new type, function, field or route, and the existing codebase term it follows.
- **PR Slices**: the team format from the root `AGENTS.md` ("PR sizing"): one `### Slice N: <name>` per PR, file bullets, 5–15 files each. One slice is fine for a small change. A "prepare first" refactor is its own slice and comes first, so it can merge on its own.
- **Review**: filled in by `/review-plan`.

No diagrams, and no user test steps: the Ship playbook writes those.

**More than 2 PR slices:** stop and propose child tickets, each with a title and its slices. On approval, create them under `<PWDEV-N>`, report their keys and stop. On "go on", continue.

## 5. Review the plan

Run `/review-plan <PWDEV-N>: <title>` on the plan. It fixes the plan and fills in the **Review** section.

## 6. Gate

Build when all hold:

- `/decide` is answered, or step 3 needed no decisions.
- `/review-plan` left no blocking or major finding open.
- At most 2 PR slices, or the user said go on.

A contested finding stops for the user only when it needs a design choice: run `/decide`. Otherwise settle it yourself with evidence (read the code, run a command) and continue.

A blocking or major finding still open after the second review round: stop and tell the user in two lines.

When the gate passes, post a 3-line summary in chat, then go straight to step 7. It is for skimming, not approval. Do not wait for a reply.

```markdown
**Problem:** <one line>
**Approach:** <one line>
**PR slices:** <slice names, in order>
```

## 7. Build

Read these principles first, in full: [Test Behavior, Not Implementation](../../../principles/test-behavior-not-implementation.md), [Laziness Protocol](../../../principles/laziness-protocol.md), [Sequence work into verifiable units](../../../principles/sequence-verifiable-units.md), [Use Libraries as Documented](../../../principles/use-libraries-as-documented.md).

1. Before any code, move the issue to In Progress: `acli jira workitem transition --key <PWDEV-N> --status "In Progress" --yes`. Then read the status back with `acli jira workitem view <PWDEV-N> --fields status`. Report only a status you read. If the move fails, tell the user the error and go on.
2. Branches. One slice: a branch `<PWDEV-N>-<short-name>` off `main`. More than one slice: start the stack with `gh stack init <PWDEV-N>-<slice-1-name>`, and add each later slice with `gh stack add <PWDEV-N>-<slice-name>` when you reach it. In a fresh worktree, run `yarn setup` first.
3. Build one slice at a time, bottom slice first, to the plan and test first (the repo's TDD rule: Red → Green → Refactor). Split work by the repo's "Agent Selection" table, except: never use the `react-frontend` agent. Do React work yourself.
4. When a slice is complete, commit it on its branch in the repo format (gitlint): `<type>(<scope>): <subject>`, imperative, with short bullets of what changed and why. Then run [Ship](ship.md) part A, steps 1–3, on that slice before you start the next one. A local commit is not "ship": nothing is pushed until the user says "ship".
5. A new decision comes up: a small one gets a clear default, added to a "Defaults I used" list. A big one: stop and run `/decide`.
6. The plan turns out wrong (the same workaround in many places, `any`, forced casts, a type that lies): stop and tell the user in two lines. Do not patch around it. A shortcut that makes the codebase worse is a decision for the user, not a detail.
7. Something breaks that the plan does not cover (a test or feature outside this ticket, data, the build): stop and tell the user in two lines. Keep a list of everything you find on the way. The Ship playbook puts it under "Heads up".
8. When the top slice has passed Ship steps A.1–A.3, finish part A (steps 4–5), then run parts B and C.
