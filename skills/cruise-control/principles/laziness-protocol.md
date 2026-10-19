# Laziness Protocol

**When:** Apply when refactoring, evaluating diff size, or tempted to add abstractions, layers, or signal threading. Bias toward deletion and the smallest change that solves the problem.

- **Consolidate decisions.** Do not repeat the same choice in several places. Put it behind one source of truth and pass the result as a simple flag.
- **Minimize the diff.** Make the smallest change that solves the problem. Fewer lines beat "elegant" boilerplate.
- **Count the diff after the prepare step.** When the code is not ready for the change, the refactor that makes it ready is not extra diff. It is its own slice per [Make the Change Easy First](make-the-change-easy-first.md). Make the smallest change on top of it. A shortcut that saves lines now and makes the next change harder is debt, not laziness.
