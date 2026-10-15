# Widget refresh plan

Move the widget list off the legacy store and onto the new feed, for the app's home screen. The plan enforces one rule. No PR merges without its unit, live, and perf boxes checked. PR ids in order are fx-1 then fx-2.

## How to read this

One box is one unit of work. Every box names the evidence that checks it, a file, a log line, a screenshot, a test run, or a SHA. A nested box is a sub-step of the box above it. Check a box only when its evidence exists. The body is a how-to. The appendices explain and record.

Run the PRs bottom-up. A human reviews each review-gated PR, merges it, then the next PR rebases on the new trunk.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Add the feed reader (fx-1)

**Depends on.** None.

**Files.**

- [ ] Create `src/feed/reader.ts`.

**Build.**

- [ ] Add `readFeed` in `src/feed/reader.ts`.

**You see.**

- [ ] The home screen lists widgets from the feed, with the log line `feed ready`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `src/feed/reader.test.ts` gains a case for an empty feed. Run `npm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Drive the surface through `verify-app`.

- [ ] Lane 1. Open the home screen with a full feed. Save `fx-1-full.png`. Pass when the list shows every widget.
- [ ] Lane 2. Open the home screen with an empty feed. Save `fx-1-empty.png`. Pass when the empty state shows.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. First render time of the home screen.
- [ ] Probe. Load the home screen ten times at trunk and at the head, interleaved.
- [ ] Baseline. Record the trunk median first.
- [ ] Rule. Head fails if the median is over 10 percent above trunk.

**Review gate.** A human reviews before merge.

- [ ] Copy the lane screenshots into `docs/media/fx-1-review-home.png`.
- [ ] Record a 40 second video of the refreshed list. Save it as `docs/media/fx-1-review.mp4`.
- [ ] Post the screenshot and the video in chat. Wait for the human to approve.

**Merge.**

- [ ] Every box above is checked with its evidence.
- [ ] Merge bottom-up. Run `gh pr merge fx-1 --match-head-commit <sha>`, then `gh stack sync`.

## Drop the legacy store (fx-2)

**Depends on.** fx-1.

**Files.**

- [ ] Delete `src/store/legacy.ts`.

**Build.**

- [ ] Remove the `legacyStore` export from `src/store/legacy.ts`.

**You see.**

- [ ] The build emits no reference to `legacyStore`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `src/store/index.test.ts` drops the legacy case. Run `npm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Drive the surface through `verify-app`.

- [ ] Lane 1. Open the home screen after the removal. Save `fx-2-home.png`. Pass when the list still renders from the feed.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Bundle size of the home chunk.
- [ ] Probe. Build at trunk and at the head, interleaved.
- [ ] Baseline. Record the trunk byte count first.
- [ ] Rule. Head fails if the chunk grows at all.

**Review gate.** None. fx-2 is not review-gated.

**Merge.**

- [ ] Every box above is checked with its evidence.
- [ ] Merge bottom-up. Run `gh pr merge fx-2 --match-head-commit <sha>`, then `gh stack sync`.

## Close

- [ ] Every PR above is merged with its evidence recorded.
- [ ] Reply to the human with the merged PR ids and the open items, if any.

## Appendix A. Prototype evidence

The feed API returns widgets in under 50 milliseconds, proven on branch `proto/feed` at SHA `abc1234`, screenshot `docs/media/proto-feed.png`. No question stays unproven.
