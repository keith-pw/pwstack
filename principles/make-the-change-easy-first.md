# Make the Change Easy First

**When:** Apply to every code change, from planning to review. Each change must leave the code easier to change. When the code is not ready for the change, refactor first as its own slice, then make the easy change. Raise every shortcut to the user.

The user cares about the long-term health of this codebase, not only about the ticket in front of you. Work as a strategic programmer, not only a tactical one. Working code is not enough. Code that is harder to change after your diff is a cost the next ticket pays.

**Why:** Each shortcut makes the next change slower and riskier. The cost is small per ticket and large over a year. Only the agent who reads the code now sees it. If you do not raise it, nobody decides on it.

**Pattern:**
- **Ask before you build.** What makes this change harder than it should be? Name each smell, the refactoring that removes it, and how much of the change it makes simpler.
- **Make the change easy, then make the easy change.** When the code is not ready, the refactor comes first. It is its own slice, keeps behavior, and merges on its own. Build the change on top.
- **Do not pile new code onto a mess.** A copy instead of a shared piece, a special case in a long branch chain, a workaround, `any`, a forced cast, or a type that lies all make the code harder to change.
- **Raise it, do not decide it alone.** "Prepare first or build as it is" and every shortcut are big decisions for the user (`decide`). Give your honest pick. Push back like a senior engineer who owns this code for years, even when the refactor costs time now.
- **Say the cost.** Debt you could not avoid goes in the ship report under "Heads up", with what a fix would cost.

**The test:** after your diff, is the touched code easier or harder to change than before? If harder, the user must know before it ships.

"Build as it is" is the right pick only when the refactor does not make this change or the next likely ones simpler. Scope the refactor to what this change touches. A cleanup of code this change does not touch is a follow-up, not a prepare slice.

Related: [Redesign from First Principles](redesign-from-first-principles.md) shapes the design, [Subtract Before You Add](subtract-before-you-add.md) orders removal first, and [Laziness Protocol](laziness-protocol.md) keeps the change on top small.
