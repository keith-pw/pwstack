---
name: setup-pwstack
description: Configure which Claude model pwstack uses per role. Detects your available Claude aliases and writes an optional JSON override that supersedes the skill defaults. Use for /setup-pwstack, "configure pwstack models", or changing pwstack's model choices.
disable-model-invocation: true
---

# Setup pwstack

Write `~/.claude/pwstack-models.json`, an optional per-role model override that pwstack's skills read and fall back from. Each skill carries an authoritative inline default, so pwstack works with zero config; this file only overrides those defaults for the roles you choose to set. Running it again overwrites the whole file, so re-runs stay idempotent.

## Steps

### 1. Detect available models

The model set is the Claude alias set: `opus`, `sonnet`, `haiku`, and `inherit`. These are the only values pwstack accepts. `inherit` means "omit the subagent model and run the role on the parent chat model" — use it to keep a role on whatever model the current chat is using. There is no external models API to query and no other slug to write. Do not offer or write any value outside this set.

### 2. Load current state

The default role-to-model mapping is the JSON shown in step 5. If `~/.claude/pwstack-models.json` already exists, read it and treat its values as the current choices. Otherwise start from those defaults.

### 3. Map and confirm

Show every role with its current model. Ask whether to accept as-is or change specific roles, offering `opus`, `sonnet`, `haiku`, and `inherit` as the options. Prefer `AskUserQuestion` over free text so the choices stay inside the allowed set.

Two role shapes:

- **Single-model roles** take one alias: `feature`, `refactoring`, `bug-fix`, `perf-issue`, `hillclimb`, `judgment and prose`, `hardest tasks`, `swarm workers`.
- **Panel roles** take a list, and the reading skill spawns one subagent per entry, so the list length sets the fan-out: `interrogate reviewers`, `arena runners`, `arena cross-judge`, `architect runners`. For `arena cross-judge` the skill selects one value from the list whose model family differs from the parent's when possible.

Only these roles exist here — they are the ones pwstack's skills actually read. The `how` and `why` skills read no model config, so they have no role to set.

### 4. Validate

Every value written must be one of `opus`, `sonnet`, `haiku`, or `inherit`. A panel role's value must be a non-empty list of those aliases. Reject anything else and ask again rather than writing an invalid file.

### 5. Write the file

Write `~/.claude/pwstack-models.json`, overwriting it whole so re-runs stay idempotent. Shape: `{ "version": 1, "roles": { "<role>": "<alias>" | ["<alias>", ...] } }`. A role you omit falls back to the skill's inline default; you do not have to list every role. The full default that pwstack would use with no file present:

```json
{
  "version": 1,
  "roles": {
    "feature": "sonnet",
    "refactoring": "sonnet",
    "bug-fix": "opus",
    "perf-issue": "opus",
    "hillclimb": "opus",
    "judgment and prose": "opus",
    "hardest tasks": "opus",
    "swarm workers": "sonnet",
    "interrogate reviewers": ["opus", "sonnet"],
    "arena runners": ["opus", "sonnet"],
    "arena cross-judge": ["opus", "sonnet"],
    "architect runners": ["opus", "sonnet"]
  }
}
```

### 6. Confirm

Tell the user the file was written to `~/.claude/pwstack-models.json` and that skills pick it up on their next run. Re-running this skill overwrites it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill`. On no, move on without pushing.
