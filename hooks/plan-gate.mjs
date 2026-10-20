// UserPromptSubmit hook: ticket work outside plan mode gets a "plan first" note.
// A text rule alone did not stop agents from coding before a plan.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const input = JSON.parse(readFileSync(0, "utf8"));
const prompt = String(input.prompt ?? "");

// Task notifications and subagent reports arrive as prompts too, and they often name the ticket.
const isFromAgent = /^\s*(<task-notification>|Another Claude session sent a message)/.test(prompt);
// "ship PWDEV-N" finishes approved work, so it must not send a fresh session back to planning.
const isShip = /^\s*(\/\S+\s+)?ship\b/i.test(prompt);
const namesTicket = /\bPWDEV-\d+\b/i.test(prompt) || /^\s*\/(pwstack:)?cruise-control\s+\d+\b/.test(prompt);

const planApproved = () => {
  try {
    return readFileSync(input.transcript_path, "utf8").includes('"type":"plan_mode_exit"');
  } catch {
    return false;
  }
};

// The router is not model-invocable, so point at its file for prompts that skipped /cruise-control.
const router = fileURLToPath(new URL("../skills/cruise-control/SKILL.md", import.meta.url));

if (namesTicket && !isFromAgent && !isShip && input.permission_mode !== "plan" && !planApproved()) {
  const note = [
    "Plan gate: this prompt is about a ticket and the session is not in plan mode.",
    "Edit nothing. Research only, then call EnterPlanMode before any decision or edit.",
    `If cruise-control is not loaded in this session, read ${router} and follow its route for this prompt.`,
  ].join(" ");
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: note } }),
  );
}
