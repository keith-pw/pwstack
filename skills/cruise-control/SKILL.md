---
name: cruise-control
description: Route a pwrench-server task to its playbook (Ticket, Ship) or skill, and apply the engineering principles. Use for /cruise-control <goal>, a PWDEV-N ticket, or "ship".
argument-hint: <goal, PWDEV-N, or "ship PWDEV-N">
disable-model-invocation: true
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/wait-copilot.sh *)
---

# Cruise control

Task: $ARGUMENTS

This skill's directory is `${CLAUDE_SKILL_DIR}` (the folder that holds this file). Playbooks call it `<cruise-control>`. Paths below are relative to it.

## Route

1. Match the task to one route in the table. When two routes fit, ask the user which one.
2. For a playbook: read it in full. Open the task list with the playbook's steps as the first items, before any task-specific items. A step you skip stays in the list with `skip: <reason>`.
3. For a skill: run it.
4. No route fits: say so in one line, then do the work under the principles below. Do not invent a playbook.

| The task | Route |
|---|---|
| A PWDEV-N ticket to plan and build ("work on PWDEV-N", "lets do PWDEV-N") | **Ticket** playbook: `playbooks/ticket.md` |
| The code is complete, or the user says "ship" or asks for the PR | **Ship** playbook: `playbooks/ship.md` |
| "How does X work", "where should this live" | `how` skill |
| "Why is it built this way", a regression's history | `why` skill |
| "What could this break" | `blast-radius` skill |
| One or more design decisions outside a ticket | `decide` skill |
| A bug to fix (no playbook yet) | [Fix Root Causes](principles/fix-root-causes.md) and the `tdd` skill. Ship with the Ship playbook. |
| A code review of a PR or diff (no playbook yet) | `second-opinion` and `blast-radius` skills, then [Prove It Works](principles/prove-it-works.md) on each finding |

## Non-negotiables

- Each playbook step lists the principles it needs. Read them when you reach that step. Outside a playbook, read the principles below whose trigger fits the task before you start.
- Every code change: [Make the Change Easy First](principles/make-the-change-easy-first.md).
- Before you say "done": [Prove It Works](principles/prove-it-works.md).
- The user owns these gates: plan approval (`ExitPlanMode`), big decisions (`decide`), and "ship". Never merge. Take a clear default for small decisions, list it, and continue.
- Prose for the user: the `unslop` skill. Docs, PR descriptions and commit messages: the `technical-writing` skill.

## Principles

Read `principles/<name>.md` in full before you apply a principle. Each entry says when it applies.

**Core**

- **Make the Change Easy First** (`make-the-change-easy-first`). Every code change. Leave the code easier to change. Refactor first as its own slice when the code is not ready. Raise every shortcut to the user.
- **Laziness Protocol** (`laziness-protocol`). Sizing a diff, or tempted to add abstractions or layers. Bias to deletion and the smallest change on top of the prepare step.
- **Foundational Thinking** (`foundational-thinking`). Before writing logic: core types and data structures, scaffold-before-feature order, what concurrent actors share.
- **Redesign from First Principles** (`redesign-from-first-principles`). A new requirement in an existing design. Redesign as if it had been there from day one.
- **Attack the Premise** (`attack-the-premise`). Two or more fixes that share one premise failed the same check. Write the premise down and test it before the next fix.
- **Subtract Before You Add** (`subtract-before-you-add`). Ordering an addition or refactor. Remove dead weight first.
- **Minimize Reader Load** (`minimize-reader-load`). Code that is hard to trace. Collapse one-caller wrappers, shrink mutable scope.
- **Experience First** (`experience-first`). Product or UX tradeoffs. Choose the user's result over implementation convenience. Scope comes from the ticket.
- **Build the Lever** (`build-the-lever`). Non-trivial edits, migrations, analyses or checks. Write the script that does or proves the work.

**Architecture**

- **Model the Domain** (`model-the-domain`). Stateful logic, or code that branches a lot or repeats a shape assumption. Encode the domain in a structure, not scattered conditionals.
- **Boundary Discipline** (`boundary-discipline`). Validation, error handling, framework adapters. Guard at boundaries (DRF serializers, external APIs), trust internal types.
- **Type System Discipline** (`type-system-discipline`). Designing types or a signature. Make illegal states unrepresentable. Derive from schemas (the OpenAPI spec and orval client).
- **Make Operations Idempotent** (`make-operations-idempotent`). Celery tasks, management commands, migrations, retries. Converge to the same end state.
- **Migrate Callers Then Delete Legacy APIs** (`migrate-callers-then-delete-legacy-apis`). A new internal API while old callers exist. Migrate and delete in the same PR stack.
- **Separate Before Serializing Shared State** (`separate-before-serializing-shared-state`). Concurrent writers to the same row, file, key or branch. Remove the sharing first.

**Verification**

- **Prove It Works** (`prove-it-works`). Before you say "done". Check the real artifact, not a proxy.
- **Fix Root Causes** (`fix-root-causes`). Debugging. Trace the symptom to the first wrong step and fix it there.
- **Sequence Verifiable Units** (`sequence-verifiable-units`). Multi-step work and how you stack commits and PRs. Check each small unit before the next. Failing test first, then the fix.
- **Test Behavior, Not Implementation** (`test-behavior-not-implementation`). Writing, changing or keeping a test. Assert what users of the code can observe.
- **Explain the Number** (`explain-the-number`). Before you trust or report a measured number. Name what limits it and rule out other causes.

**Delegation**

- **Guard the Context Window** (`guard-the-context-window`). Large outputs, long files, fan-out. Send bulk reading to subagents, keep summaries here.

**Meta**

- **Encode Lessons in Structure** (`encode-lessons-in-structure`). You write the same instruction a second time. Make it a lint, check or script instead.
