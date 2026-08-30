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

### Principles (20)

Small, one rule each. Model-invocable: Claude loads them automatically when a task matches their "Apply when..." description. Also invocable directly via `/pwstack:principle-<name>`.

| Group | Skills |
|---|---|
| Core | laziness-protocol, foundational-thinking, redesign-from-first-principles, subtract-before-you-add, minimize-reader-load, outcome-oriented-execution, experience-first, exhaust-the-design-space, build-the-lever |
| Architecture | model-the-domain, boundary-discipline, type-system-discipline, make-operations-idempotent, separate-before-serializing-shared-state |
| Verification | prove-it-works, fix-root-causes, sequence-verifiable-units |
| Delegation | guard-the-context-window |
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

