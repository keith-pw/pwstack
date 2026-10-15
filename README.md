# PWStack

Pencilwrench's engineering skills for Claude Code. Adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto (MIT).

The goal: agents you can trust. Each skill encodes how a rigorous engineer works, so agents verify instead of guess and write less, higher-quality code.

## Install

Register the marketplace, install the plugin, then reload:

```bash
# Local clone (before the GitHub rollout)
claude plugin marketplace add ~/code/pwstack
claude plugin install pwstack@pencilwrench-plugins
```

```bash
# From GitHub (once the repo is pushed to the org)
claude plugin marketplace add Pencilwrench/pwstack
claude plugin install pwstack@pencilwrench-plugins
```

Then run `/reload-skills` in an open session, or start a new one. Verify with `claude plugin list`.

> Do not rely on a settings-only install. Adding `extraKnownMarketplaces` + `enabledPlugins` to `~/.claude/settings.json` by hand does not register the marketplace; the CLI commands above do, and they record the enablement themselves.

## Update

The install is a cache pinned to a git commit. To pick up changes:

```bash
git -C ~/code/pwstack add -A && git -C ~/code/pwstack commit -m "chore: update skills"
claude plugin marketplace update pencilwrench-plugins
```

Then `/reload-skills`. Uncommitted edits never reach the installed plugin.

## Skills

### Principles (21)

Small, one rule each. Model-invocable: Claude loads them automatically when a task matches their "Apply when..." description. Also invocable directly via `/pwstack:principle-<name>`.

| Group | Skills |
|---|---|
| Core | laziness-protocol, foundational-thinking, redesign-from-first-principles, subtract-before-you-add, minimize-reader-load, outcome-oriented-execution, experience-first, exhaust-the-design-space, build-the-lever |
| Architecture | model-the-domain, boundary-discipline, type-system-discipline, make-operations-idempotent, separate-before-serializing-shared-state, migrate-callers-then-delete-legacy-apis |
| Verification | prove-it-works, fix-root-causes, sequence-verifiable-units |
| Delegation | guard-the-context-window, never-block-on-the-human |
| Meta | encode-lessons-in-structure |

### Workflow skills

| Skill | Use when |
|---|---|
| `blast-radius` | A small diff could break something beyond the diff. Proves safety by running code. |
| `how` | "How does X work?" Parallel explorers plus an explainer; critique mode on request. |
| `why` | "Why is it built this way?" Parallel investigators across git/gh, Jira (acli), in-repo docs, Datadog (pup), Sentry, and PostHog, then a cited, confidence-calibrated synthesis. |
| `teach` | You want to actually understand a change or subsystem. |
| `unslop` | Cut AI tells from any writing. |
| `bro` | Restate the last message in plain language. |
| `typescript-best-practices` | Reading or editing any .ts or .tsx file. |
| `architect` | Code crossing a function boundary. Sketches types and module shape before implementing. |
| `arena` | A design or code bakeoff. Spawns N candidates, picks a base, grafts the best parts. |
| `interrogate` | Contested design. Two Claude reviewers (opus, sonnet) pressure-test it before shipping. |
| `swarm` | Parallel fan-out for coverage, races, or exploration. Local subagents, isolation-bounded width. |
| `figure-it-out` | A large or cross-cutting task with no narrower playbook. Designs a bespoke, human-in-loop plan. |
| `show-me-your-work` | An auditable decision log (a gitignored `decision.tsv`) for multi-step work. |
| `no-comments` | Before review. Spawns `comment-sicko` to strip narrating comments. |
| `technical-writing` | Docs, RFCs, PR descriptions, commit messages. |
| `tdd` | Test-driven development. |
| `code-cleanup` | Before pushing. A fresh-eyes simplification pass against AGENTS.md and `unslop`. |
| `create-verification-skill` / `maintain-verification-skill` | Generate and keep a repo-local `verify-*` skill that launches and drives your app. |
| `setup-pwstack` | Optional. Overrides the default per-role model choices. Not required. |

## pw-mode

`pw-mode` is the router. Invoke it with `/pwstack:pw-mode <goal>`. It reads the Principles index, matches your task to one of 15 playbooks, copies that playbook's steps into a todolist, and calls the other skills as the steps need them.

It ships zero-config: the routing skills that pick a subagent model carry an authoritative inline default (`sonnet` for code, `opus` for judgment and prose), and `how` / `why` inherit your session model. Nothing needs setup. Run `/pwstack:setup-pwstack` only if you want to override the per-role model choices; it writes `~/.claude/pwstack-models.json`.

pw-mode keeps a human in the loop. It proceeds on reversible work and pauses for irreversible actions and genuine product decisions. It is never fully autonomous.

### Playbooks (15)

Investigation, Bug fix, Perf issue, Hillclimb, Runtime forensics, Trace forensics, Feature, Refactoring, Prototype, Visual parity, Authoring a skill, Babysit, Shipping, Multi-phase plan, Opening a PR.

Stack work uses `gh stack` and `gh pr merge` on base `main`. PR-review triage targets GitHub Copilot review and the security reviewer.

## Agents

| Agent | Role |
|---|---|
| `pw-agent` | The pw-mode delegate. Reads pw-mode's SKILL.md before any work. |
| `comment-sicko` | Fresh-context reviewer that `no-comments` spawns to find narrating comments. |

