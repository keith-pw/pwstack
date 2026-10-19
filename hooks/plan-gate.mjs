// UserPromptSubmit hook: ticket work outside plan mode gets a "plan first" note.
// A text rule alone did not stop agents from coding before a plan.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const input = JSON.parse(readFileSync(0, "utf8"));
const prompt = String(input.prompt ?? "");
// "ship PWDEV-N" finishes approved work, so it must not send a fresh session back to planning.
const isShip = /^\s*(\/\S+\s+)?ship\b/i.test(prompt);
const isTicket = /\bPWDEV-\d+\b/i.test(prompt) && !isShip;
// The router is not model-invocable, so point at its file for prompts that skipped /cruise-control.
const router = fileURLToPath(new URL("../skills/cruise-control/SKILL.md", import.meta.url));

if (isTicket && input.permission_mode !== "plan") {
  const note = [
    "Plan gate: this prompt is about a ticket and the session is not in plan mode.",
    "If this session has no approved plan for this work yet: edit nothing.",
    "Research only, then call EnterPlanMode before any decision or edit.",
    "If the plan for this work was already approved in this session, ignore this note.",
    `If cruise-control is not loaded in this session, read ${router} and follow its route for this prompt.`,
  ].join(" ");
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: note } }),
  );
}
