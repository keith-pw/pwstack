#!/usr/bin/env node
// pwstack port gauntlet. Dependency-free. Asserts the tree carries no Cursor
// couplings, no dropped-item references, and no stale poteto/pstack names.
// Run: node scripts/gauntlet.mjs   (exit 0 clean, 1 on any hit)
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(process.argv[2] ?? ".");

// Files allowed to mention the banned terms as prose (this port's own record).
const ALLOW_FILES = new Set(["PORTING.md", "docs/README.md", "README.md", "LICENSE"]);
// Never scan these.
const SKIP_DIRS = new Set([".git", "node_modules", ".claude"]);
const SKIP_FILES = new Set(["scripts/gauntlet.mjs"]);
const EXTS = new Set([".md", ".mjs", ".js", ".ts", ".json", ".sh", ".yaml", ".yml", ""]);

// Each rule: a name and a regex in SKILL-form so ordinary English does not trip it.
const RULES = [
	["stale name: poteto", /poteto/i],
	["stale name: pstack", /\bpstack\b/],
	["cursor path", /\.cursor\b/],
	["cursor transcripts", /agent-transcripts/],
	["cursor models file", /pstack-models|\.mdc\b/],
	["non-claude model (grok)", /grok-/i],
	["non-claude model (gpt)", /\bgpt-5/i],
	["cursor thinking slug", /-thinking-(max|xhigh|high)/],
	["cloud env", /environment:\s*["']cloud["']/],
	["cloud base branch", /cloud_base_branch/],
	["cursor-team-kit", /cursor-team-kit/],
	["control-cli dep", /control-cli/],
	["control-ui dep", /control-ui/],
	["deslop", /\bdeslop\b/],
	["cursor automations endpoint", /api2\.cursor\.sh/],
	["graphite cli", /\bgt (submit|create|sync|restack|track|log|modify|merge|up|down|stack|checkout)\b/],
	["graphite name", /graphite/i],
	["cursor AskQuestion tool", /\bAskQuestion\b/],
	["skill-creator dep", /skill-creator/],
	["cursor readonly flag", /readonly:\s*true/],
	["plugin path leak", /git show origin\/main:pwstack/],
	["cursor subagent type", /generalPurpose/],
	["old agent name", /poteto-agent|Comment Sicko/],
	// Dropped items in skill-form (slash, bold, or playbook path).
	["dropped skill: reflect", /\/reflect\b|\*\*reflect\*\*/],
	["dropped skill: recall", /\/recall\b|\*\*recall\*\*/],
	["dropped skill: make-bot-ui", /make-bot-ui/],
	["dropped skill: automate-me", /automate-me/],
	["dropped: benny", /\bbenny\b/i],
	["dropped playbook: eval", /playbooks\/eval\.md/],
	["dropped playbook: session-pickup", /session-pickup/],
	["dropped playbook: worktree-cleanup", /worktree-cleanup|worktree-audit/],
	["dropped playbook: orchestrate", /playbooks\/orchestrate\.md|\borchestrate\b/i],
	["dropped playbook: autopilot", /autopilot-(full|stack)/],
	["dropped playbook: autonomous-run", /autonomous-run/],
	["dropped playbook: pause-safely", /pause-safely/],
];

function walk(dir, rel = "") {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const relPath = rel ? `${rel}/${entry.name}` : entry.name;
		if (entry.isDirectory()) {
			if (SKIP_DIRS.has(entry.name)) continue;
			out.push(...walk(path.join(dir, entry.name), relPath));
		} else {
			if (SKIP_FILES.has(relPath)) continue;
			if (!EXTS.has(path.extname(entry.name))) continue;
			out.push(relPath);
		}
	}
	return out;
}

const problems = [];
for (const rel of walk(ROOT)) {
	if (ALLOW_FILES.has(rel)) continue;
	const lines = fs.readFileSync(path.join(ROOT, rel), "utf8").split(/\r?\n/);
	lines.forEach((text, i) => {
		for (const [name, rx] of RULES) {
			if (rx.test(text)) problems.push(`${rel}:${i + 1}: ${name} :: ${text.trim().slice(0, 120)}`);
		}
	});
}

for (const p of problems) console.error(p);
console.log(`gauntlet: ${problems.length} problem(s)`);
process.exit(problems.length ? 1 : 0);
