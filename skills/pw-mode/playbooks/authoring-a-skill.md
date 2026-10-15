### Authoring or modifying a skill

**You own the skill's voice.** Agent-facing prose has a higher bar than human prose; unhelpful sentences become instructions.

1. Scaffold the skill yourself. Create `skills/<name>/SKILL.md` with YAML frontmatter carrying `name` (lowercase-kebab, matching the directory) and `description` (a "Use when… / Apply when…" trigger line so the router fires it on the right work). Add a `references/` subdir only when the body points to bundled files, addressed as `${CLAUDE_PLUGIN_ROOT}/skills/pw-mode/...`.
2. Write the body. Own every sentence; prose earns its keep by changing a decision.
3. Validate: frontmatter has `name` and `description`, referenced files exist, cross-skill links resolve, and the slash invocation reads `/pwstack:<name>`. Test cases if structural; skip if subjective.
4. Run the **unslop** skill over the SKILL.md.
5. Run **Opening a PR**.

When in doubt, delete; prose earns its keep by changing a decision. Tell it to do the thing and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources (types, READMEs, config); hardcoded details go stale (the **encode-lessons-in-structure** principle skill). Delegate to other skills by path; don't restate. A workflow you keep hitting but isn't captured → propose a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.
