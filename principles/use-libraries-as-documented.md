# Use Libraries as Documented

**When:** Apply before you plan or write code that calls a library, framework, SDK or CLI, or before you change how it is called. Read the current docs for the version the repo pins, and use the pattern they show.

Read the docs before you design the call. Use the canonical pattern the docs show. Treat memory and neighbouring code as leads to check, not as the source.

**Why:** Memory is out of date, and neighbouring code is evidence of a choice, not proof it was right. A pattern copied from either can be deprecated, wrong for the pinned version, or a workaround for a bug that is fixed. The library's authors document the usage they test and keep working across upgrades.

**The pattern:**
- **Find the pinned version.** Read it from the lockfile or manifest (`yarn.lock`, `package.json`, `poetry.lock`, `requirements*.txt`, `pyproject.toml`), not from the latest release.
- **Read the docs for that version.** Context7 MCP first. Then the official site or the library's own source at that version. A blog or an answer site is a lead, not the source.
- **Use the canonical pattern.** Call the API the way the docs show, with the options they recommend.
- **State every deviation.** When you must differ from the docs (a bug in the pinned version, a project constraint), write the reason in the plan or in a code comment at the call.

**The tests:**
- "Which docs page, for which version, shows this pattern?" If you cannot name one, read the docs before you go on.
- "Does this call differ from the documented pattern?" If yes, the reason is written down next to it.
