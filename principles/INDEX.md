## Principles

Read `<name>.md` in this folder in full before you apply a principle. Each entry says when it applies.

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
- **Use Libraries as Documented** (`use-libraries-as-documented`). Planning or writing a call to a library, framework, SDK or CLI. Read the docs for the pinned version and use their canonical pattern.

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
