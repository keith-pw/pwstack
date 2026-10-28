---
name: code-cleanup
description: Runs once when the code for a feature or bug fix is complete, before it is pushed. You re-read AGENTS.md, look at all your changes with a fresh set of eyes, and clean them up.
---

# Code cleanup

You wrote this change, so you know where you struggled, retried or worked around something. Use that. Step back and look at it as the engineer who must maintain it next.

1. Read AGENTS.md in the project again: the root one and the one in each folder you touched. Do this even if you read them earlier.
2. Read all the changes you did: the whole diff against the base branch, plus uncommitted changes. Include tests. Do not filter files out.
3. Look at them with a fresh set of eyes. See if anything can be simplified, and look for issues or gaps. Start where you struggled during the build.
4. Fix what you find. Behavior must not change. If a fix changes behavior or needs a design change, tell the user instead.

## Scope

- Lines the diff added, changed or rewrote are in scope.
- "It was already like that" is a reason to skip only for lines the diff did not change.
- When the diff rewrites a block, for example changes what every branch of a chain compares, the whole block must meet the AGENTS.md rules.

## What to look for

- Clean and simple solutions are preferred.
- Follow SOLID principles, Martin Fowler concepts and general technology stack related best practices.
- Comments should follow the instructions set in the AGENTS.md file and `unslop` skill.
- Build leftovers: debug output, commented-out code, a TODO with no ticket, unused imports, variables or parameters, skipped or focused tests, scratch files.
- Code the diff made dead: an old path, helper, type or test that nothing uses now. Delete it.
- Broken AGENTS.md rules: check each change against the rules you re-read in step 1. Check each rule's intent, not only its words: "use `Match` over `switch`" covers a chain of ternaries too.

## Report

One line: short description of what you fixed, or "Cleanup: nothing found."
