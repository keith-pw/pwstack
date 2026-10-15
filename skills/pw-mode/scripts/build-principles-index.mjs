#!/usr/bin/env node
// Generates the "## Principles" index for pw-mode from pwstack's OWN principle
// leaf skills, so the index never drifts from the source descriptions.
// Reads every skills/principle-*/SKILL.md, parses `name` + `description` from
// frontmatter, and prints a grouped markdown index (one bullet per principle).
// Run: node skills/pw-mode/scripts/build-principles-index.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SKILLS_DIR = path.resolve(fileURLToPath(import.meta.url), "../../../..", "skills");

// Group order mirrors the leaf-skill families; any slug missing here lands in
// "Other" rather than being dropped, so a new principle can never go silent.
const GROUPS = [
	["Core", [
		"principle-laziness-protocol",
		"principle-foundational-thinking",
		"principle-redesign-from-first-principles",
		"principle-subtract-before-you-add",
		"principle-minimize-reader-load",
		"principle-outcome-oriented-execution",
		"principle-experience-first",
		"principle-exhaust-the-design-space",
		"principle-build-the-lever",
	]],
	["Architecture", [
		"principle-model-the-domain",
		"principle-boundary-discipline",
		"principle-type-system-discipline",
		"principle-make-operations-idempotent",
		"principle-migrate-callers-then-delete-legacy-apis",
		"principle-separate-before-serializing-shared-state",
	]],
	["Verification", [
		"principle-prove-it-works",
		"principle-fix-root-causes",
		"principle-sequence-verifiable-units",
	]],
	["Delegation", [
		"principle-guard-the-context-window",
		"principle-never-block-on-the-human",
	]],
	["Meta", [
		"principle-encode-lessons-in-structure",
	]],
];

function parseFrontmatter(text) {
	const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return {};
	const out = {};
	for (const line of m[1].split(/\r?\n/)) {
		const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
		if (!kv) continue;
		let value = kv[2].trim();
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		out[kv[1]] = value;
	}
	return out;
}

// slug -> Title Case display name.
function titleFor(slug) {
	return slug
		.replace(/^principle-/, "")
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

const principles = new Map();
for (const entry of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
	if (!entry.isDirectory() || !entry.name.startsWith("principle-")) continue;
	const file = path.join(SKILLS_DIR, entry.name, "SKILL.md");
	if (!fs.existsSync(file)) continue;
	const fm = parseFrontmatter(fs.readFileSync(file, "utf8"));
	const name = fm.name || entry.name;
	if (!fm.description) {
		console.error(`missing description: ${name}`);
		process.exit(1);
	}
	principles.set(name, fm.description.trim());
}

const placed = new Set();
const lines = [];
let count = 0;
for (const [group, slugs] of GROUPS) {
	const bullets = [];
	for (const slug of slugs) {
		const desc = principles.get(slug);
		if (!desc) continue;
		placed.add(slug);
		count += 1;
		bullets.push(`- **${titleFor(slug)}** (**${slug}**). ${desc}`);
	}
	if (bullets.length === 0) continue;
	lines.push(`**${group}**`, "", ...bullets, "");
}

const leftover = [...principles.keys()].filter((s) => !placed.has(s)).sort();
if (leftover.length) {
	lines.push("**Other**", "");
	for (const slug of leftover) {
		count += 1;
		lines.push(`- **${titleFor(slug)}** (**${slug}**). ${principles.get(slug)}`);
	}
	lines.push("");
}

process.stdout.write(lines.join("\n").replace(/\n+$/, "\n"));
console.error(`\nprinciples: ${count}`);
