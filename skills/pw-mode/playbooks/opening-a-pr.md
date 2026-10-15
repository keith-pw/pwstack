### Opening a PR

Invoked at the end of every other playbook.

**Worktree.** Work from a git worktree off main; subagents inherit it. Give each concurrent `Task` its own worktree rather than sharing a branch. Dirty branch with unrelated work: patch out, fresh worktree, apply. Snarled worktree: make a fresh worktree from main and redo minimally. Never `git reset --hard` a branch that may hold uncommitted work. That is an irreversible action, so pause and confirm with the human first (pw-mode Autonomy).

**Commits.** Commit liberally; rebase into small, ordered commits before opening PRs. Each commit is a future PR: landable, ordered to tell the story. Amend when the fix belongs in a just-made commit; new commit when separable.

**PRs.** Run the **code-cleanup** skill over the diff before commit. Run the **no-comments** skill before review. Write every PR title, PR description, and commit body with the **technical-writing** skill, then apply the **unslop** skill. Apply every technical-writing layer except Diátaxis. Use one word for each action, keep articles, and avoid `-ing` when a plain verb works.

**Titles.** Use Conventional Commits in the form `type(scope): subject`. Use `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `perf` as the type. Use the changed area, such as `pwstack` or `pw-mode`, as the scope. Keep the subject short and imperative. Apply the same **technical-writing** and **unslop** pass as the body. Name a real symbol when one carries the change. For example, `fix(pwstack): retarget opening-a-pr babysit trigger`. Do not add a trailing period.

**Descriptions.** Use these sections in order. Drop a section when it is empty.

- `## Why`. State the intent and why this approach fits.
- `## Scope`. State facts from the diff. Name real symbols and paths. Name both sides of a rename or retarget. State what is in and out when the boundary matters.
- `## Tradeoffs`. State real choices only. Skip this section when there are none.
- `## Blast Radius`. State who and what the change touches. Explain why the change is safe or risky. If main is red without the fix, name the continuing cost.
- `## Verification`. State how you ran each check and its rigor. Name the real path, such as the project's `verify-*` skill or the targeted tests. State the outcome of each check, not only the command name.

After these sections, attach videos or screenshots when they prove a claim. Do not use `## Summary` or `## Test plan` boilerplate. A commit body does not restate its subject.

**Size and stacks.** Prefer five narrow PRs to one large PR. Stack follow-ups with `gh stack`: `gh stack init --base main` to start the stack off `main`, `gh stack add` to place each branch on top of the previous, `gh stack submit` to push the whole stack and open its PRs (each PR based on the branch below it, not on `main`), and `gh stack sync` to restack on the latest `main`. Keep the ordered stack visible to reviewers. Branch from main only for independent work. Rebase on `main` (via `gh stack sync`) before substantial stack work.

**Opening.** For independent work, open the PR with `gh pr create` targeting base `main` (omit `--draft`). For a stack, open with `gh stack submit` so each PR is based on the branch below it. Do not `gh pr create --base main` a stacked branch; that flattens the stack.

**Landing.** Opening a PR does not land it. Landing runs through the **Shipping** playbook: each PR earns an independent verdict, then the human merges bottom-up with `gh pr merge --match-head-commit <sha>` and `gh stack sync` after each merge. Never merge here just because checks are green.

**Readiness.** Open every PR ready, never as a draft. Some PR tools default to draft, so do not pass `--draft` to `gh pr create`. If a PR still opens as a draft, run `gh pr ready <number>`. Run `gh pr view <number>` before you refer to PR status.

**Babysit.** Opening a PR does not start a babysit. Post the URL and keep building. Finish the phase or stack first. Run a separate babysit pass only when the user asks for one after the whole stack exists. A babysit for each new PR stalls the build and spends checks on commits that later waves restart. Push back when feedback drifts from intent.

A subagent that opens a PR runs the **interrogate**, **code-cleanup**, and **no-comments** skills. It returns the URL and does not babysit. Return to the parent.
