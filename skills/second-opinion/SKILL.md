---
name: second-opinion
description: Get a review from a second model (the opencode `review` agent, a GPT model) on a design plan or on local changes, then triage its findings. Use from /ticket (plan review) and /ship (code review), or when asked for a second opinion or an opencode review.
argument-hint: "<plan|code> <PWDEV-N>: <title>"
---

# Second opinion

Review: $ARGUMENTS

The opencode `review` agent (`~/.config/opencode/agents/review.md`, read-only) already knows what to check. The message only says what to review.

## 1. Run it

```sh
opencode run "<message>" --agent review -m openai/gpt-6.1-sol --variant high --dir "$(git rev-parse --show-toplevel)" --title "<PWDEV-N> <plan|code> review" > "$TMPDIR/review.md"
```

- **Plan review.** Message: "Review the attached design plan for <PWDEV-N>: <title>. Also follow the AGENTS.md of each folder it touches." Attach the plan with `-f <plan file>`. Outside the repo, opencode may read only `~/.claude/plans/**`. A file anywhere else (for example `$TMPDIR`) makes it hang: put that text in the message instead.
- **Code review.** Message: "Review the local uncommitted changes for <PWDEV-N>: <title>. Also follow the AGENTS.md of each folder they touch." On a branch with commits, say "the changes on this branch against origin/main" instead.
- Put the message first. `-f` takes every word after it as a file name.
- `--dir` is the repo (or worktree) root, so the reviewer reads the repo's files and its `AGENTS.md`.
- Pass `-m`. The default model is a free one that this opencode version cannot use.
- `--variant high` is the reasoning effort. `xhigh` is slower and adds more nitpicks.
- Run it with the Claude Code sandbox off (the user approves). It writes logs to `~/.local/share/opencode` and needs network access. Run it in the background: it can take several minutes.

If `opencode` fails, tell the user and stop. Do not swap in another reviewer.

## 2. Triage

Findings are hints, not orders. GPT models flag many small things, and their fixes are often not the simplest. For each finding:

1. Check that the problem is real: read the code, or show it with a test or a command.
2. Not real, or it changes no behavior, safety or repo rule: dismiss it, with a one-line reason.
3. Real: design the fix yourself. Look for the simplest one (an existing pattern, a library, a smaller change). Use the reviewer's fix only when it is the best one.
4. The fix needs a big decision: run `/decide`.

Add a test only when the reviewer names a regression that the current tests miss.

## 3. Report

One line per finding: fixed or dismissed, and why. Two review rounds at most.
