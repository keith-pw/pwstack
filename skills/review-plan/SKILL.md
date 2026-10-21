---
name: review-plan
description: Adversarial review of a design plan by four reviewers in parallel (Haiku rules check, Sonnet gap hunt, Sonnet principles check, GPT via opencode), triaged by a review-lead agent. Then fix the plan. Use from the cruise-control Ticket playbook after the plan is written, or when asked to review or attack a plan.
argument-hint: "<PWDEV-N>: <title>"
---

# Review plan

Review: $ARGUMENTS

The reviewers attack the plan. The `review-lead` agent merges their findings and challenges each one. You get only its report. You still decide every fix.

## 1. Start the review

Start the `review-lead` agent (shown as `pwstack:review-lead`) with this prompt:

```text
Mode: plan
Round: 1
Ticket: <PWDEV-N>: <title>
Acceptance criteria: <the list from the issue>
Principles: <the absolute path of ${CLAUDE_SKILL_DIR}/../../principles>
Plan file: <absolute path>
```

Give only these facts. Do not add your reasoning or your opinion of the plan.

It can take several minutes. The GPT reviewer runs opencode with the sandbox off, so the user approves that command.

## 2. Act on the report

- **A reviewer failed:** tell the user which one and why, in one line. Go on with the rest.
- **Confirmed:** change the plan. Design the fix yourself and look for the simplest one (an existing pattern, a smaller change). Use the fix direction only when it is the best one. A fix that needs a big decision: run `/decide`.
- **Contested:** do the check that the report names. If it needs a product or design choice, run `/decide`.
- **Debt and Dismissed:** no change. Keep them for the Review section.

## 3. Round 2

Run round 2 only when a blocking or major finding changed the plan. Use a new `review-lead` with `Round: 2` and the list of findings you fixed. Two rounds at most.

## 4. Report

Fill in the plan's **Review** section:

- One line per confirmed or contested finding: fixed, or not fixed and why.
- One line with the dismissed count and the reasons in a few words.
- Any reviewer that failed.
