# Porting notes: pstack → pwstack

pwstack is a Claude Code port of **pstack** by Lauren Tan.

- Upstream: https://github.com/cursor/plugins/tree/main/pstack
- Ported from pstack version **0.14.5**.
- The local pstack copy used for this port was a plain directory, not a git
  repository, so provenance below cites the file path at version 0.14.5, not a
  commit SHA. To find the exact upstream commit for any row, look up that path
  in the upstream repository at the 0.14.5 tag.

This file records every deletion and alteration made during the port. It accrues
one section per delivered unit.

## Dropped (not ported)

| Item | pstack path (v0.14.5) | Reason |
|---|---|---|
| make-bot-ui | skills/make-bot-ui/ | Cursor Routines + Grok Bot webhook + Tailscale. No Claude Code analog. |
| reflect | skills/reflect/ | Depends on Cursor agent-transcripts and multi-vendor review. Out of scope. |
| recall | skills/recall/ | Depends on Cursor agent-transcripts. |
| automate-me | skills/automate-me/ | Depends on Cursor transcripts and the built-in create-skill flow. |
| eval | skills/poteto-mode/playbooks/eval.md | Requested drop. |
| session-pickup | skills/poteto-mode/playbooks/session-pickup.md | Depends on Cursor transcripts; conflicts with human-in-loop. |
| worktree-cleanup | skills/poteto-mode/playbooks/worktree-cleanup.md | Cursor worktree paths; requested drop. |
| worktree-audit.sh | skills/poteto-mode/scripts/worktree-audit.sh | Support script for worktree-cleanup. |
| orchestrate | skills/poteto-mode/playbooks/orchestrate.md | Cloud-fleet program. No cloud, human-in-loop. |
| autopilot-full | skills/poteto-mode/playbooks/autopilot-full.md | Cloud-fleet full autonomy. |
| autopilot-stack | skills/poteto-mode/playbooks/autopilot-stack.md | Cloud-fleet full autonomy. |
| autonomous-run | skills/poteto-mode/playbooks/autonomous-run.md | Full autonomy. Human-in-loop policy. |
| pause-safely | skills/poteto-mode/playbooks/pause-safely.md | Complement of dropped autonomy playbooks. |
| orch scripts | skills/poteto-mode/scripts/orch/ | Support for orchestrate. |
| watch-pr scripts | skills/poteto-mode/scripts/watch-pr/ | Bun dependency; babysit rebuilt on gh. |
| bootstrap.ts, package.json, bun.lock | skills/poteto-mode/scripts/ | Served orch/watch-pr; break zero-setup. |
| automations/benny/ | automations/benny/ | Cursor .cursor/settings.json project-plugin model. |

## Altered (ported with changes)

| item | pstack path (v0.14.5) | what changed |
|---|---|---|
| pw-agent | agents/poteto-agent.md | Renamed poteto-agent to pw-agent; dropped `is_background`; added `model: sonnet`; body rewritten poteto→pw, poteto-mode→pw-mode; reads `pw-mode` SKILL.md in full before work. |
| comment-sicko | agents/comment-sicko.md | `name` changed from "Comment Sicko" to `comment-sicko`; added `model: sonnet`; H1 heading changed to `comment-sicko`; behavior kept. |
| principle-migrate-callers-then-delete-legacy-apis | skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md | Dropped `disable-model-invocation`; frontmatter reduced to `name` + `description`; body unchanged (no poteto/pstack/cursor references present). |
| principle-never-block-on-the-human | skills/principle-never-block-on-the-human/SKILL.md | Dropped `disable-model-invocation`; rewrote description and body so confirmation is not reserved to irreversible actions alone — it also pauses for genuine product/preference forks and surfaces the choice. |
| code-cleanup | ~/.claude/skills/code-cleanup/SKILL.md (user's, not pstack) | Copied verbatim from the user's ~/.claude/skills; already Claude-Code-clean (references AGENTS.md and `unslop`). |
| tdd | skills/tdd/ | Removed disable-model-invocation; mechanical scrub, no other changes needed. |
| technical-writing | skills/technical-writing/ | Removed disable-model-invocation; namespaced /technical-writing -> /pwstack:technical-writing. |
| no-comments | skills/no-comments/ | Removed disable-model-invocation; "Comment Sicko" -> comment-sicko and subagent_type: pwstack:comment-sicko; namespaced sibling slash refs. |
| create-verification-skill | skills/create-verification-skill/ | Removed disable-model-invocation; output path .cursor/skills/verify-* -> .claude/skills/verify-*; namespaced sibling slash refs. |
| maintain-verification-skill | skills/maintain-verification-skill/ | Removed disable-model-invocation; .cursor/skills/verify-* -> .claude/skills/verify-*; source-wave subagent set to Explore. |
| show-me-your-work | skills/show-me-your-work/ | Removed disable-model-invocation; deleted the .cursor agent-transcripts self-audit section; kept local decisions.tsv + scripts/log.sh. |
| architect | skills/architect/ | Removed disable-model-invocation; Phase B runners opus+sonnet as read-only Explore via ~/.claude/pwstack-models.json (role `architect runners`) with inline default; bundled paths to ${CLAUDE_PLUGIN_ROOT}; "different model family" softened. |
| arena | skills/arena/ | Removed disable-model-invocation; runners + cross-judge opus+sonnet as local background read-only Explore; candidates return artifact via report; de-clouded spawns. |
| interrogate | skills/interrogate/ | Removed disable-model-invocation; reviewers opus+sonnet as Explore (dropped generalPurpose + readonly:true); deleted slug-rejection paragraph; noted 2-reviewer default means unanimity. |
| swarm | skills/swarm/ | Removed disable-model-invocation; fully de-clouded (removed environment cloud/local, cloud_base_branch); workers general-purpose local background, default sonnet; low default width, serial unless isolatable; temp path to $TMPDIR. |
| figure-it-out | skills/figure-it-out/ | Removed disable-model-invocation; removed Eval route (orchestrate absent); kept show-me-your-work; poteto-mode -> pw-mode; "different model family" softened. |
| pw-mode | skills/poteto-mode/SKILL.md | Router rewritten: dropped mode/icon/color/reminder; kept disable-model-invocation (user mode); 15-playbook catalog; routed-skills line dropped reflect; Claude subagents (sonnet code / opus judgment, pwstack:pw-agent); human-in-loop autonomy; generated 21-principle index; Copilot-review triage; gh stack. |
| build-principles-index.mjs | new (no pstack equivalent) | Generates pw-mode's Principles index from skills/principle-*/SKILL.md frontmatter; emits 21 grouped bullets. |
| authoring-a-skill | skills/poteto-mode/playbooks/authoring-a-skill.md | Removed Cursor create-skill delegation; self-contained scaffold + unslop; pwstack path/invocation conventions. |
| bug-fix | skills/poteto-mode/playbooks/bug-fix.md | Model default -> opus; control skill -> verify-*; Cursor /loop -> /loop. |
| feature | skills/poteto-mode/playbooks/feature.md | Model default -> sonnet. |
| hillclimb | skills/poteto-mode/playbooks/hillclimb.md | Model default -> opus; dropped autonomous-run + cloud language; kept show-me-your-work. |
| investigation | skills/poteto-mode/playbooks/investigation.md | Scrub-only. |
| perf-issue | skills/poteto-mode/playbooks/perf-issue.md | Model default -> opus; control skill -> verify-*. |
| prototype | skills/poteto-mode/playbooks/prototype.md | control skill -> verify-*. |
| refactoring | skills/poteto-mode/playbooks/refactoring.md | Model default -> sonnet; control skill -> verify-*. |
| runtime-forensics | skills/poteto-mode/playbooks/runtime-forensics.md | control skill -> verify-*; de-clouded. |
| trace-forensics | skills/poteto-mode/playbooks/trace-forensics.md | Scrub-only. |
| visual-parity | skills/poteto-mode/playbooks/visual-parity.md | control skill -> verify-*. |
| opening-a-pr | skills/poteto-mode/playbooks/opening-a-pr.md | Graphite/gt -> gh stack; landing via gh pr create/merge base main; /deslop -> code-cleanup; control-cli/ui -> verify-*; de-clouded. |
| multi-phase-plan | skills/poteto-mode/playbooks/multi-phase-plan.md | Redesigned cloud/autonomous program -> human-driven plan; dropped Program checklist/goal/30-min tick/cloud VM/git show origin paths/Graphite; verify-* live block, variable serial-by-default lanes; bottom-up gh pr merge + gh stack sync; human review gate. |
| check-plan.mjs | skills/poteto-mode/scripts/check-plan.mjs | Dropped PROGRAM markers + ten-lane rule + grok LANES string; live lanes now variable (>=1, contiguous); operator -> human; Node built-ins. Added fixtures/plan-good.md and plan-bad.md. |
| shipping | skills/poteto-mode/playbooks/shipping.md | Redesigned: independent per-PR Explore verification at pinned SHA; patch-id rebase check; removed Graphite merge-when-ready/auto-merge; human merges bottom-up via gh pr merge --match-head-commit + gh stack sync; de-clouded. |
| babysit | skills/poteto-mode/playbooks/babysit.md | Rebuilt on gh (watch-pr dropped): verdicts from gh pr view/checks + gh api + gh stack view; status table; /loop rearm (local); Copilot+security review triage; stops at merge-ready, never merges. |
| pr-review-triage | skills/poteto-mode/references/bugbot-triage.md | Renamed + rewritten around GitHub Copilot review + security reviewer via gh api; Bugbot/Cursor scrubbed; gt ls -> gh stack view. |
| setup-pwstack | skills/setup-pstack/SKILL.md | Writes ~/.claude/pwstack-models.json (JSON) instead of Cursor .mdc rule; model set restricted to opus/sonnet/haiku/inherit; dropped Cursor models API; AskQuestion -> AskUserQuestion; roles narrowed to those skills read (how/why roles dropped). |
| docs pointer | new (no pstack equivalent) | New docs/README.md: pstack guide docs not yet ported; links upstream guide; skills self-contained meanwhile. |
| README.md | (pwstack existing) | Fixed principle count 20 -> 21; added the two ported principles; added pw-mode router, workflow skills, playbooks (15), agents sections. |
| plugin.json | (pwstack existing) | Version bump; description/keywords extended for the workflow layer. |

## Renamed

| From (pstack) | To (pwstack) |
|---|---|
| poteto-mode | pw-mode |
| poteto-agent | pw-agent |
| Comment Sicko | comment-sicko |
| setup-pstack | setup-pwstack |
| references/bugbot-triage.md | references/pr-review-triage.md |
| ~/.cursor/rules/pstack-models.mdc | ~/.claude/pwstack-models.json |
