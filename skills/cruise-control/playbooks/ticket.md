# Ticket

Take a Jira ticket (PWDEV-N) from the issue to an approved plan, then build it. The ticket is the PWDEV key in the user's prompt.

Apply [Make the Change Easy First](../principles/make-the-change-easy-first.md) at every step. Step 3 finds what makes the change hard, step 4 raises it, step 8 stops on shortcuts.

Follow the steps in order.

## 1. Plan mode

Be in plan mode before step 2. If you are not, write "This ticket needs a plan first." and call `EnterPlanMode`. Until the plan is approved, edit nothing (the plan file is the only exception).

## 2. Read and restate

1. Get the issue with `acli jira workitem view <PWDEV-N>`, with its comments, parent and linked issues. Note its acceptance criteria.
2. Read the root `AGENTS.md` and the `AGENTS.md` of each folder the issue touches. Read the `.agents/instructions/` files they link for this kind of work (TDD, E2E, code readability).
3. Look for a design doc or plan for this work under `docs/**`.
4. Tell the user, in 3–5 plain lines: the problem, what "done" looks like, and what is out of scope. Ask only if the issue is unclear. Otherwise continue. The user interrupts if you got it wrong.

## 3. Ground

Run these in parallel subagents. Each returns 500 words or fewer, with `file:line` evidence. Keep raw file dumps out of the main context.

- `how`: how the code that the issue touches works now.
- `why`: the reasons behind that code (git history, Jira, docs, Sentry, Datadog, PostHog).
- `blast-radius`: what else reads or writes the data, contracts or files this change will touch.
- The repo's `code-smells` agent, on the code this change touches: what makes this change harder than it should be? Name each smell, the refactoring that removes it, and how much of the change it makes simpler.

## 4. Decisions

Read these principles first, in full: [Make the Change Easy First](../principles/make-the-change-easy-first.md), [Redesign From First Principles](../principles/redesign-from-first-principles.md), [Model the Domain](../principles/model-the-domain.md). They apply to steps 4 and 5.

List all the decisions this ticket needs. Settle details yourself.

Always include "prepare first?" when step 3 found code that makes this change harder: refactor first, or build on the code as it is. Give your honest pick. "Build as it is" is the right pick only when the refactor does not make this change or the next likely ones simpler.

- No decisions: write "No decisions needed:" and one line for the reason. Go to step 5.
- Otherwise, run `/decide` once, with all of them. It sorts them, researches them in one pass, and asks the user in rounds.

## 5. Plan

Write the plan file. Keep it under about 80 lines. Sections:

- **Goal**: 1–2 lines, and the acceptance criteria.
- **Decisions**: one line each, with the user's choice.
- **Prepare first**: the refactor that makes this change easy, and why. Or "None:" and one line for the reason.
- **Changes**: per app or package, the files and what changes.
- **Tests**: for each test, the regression it catches. One test per behavior. No tests that repeat the implementation or test a library.
- **Verify**: the commands you will run, and how the user can test it (5 steps or fewer).
- **PR Slices**: the team format from the root `AGENTS.md` ("PR sizing"): one `### Slice N: <name>` per PR, file bullets, 5–15 files each. One slice is fine for a small change. A "prepare first" refactor is its own slice and comes first, so it can merge on its own.
- **Review**: filled in by step 6.

Add a mermaid diagram only when a flow is hard to follow in text.

## 6. Review the plan

Run `/second-opinion plan <PWDEV-N>: <title>` on the plan. Fill in the plan's **Review** section from its report.

## 7. Approval

Call `ExitPlanMode`. The user approves or sends changes.

## 8. Build

Read these principles first, in full: [Test Behavior, Not Implementation](../principles/test-behavior-not-implementation.md), [Laziness Protocol](../principles/laziness-protocol.md), [Sequence work into verifiable units](../principles/sequence-verifiable-units.md).

1. Before any code, move the issue to In Progress: `acli jira workitem transition --key <PWDEV-N> --status "In Progress" --yes`. Then read the status back with `acli jira workitem view <PWDEV-N> --fields status`. Report only a status you read. If the move fails, tell the user the error and go on.
2. Work on a branch `<PWDEV-N>-<short-name>` off `main`. In a fresh worktree, run `yarn setup` first.
3. Build to the plan, test first (the repo's TDD rule: Red → Green → Refactor). Finish each slice on its own branch and run its checks before you start the next slice. Split work by the repo's "Agent Selection" table, except: never use the `react-frontend` agent. Do React work yourself.
4. A new decision comes up: a small one gets a clear default, added to a "Defaults I used" list. A big one: stop and run `/decide`.
5. The plan turns out wrong (the same workaround in many places, `any`, forced casts, a type that lies): stop and tell the user in two lines. Do not patch around it. A shortcut that makes the codebase worse is a decision for the user, not a detail.
6. Something breaks that the plan does not cover (a test or feature outside this ticket, data, the build): stop and tell the user in two lines. Keep a list of everything you find on the way. The Ship playbook puts it under "Heads up".
7. When the code is complete, run the [Ship](ship.md) playbook.
