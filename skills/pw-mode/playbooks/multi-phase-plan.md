### Multi-phase or multi-PR plan

**You own the plan, not the code. The plan is a checklist a human runs box by box, one PR at a time.** For work that spans phases or stacked PRs. The plan is the deliverable. Do not implement.

1. When the change is one or two files with an obvious approach, skip the plan. Say so and stop.
2. Settle open questions by prototype before you write. For a question about layout, timing, behavior, or whether an API works, run `playbooks/prototype.md`. Keep the branch, the SHA, and the screenshots for the Prototype evidence appendix. Ask the human only about a product or preference call that no run can settle. Give options (the **never-block-on-the-human** principle skill).
3. Explore in subagents with `subagent_type: pwstack:pw-agent` and an explicit model per the Subagents section (the **guard-the-context-window** principle skill). Each returns file pointers, conventions, test commands, and entry points. No inlined dumps.
4. Copy the skeleton below into the plan file and fill every placeholder. Write the file in the app repo, under its `docs/`, unless the human names another path. Keep every heading and every sub-block in the order shown. One section per PR. One PR is one change with its own evidence (the **sequence-verifiable-units** principle skill).
5. Write under `/pwstack:technical-writing` in full, then `/pwstack:unslop`. The body is one Diataxis mode, how-to. Appendices hold explanation and reference. Each heading states the task or the finding. No long dashes. No mid-sentence colons.
6. Run `node ${CLAUDE_PLUGIN_ROOT}/skills/pw-mode/scripts/check-plan.mjs <plan.md>` and fix every line it prints (the **encode-lessons-in-structure** principle skill). It enforces the skeleton's shape, the verification rule in every verification block, the live-lane shape, and the punctuation rules.
7. Hand back. Post the plan path and the script's output, then stop. Execution starts on the human's explicit go, PR by PR.

**Verification.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked (the **prove-it-works** principle skill). That sentence is the verification rule. Every verification block opens with it. The live block is mandatory. It drives the real surface through the project's generated `verify-<app>` skill and saves a screenshot per lane. Lanes are a variable list, not a fixed count. Run them serially by default. Raise the parallel count above one only where each instance isolates with its own port, data directory, or profile, the same isolation rule the verification skills follow. The perf block names the metric, the probe, the trunk baseline measured first, and the rule with the number that fails. A PR that changes an interaction is review-gated. A human reviews screenshots and a video before merge. A PR that changes no interaction writes `**Review gate.** None. <PR id> is not review-gated.` and no boxes under it.

**Live surface.** The live block drives the app through its `verify-<app>` skill under `.claude/skills/`. If the repo has no such skill, generate one first with the **create-verification-skill** skill, then name it in each live block. A surface with no way to drive it is a risk in the Risks appendix, and its live block still states how each lane drives it by hand.

````markdown
# <Title> plan

<Under ten lines. What changes, for whom, the rule the plan enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it, a file, a log line, a screenshot, a test run, or a SHA. A nested box is a sub-step of the box above it. Check a box only when its evidence exists. The body is a how-to. The appendices explain and record.

Run the PRs bottom-up. A human reviews each review-gated PR from its screenshots and video, merges it, then the next PR rebases on the new trunk.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## <Task as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`.
- [ ] Create `<path>`.
- [ ] Delete `<path>`.

**Build.**

- [ ] <One change. Name the symbol and the file.>

**You see.**

- [ ] <One observable result, with the exact log line or screen state.>

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] <Test file and the case it gains.> Run `<command>`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Drive the surface through `verify-<app>`. Run lanes serially unless each instance isolates.

- [ ] Lane 1. <Scenario.> Save `<evidence file>`. Pass when <predicate>.
- [ ] Lane 2. <Scenario.> Save `<evidence file>`. Pass when <predicate>.

<Every live box is a numbered `Lane N.`, 1 to N with no gaps. Evidence is a saved screenshot for a UI, or a saved log, transcript, output, or response body for a CLI or API surface.>

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. <What is measured.>
- [ ] Probe. <The command or procedure, run at trunk and at the head, interleaved.>
- [ ] Baseline. Record the trunk <value> first.
- [ ] Rule. <Head against trunk, with the number that fails.>

**Review gate.** A human reviews before merge.

- [ ] Post the evidence for the human. For a UI surface, the lane screenshots and a 30 to 60 second video saved under `<media path>/`. For a CLI or API surface, the saved transcript, output, or response body from the lanes.
- [ ] Wait for the human to approve before you merge.
- [ ] Post the screenshots and the video in chat. Stop. Wait for the human to approve.

**Merge.**

- [ ] Every box above is checked with its evidence.
- [ ] PR review triage done per `${CLAUDE_PLUGIN_ROOT}/skills/pw-mode/references/pr-review-triage.md`.
- [ ] Rebased onto current trunk after the verdict.
- [ ] Merge bottom-up. Run `gh pr merge <pr-id> --match-head-commit <sha>` so a stale head cannot land.
- [ ] Refresh the descendants. Run `gh stack sync`.

## Close

- [ ] Every PR above is merged with its evidence recorded.
- [ ] Reply to the human with the merged PR ids and the open items, if any.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links. Each question that stays unproven.>

## Appendix B. Alternatives rejected

<Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk with the PR it lands in and what the human watches.>

## Appendix D. Links and reading list

<Docs to read before editing. Which PRs get `/pwstack:how` and `/pwstack:interrogate`. The trail per `/pwstack:show-me-your-work`.>
````

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, what the prototypes proved and what stays unproven, and the check script's output.
