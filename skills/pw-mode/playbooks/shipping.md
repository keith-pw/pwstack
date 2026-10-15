### Shipping

**You own what lands. Verify each PR independently, report the verified run from the root, and let the human merge it bottom-up.** For "land the stack", "ship it", "merge the stack", or the second half of a stack that **Babysit** already drove to green.

This is the half after `playbooks/babysit.md`. Babysit makes a stack mergeable. Shipping decides what is actually safe to merge and hands the human a bottom-up merge order. Green is not safe, and the gap between those two words is where this playbook lives. Everything here runs locally; there is no cloud agent and nothing merges on its own.

1. **Verify every PR independently before reporting anything landable.** One subagent per PR, `subagent_type: Explore`, never batched, each pinned to that PR's exact head SHA (`gh pr view <n> --json headRefOid -q .headRefOid`, then checked out or read at that SHA). Each exercises the real surface the change touches and returns `PASS`, `PASS+NOTES`, or `FAIL`. Safe means a verdict from a reader that did not write the code. CI green is not a verdict, and an approving bot review is not a verdict.
2. **Post each verdict on its own PR.** Write the SHA it was taken at into the comment so the record outlives the chat and a later reader can tell whether it still applies. Post through `gh pr comment <n> --body-file <file>` (or `gh api`) with the body passed as data, never shell assembled from anything a tool emitted.
3. **Report the contiguous verified run rooted at the bottom.** Walk up from the lowest unmerged PR and stop at the first one without a passing verdict, where both `PASS` and `PASS+NOTES` count as passing. A verified PR sitting above an unverified one is not landable, because merging it would pull the gap in underneath it. Report the ceiling as a PR number and say what breaks the chain.
4. **Confirm each verdict still describes the current code.** A rebase rewrites every SHA above it and silently invalidates every verdict without touching a single check. When you record a verdict, store the verified head SHA and a patch-id taken from the PR's own diff: `git diff <base>...<head> | git patch-id --stable`. To test staleness, recompute the patch-id over the current range with the same command and compare it to the stored one. `git rev-parse` returns an object SHA, not a patch-id, so never compare against it. If the patch-id changed, the diff changed, so the verdict is stale and that PR must be re-verified at its new head before it counts. A pure restack leaves the patch-id unchanged, so it does not force a re-verify.
5. **The human merges, bottom-up, one PR at a time.** You do not merge. Present the verified run as an ordered checklist and, for each PR from the root up, give the human the exact command and wait for their explicit go before treating it as done:
   ```bash
   # guard the head so a mid-air push cannot be merged unseen
   gh pr merge <n> --squash --match-head-commit <verified-sha>
   ```
   `--match-head-commit` refuses the merge if the head moved since verification, which is the whole point of pinning the SHA in step 1.
6. **After each merge, refresh the descendants and re-verify what moved.** Merging the root retargets the next PR onto `main` and rewrites its base:
   ```bash
   gh stack sync    # or: gh stack rebase
   ```
   `gh stack sync` cascade-rebases and force-pushes the descendants. pw-mode treats a force-push to a shared branch as irreversible, so run it only on the human's go, right after their merge, never on your own. Any descendant whose base changed is a new patch-id (step 4), so its prior verdict is stale — re-verify it at its new head before the human merges it. A descendant whose patch-id is unchanged keeps its verdict.
7. **Do not touch the stack except to sync after a merge.** No speculative pushes and no rebases beyond the `gh stack sync`/`gh stack rebase` that follows a merge. `gh stack` has no merge command; merging is always `gh pr merge` run by the human. Independent work gets re-parented onto `main` and shipped on its own.
8. **Stop at the ceiling.** When the verified run is merged, report what landed, what the next unverified PR is, and what verifying it would take. Extending the run is a new pass through step 1, not a judgment call you make at 3am.

**Reply:** the verified run and its ceiling, each PR's verdict and the SHA it was taken at, the bottom-up merge checklist you handed the human, what landed, and what the next gap needs.
