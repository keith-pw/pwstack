# PWStack

Engineering workflows for pwrench-server: take Jira work from ticket to PR, with skills to explore, decide, review and write. Some skills are adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto (MIT).

## Install

```bash
claude plugin marketplace add ~/code/pwstack
claude plugin install pwstack@pencilwrench-plugins
```

Then run `/reload-plugins`, or start a new session. Check with `claude plugin list`.

## Update

The install is a cache pinned to a git commit and a version. Uncommitted edits do not reach it. To pick up changes, bump `version` in `.claude-plugin/plugin.json`, commit, then:

```bash
claude plugin marketplace update pencilwrench-plugins
claude plugin update pwstack@pencilwrench-plugins
```

## Workflows

### Ticket

`/ticket PWDEV-N` → plan (with `/decide` and `/second-opinion`) → build → `/ship` → PR.

| Skill | Use when |
|---|---|
| `ticket` | Start a Jira ticket. Plan mode, research, decisions, a reviewed plan with PR slices, then the build. |
| `decide` | Design choices. Sorts them into big, small and detail. Asks the user only about the big ones. |
| `second-opinion` | A GPT review (opencode `review` agent) of a plan or a diff, then triage of its findings. |
| `ship` | The code is complete. Checks, cleanup, review, a test-it-yourself list, then commit, PR and Jira on "ship". Then it waits for Copilot and verifies its comments. |

The plugin also adds a `UserPromptSubmit` hook (`hooks/plan-gate.mjs`). When a prompt names a PWDEV ticket outside plan mode, it tells the agent to plan first.

## Other skills

| Skill | Use when |
|---|---|
| `how` | "How does X work?" Parallel explorers plus an explainer. Critique mode on request. |
| `why` | "Why is it built this way?" Cited evidence from git, Jira, docs, Datadog, Sentry and PostHog. |
| `blast-radius` | A change could break something beyond the diff. Proves safety by running code. |
| `code-cleanup` | Once, before you push a finished change. |
| `tdd` | A failing test first. |
| `technical-writing` | Docs, RFCs, PR descriptions, commit messages. |
| `unslop` | Cut AI tells from any writing. |

## Needs

`acli` (Jira), `gh` with the `gh stack` extension, and `opencode` with a `review` agent.
