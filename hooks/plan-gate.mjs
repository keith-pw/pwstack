// UserPromptSubmit hook: ticket work outside plan mode gets a "plan first" note.
// A text rule alone did not stop agents from coding before a plan.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const prompt = String(input.prompt ?? "");
const isTicket = /\bPWDEV-\d+\b/i.test(prompt) || /^\s*\/(pwstack:)?ticket\b/.test(prompt);

if (isTicket && input.permission_mode !== "plan") {
  const note = [
    "Plan gate: this prompt is about a ticket and the session is not in plan mode.",
    "If this session has no approved plan for this work yet: edit nothing.",
    "Research only, then call EnterPlanMode before any decision or edit.",
    "If the plan for this work was already approved in this session, ignore this note.",
  ].join(" ");
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: note } }),
  );
}
