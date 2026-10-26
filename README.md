# PWStack

Engineering workflows for PencilWrench: take Jira work from ticket to PR, with skills to explore, decide, review and write. Some skills are adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto (MIT).

## Install

Install pwstack in pwrench-server only (`--scope local`), not for your user. The default scope is `user`, which loads it in every project. Run from pwrench-server.

From GitHub (the repo is private, so you need access to `keith-pw/pwstack`):

```bash
cd ~/code/pwrench-server
claude plugin marketplace add keith-pw/pwstack
claude plugin install pwstack@pencilwrench-plugins --scope local
```

From a local clone at `~/code/pwstack`, to try changes before you push them:

```bash
cd ~/code/pwrench-server
claude plugin marketplace add ~/code/pwstack
claude plugin install pwstack@pencilwrench-plugins --scope local
```

Then run `/reload-plugins`, or start a new session. Check with `claude plugin list` from pwrench-server: pwstack shows `Scope: local` and `Status: ✔ enabled`.

## Update

The install is a cache pinned to a git commit and a version. Uncommitted edits do not reach it. To pick up changes, bump `version` in `.claude-plugin/plugin.json` and commit. Push too if you installed from GitHub. Then run from pwrench-server:

```bash
cd ~/code/pwrench-server
claude plugin marketplace update pencilwrench-plugins
claude plugin update pwstack@pencilwrench-plugins --scope local
```

A Claude Code worktree under `pwrench-server/.claude/worktrees/` has its own local install. Run the update from that worktree too, or it keeps the old version.

## Cruise control

`/pwstack:cruise-control <goal>` is the front door. It matches the goal to a playbook or a skill, and applies the engineering principles on the way.

```text
/pwstack:cruise-control PWDEV-123
/pwstack:cruise-control ship PWDEV-123
/pwstack:cruise-control how does <feature> work?
```

| Playbook | Use when |
|---|---|
| Ticket | Start a Jira ticket. Research, decisions, a plan reviewed by agents, then the build. No plan mode: the build starts when the decisions are answered and the plan review has no blocking or major finding left. More than 2 PR slices: it proposes child tickets. |
| Ship | Each slice gets checks, cleanup and `review-code` against the slice below before the next slice starts. Then a test-it-yourself list, and push, PRs and Jira on "ship". Then it waits for Copilot and verifies its comments. |

Playbooks live in `skills/cruise-control/playbooks/`. A debugging playbook is planned. Until then, cruise control routes bugs to principles and skills. Code review goes to the `review-code` skill.

The principles live in `principles/`, one file each, with their triggers in `principles/INDEX.md`. Steer the agent with a principle's name: "apply prove it works, run the real import and show me the rows". Most are adapted from pstack. `make-the-change-easy-first` is ours: each change must leave the code easier to change.

Start ticket work with `/pwstack:cruise-control PWDEV-N`. A plain "work on PWDEV-N" does not load the Ticket playbook, so the agent skips the research, decisions and plan review.

## Other skills

| Skill | Use when |
|---|---|
| `decide` | Design choices. Sorts them into big, small and detail. Asks the user only about the big ones. |
| `review-plan` | Adversarial review of a plan. Ticket step 5 runs it. |
| `review-code` | Adversarial review of a diff or branch. Ship runs it. Give it a PR number (`/pwstack:review-code 1234`) to review a PR: report only, no tests run, no GitHub comments. |
| `how` | "How does X work?" Parallel explorers plus an explainer. Critique mode on request. |
| `why` | "Why is it built this way?" Cited evidence from git, Jira, docs, Datadog, Sentry, PostHog and the Pencilwrench MCP. |
| `blast-radius` | A change could break something beyond the diff. Proves safety by running code. |
| `code-cleanup` | Once, before you push a finished change. |
| `tdd` | A failing test first. |
| `technical-writing` | Docs, RFCs, PR descriptions, commit messages. |
| `unslop` | Cut AI tells from any writing. |

## Review

`review-plan` and `review-code` start the `review-lead` agent. It runs the reviewers in parallel, merges duplicate findings, tries to disprove each one, and returns only what survives. The main agent then decides each fix.

| Reviewer | Model | Plan | Code | Job |
|---|---|---|---|---|
| `rules-checker` | Haiku | yes | yes | `AGENTS.md` rules of the touched folders; code that rebuilds something that exists |
| `gap-adversary` | Sonnet | yes | yes | Acceptance criteria, missing cases, wrong assumptions, tests that prove nothing |
| `principles-checker` | Sonnet | yes | yes | The principles in `principles/` whose trigger fits the work |
| `gpt-adversary` | GPT (opencode) | yes | yes | Tries to break the work. Code: correctness, what breaks outside the diff, data, races, performance, auth and injection, temporary code, failure handling. Plans: premise, assumptions, failure modes, contracts and operations, slice order |
| `code-smells` | Sonnet | no | yes | The repo's own agent: structural smells and the refactorings that remove them |

The GPT reviewer runs the opencode `adversary` agent from `opencode/agents/adversary.md`. Its config denies edits, and its prompt keeps the rest read-only: no writes and no state changes. Bash is not limited by config, so a background review never stops on a permission rule. Link it into opencode once:

```bash
ln -s ~/code/pwstack/opencode/agents/adversary.md ~/.config/opencode/agents/adversary.md
```

## Needs

`acli` (Jira), `gh` with the `gh stack` extension, and `opencode` with the `adversary` agent linked (see Review).
