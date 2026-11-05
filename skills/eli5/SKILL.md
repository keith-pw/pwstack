---
name: eli5
description: Explain something like the reader is five. With no argument, it explains your last message. With an argument, it explains that thing (a term, a finding, a step, a concept). Works from a side chat on the main session it came from.
argument-hint: "[what to explain; empty = your last message]"
disable-model-invocation: true
---

# ELI5

Explain: $ARGUMENTS

The conversation below means everything you can see, including the main session if this is a side chat forked from one.

## Pick the target

- **Argument empty.** The target is your last message in the conversation. Not the user's message, and not a tool result.
- **Argument names something in the conversation** ("the second finding", "the race condition", "step 3"). The target is that part. Ground the explanation in what was said about it there.
- **Argument names something not in the conversation.** Explain it on its own. If it is about this codebase or Pencilwrench and you don't already know it, take a quick look first. If you still don't know, say so. Don't guess.

If the argument could point at two things, pick the likelier one and name it in the first line, so the user can redirect.

Give the ELI5 explanation of the target.
