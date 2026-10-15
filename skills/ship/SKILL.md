---
name: ship
description: Finish a change - run checks, clean up, get a second-model review of the diff, give the user short test steps, then after the user says "ship", commit, push, open the PR with Copilot review and move the Jira issue to In Review. Use when the code for a ticket or change is complete, or when the user says "ship" or "/ship".
argument-hint: PWDEV-N
---

# Ship

Issue: $ARGUMENTS (if empty, take it from the conversation or the branch name, or work without one).

The user cares about the long-term health of this codebase. A change that works but leaves the code harder to change is not ready to ship without the user knowing it.

## A. Prove it (no user input)

1. Checks pass:
   - the tests of each workspace or app the change touches (`yarn workspace <name> test`, never bare `vitest`; `pytest` for Django);
   - `yarn workspace <name> lint` and the typecheck for each touched workspace;
   - `yarn fmt:write`, then `yarn pre-commit:run`.
   If a check fails, fix it or tell the user. Never skip a hook or use `--no-verify`.
2. Run `/code-cleanup` on the change.
3. Codebase health: run the repo's `code-smells` agent on the diff. Ask: is the touched code easier or harder to change than before this change? Fix what is cheap to fix now. List the rest as debt for "Heads up".
4. Run `blast-radius` on the diff. Prove the main safety fact with a command, not with words.
5. Run `/second-opinion code <PWDEV-N>: <title>`. If you change code, run step 1 again.
6. Run the feature the way a user would.
   - A project verification skill exists (`.claude/skills/verify-*`): use it.
   - Otherwise: start Django and the app, log in with the repo's `pwrench-login` skill, and drive the browser. For Playwright E2E work, use the `e2e-tester` agent.
   - Note anything you could not check.
7. The plan's PR slices still match the diff. If not, update them.

## B. User check (stop and wait)

Send this, and keep it short. "Heads up" comes first and is never skipped. Write "Nothing" only when you checked every item below and found none.

Heads up lists, one line each, worst first:
- Something that is broken or fails now (a test, a feature, the build), even when it is outside this ticket.
- A change in behavior the user did not ask for, or a change from the approved plan.
- A risk you accepted, or a review finding you dismissed that the user may disagree with.
- A manual step: a new env var, a migration, a data fix, a feature flag.
- A new cost: a new dependency, paid API calls, slower queries.
- Debt this change adds: code that is now harder to change, a shortcut, a copy instead of a shared piece. Say what a fix would cost.
- Each default you took during the build without asking (the "Defaults I used" list).

```markdown
**Ready to ship <PWDEV-N>: <title>**

**Heads up:** <the items above, or "Nothing">
**What changed:** 3–5 bullets, plain words.
**Proved:** checks, review findings (fixed / dismissed counts), what you ran.
**PRs:** <one line per slice: name, file count>
**Test it yourself:**
1. <exact command or click>, and what you should see.
(5 steps or fewer)
**Not checked:** <anything you could not verify, or "nothing">

Say "ship" to commit, push and open the PR.
```

## C. On "ship"

1. `git status`. Stage only the files of this change.
2. Commit with the repo format (gitlint): `<type>(<scope>): <subject>`, imperative. Body: short bullets of what changed and why. One commit per slice at least.
3. Open the PRs. Title: `<type>(<scope>): <summary> [<PWDEV-N>]`. Base: `main`.
   - One slice: push the branch, then open the PR with the repo's `open-pr` skill and `--reviewer @copilot`.
   - More than one slice: build the stack with `gh stack` (`gh stack --help`), one branch per slice, and submit it. Then fill each PR body with the repo's `open-pr` format (Release Notes section) and add `@copilot` as a reviewer on each.
   - Open them ready, not as drafts. Run `gh pr view <number>` before you report a PR's state.
4. Jira: add a comment with the PR links, decisions taken and follow-ups (ADF JSON, see `acli jira workitem comment create --help`). Then move the issue to In Review: `acli jira workitem transition --key <PWDEV-N> --status "In Review" --yes`. If the status name is wrong, tell the user the error.
5. Do not merge. The user merges.
6. Follow-up work found during the ticket: show the text to the user and ask where it goes (an existing issue or a new one).
